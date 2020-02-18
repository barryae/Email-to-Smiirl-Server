const MuleNumber = require('./model')

function increment() {
    MuleNumber.findOne({ title: "MuleNumber" })
        .then(result => {
            MuleNumber.updateOne({ title: "MuleNumber" }, { number: (result.number + 1) })
                .then(result => {
                    console.log(result)
                    res.json(result)
                })
                .catch(err => {
                    res.status(422).json(err)
                })
        })
        .catch(err => {
            res.status(422).json(err)
        })
}
increment();