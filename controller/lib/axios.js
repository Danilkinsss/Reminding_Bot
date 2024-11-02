require('dotenv').config()
const axios = require('axios')

const TOKEN = process.env
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`

function axiosInstance() {
  return {
    get(method, params) {
      return axios.get
    },
    // post(method, data) {},
  }
}

module.exports = { axiosInstance }
