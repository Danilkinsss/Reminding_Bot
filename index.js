// ngrok http 5000

require('dotenv').config()
const express = require('express')
const axios = require('axios')

// const { users, User, Message } = require('./data.js')
const { insertData } = require('./db/insert-data.js')
// TODO: not used
const { handleMessage } = require('./controller/lib/telegram.js')
const { handler } = require('./controller/index.js')

const { TOKEN, SERVER_URL } = process.env
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`
const URI = `/webhook/${TOKEN}`
const WEBHOOK_URL = SERVER_URL + URI

const app = express()
app.use(express.json())

const init = async () => {
  const res = await axios
    .get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`)
    .then((res) => console.log(res.data))
    .catch((error) => console.log(error))
}

/*


*/

app.post(URI, async (req, res) => {
  console.log('\n-------------------\nMessage recieved📩\n-------------------')
  console.log(req.body)

  //TODO: not used
  // res = handler(req.body)

  const chatID = req.body.message.chat.id

  // handling message type and text
  let messageType = null
  let text = req.body.message.text || null
  if (text !== null) {
    if (text.charAt(0) === '/') {
      messageType = 'command'
    } else {
      messageType = 'text'
    }
  } else {
    if (req.body.message.photo) {
      messageType = 'photo'
    } else if (req.body.message.video) {
      messageType = 'video'
    }
    text = req.body.message.caption
  }

  // addition to the db
  insertData([req.body], 'telegram', messageType)

  // sending of the message (as a confirmation of successful receiving)

  console.log('\n-------------------\nMessage send🔝\n-------------------')
  switch (messageType) {
    case 'text':
      await axios
        .post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: chatID,
          text: text,
        })
        .then((res) => console.log(res.data))
        .catch((error) => console.log(error))
      break
    case 'photo':
      await axios
        .post(`${TELEGRAM_API}/sendPhoto`, {
          chat_id: chatID,
          photo: req.body.message.photo[0].file_id,
          caption: text,
        })
        .then((res) => console.log(res.data))
        .catch((error) => console.log(error))
      break
    case 'video':
      // console.log(req.body.message.video.file_id || undefined)
      await axios
        .post(`${TELEGRAM_API}/sendVideo`, {
          chat_id: chatID,
          video: req.body.message.video.file_id,
          caption: text,
        })
        .then((res) => console.log(res.data))
        .catch((error) => console.log(error))
      break
    case 'command':
      await axios
        .post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: chatID,
          text: `Thank you for your ${text} command, we are working on it(or not...)`,
        })
        .then((res) => console.log(res.data))
        .catch((error) => console.log(error))
      break
    default:
      console.log('❌❌❌ Unsupported message type')
      break
  }

  // if (text !== null) {
  //   console.log('\n-------------------\nMessage send🔝\n-------------------')
  //   await axios
  //     .post(`${TELEGRAM_API}/sendMessage`, {
  //       chat_id: chatID,
  //       text: text,
  //     })
  //     .then((res) => console.log(res.data))
  //     .catch((error) => console.log(error))
  // } else {
  //   await axios
  //     .post(`${TELEGRAM_API}/sendPhoto`, {
  //       chat_id: chatID,
  //       photo: photoFileID,
  //       caption: caption,
  //     })
  //     .then((res) => console.log(res.data))
  //     .catch((error) => console.log(error))
  // }

  return res.sendStatus(200)
})

/*


*/

app.listen(process.env.PORT || 5000, async () => {
  console.log('🍩 App is running! on port: ', process.env.PORT || 5000)
  await init()
})
