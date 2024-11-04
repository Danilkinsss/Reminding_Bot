require('dotenv').config()
const axios = require('axios')

const TOKEN = process.env
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`

async function axiosPost(method, data) {
  console.log('----------------------------------In axiosPost')
  // return {
  //   // get(method, params) {
  //   //   return axios.get()
  //   // },
  //   post(method, data) {
  // try {
  //   const res = await axios.post(`${TELEGRAM_API}/${method}`, {
  //     chat_id: data.chat_id,
  //     text: data.text,
  //   })
  //   return console.log(res.data)
  // } catch (error) {
  //   return console.log(error)
  console.log('🔥', data)
  await axios
    .post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: '300529652',
      text: 'testin',
    })
    .then((res) => console.log(res.data))
    .catch((error) => console.log(error.response.data))
  // }
  // },
  // }
}

module.exports = { axiosPost }
