const express = require('express');
const CronJob = require('cron').CronJob;

const app = express()

const port = process.env.PORT || 3000
const muleNumber = 210;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/smiirl/muleNumber', function (req, res) {
    res.json({ number: muleNumber[0] });
})

app.get('/smiirl/update/:number', function (req, res) {
    muleNumber[0] = req.params.number
    res.json('Updated Moscow Mule total to ' + muleNumber[0])
})

app.listen(port, function () {
    console.log('App listening on PORT: ' + port)
})

const job = new CronJob("0 19,20,21,22,23,0,1,2 * * *", function () {
    muleNumber[0] += 1
}, null, true, 'America/Los_Angeles');
job.start();

