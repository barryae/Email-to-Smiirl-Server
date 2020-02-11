const express = require('express');
require('dotenv').config()
const app = express()
const PORT = process.env.PORT || 3000
const muleNumber = [5];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/smiirl/muleNumber', function (req, res) {
    res.json(muleNumber[0]); //
})

app.post('/smiirl/putNumber', function (req, res) {
    muleNumber.unshift(req.body)
})

app.listen(PORT, function () {
    console.log('App listening on PORT: ' + PORT)
})

// Use Imap to search my email per da

