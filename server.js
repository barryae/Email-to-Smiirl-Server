const express = require('express');
const mongoose = require("mongoose");
const CronJob = require('cron').CronJob;
const MuleNumber = require("./model");

const app = express()
const port = process.env.PORT || 3000


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

mongoose.connect(process.env.MONGODB_URI);
// mongoose.connect("mongodb://localhost/mulenumber", { useNewUrlParser: true })

app.get('/smiirl/update/:number', function (req, res) {
    MuleNumber.update({ title: "MuleNumber" }, { number: req.params.number })
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            res.status(422).json(err)
        })
})

app.listen(port, function () {
    console.log('App listening on PORT: ' + port)
})

const job = new CronJob("0 19,20,21,22,23,0,1,2 * * *", function () {
    muleNumber += 1
}, null, true, 'America/Kentucky/Monticello');
job.start();

