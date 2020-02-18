const express = require('express');
const mongoose = require("mongoose");
const CronJob = require('cron').CronJob;
const MuleNumber = require("./model");
const amqp = require('amqp-connection-manager')
const AMQP_URL = process.env.CLOUDAMQP_URL || 'amqp://localhost';
if (!AMQP_URL) process.exit(1)
//Server
const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const WORKER_QUEUE = 'worker-queue'

// Create a new connection manager from AMQP
var connection = amqp.connect([AMQP_URL])
console.log('[AMQP] - Connecting....')

connection.on('connect', function () {
    process.once('SIGINT', function () { // Close conn on exit
        connection.close()
    })
    return console.log('[AMQP] - Connected!')
})

connection.on('disconnect', function (params) {
    return console.error('[AMQP] - Disconnected.', params.err.stack)
})
app.listen(port, function () {
    console.log('App listening on PORT: ' + port)
})

//DB Connection
mongoose.connect(process.env.MONGODB_URI);
//mongoose.connect("mongodb://localhost/mulenumber", { useNewUrlParser: true })

//Routing
app.get('/smiirl/muleNumber', function (req, res) {
    MuleNumber.findOne({ title: "MuleNumber" })
        .then(result => {
            console.log(result.number)
            res.json({ number: result.number })
        })
        .catch(err => {
            res.status(422).json(err)
        })
})

app.get('/smiirl/update/:number', function (req, res) {
    MuleNumber.update({ title: "MuleNumber" }, { number: req.params.number })
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            res.status(422).json(err)
        })
})



// ---------- To receive the execution task messages
let channelWrapper = connection.createChannel({
    json: true,
    setup: function (channel) {
        return Promise.all([
            channel.assertQueue(WORKER_QUEUE, { autoDelete: false, durable: true }),
            channel.prefetch(1),
            channel.consume(WORKER_QUEUE, onMessage)
        ])
    }
})

channelWrapper.waitForConnect()
    .then(function () {
        console.log('[AMQP] - Listening for messages on queue => ' + WORKER_QUEUE)
    })
    .catch(function (err) {
        console.error('[AMQP] - Error! ', err)
    })

// Process message from AMQP
function onMessage(data) {
    let message
    try {
        message = JSON.parse(data.content.toString())
    } catch (e) {
        console.error('[AMQP] - Error parsing message... ', data)
    }

    console.log('[AMQP] - Message incoming... ', message)
    channelWrapper.ack(data)
    if (!message) {
        return
    }

    switch (message.taskName) {
        case 'increaseByOne':
            MuleNumber.findOne({ title: "MuleNumber" })
                .then(result => {
                    MuleNumber.updateOne({ title: "MuleNumber" }, { number: (result.number + 1) })
                        .then(result => {
                            res.json(result)
                        })
                        .catch(err => {
                            res.status(422).json(err)
                        })
                })
                .catch(err => {
                    res.status(422).json(err)
                })
            break
        default:
            console.error('No task was found with name => ' + message.taskName)
    }
}



