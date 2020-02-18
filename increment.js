const axios = require('axios')

function increment() {
    axios.get('https://moscowbsb.herokuapp.com/smiirl/upOne')
}

increment();