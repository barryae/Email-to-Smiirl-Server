const mongoose = require('mongoose')

const MuleNumber = new mongoose.Schema({
    title: String,
    number: Number
})

module.exports = mongoose.model("model", MuleNumber, "muleNumber")