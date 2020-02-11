const express = require('express');

const app = express()

const port = process.env.PORT || 3000
const muleNumber = [5];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/smiirl/muleNumber', function (req, res) {
    res.json({ number: muleNumber[0] }); //
})

app.post('/smiirl/:number', function (req, res) {
    muleNumber[0] = req.params.number
})

app.listen(port, function () {
    console.log('App listening on PORT: ' + port)
})

// Use Imap to search my email per da

