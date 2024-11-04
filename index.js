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
  const messageDate = req.body.message.date
  const myDate = new Date(messageDate * 1000)
    .toString()
    .split(' ')
    .slice(1, 4)
    .join(' ')

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

  // addition message to the db
  if (
    messageType !== 'command' &&
    messageType !== 'text' &&
    messageType !== 'video' &&
    messageType !== 'photo'
  ) {
    await axios
      .post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatID,
        text: 'Unsupported data type❌',
      })
      .then((res) => console.log(res.data))
      .catch((error) => console.log(error))
    return new Error('Unsupported data type❌')
  }

  if (messageType !== 'command') {
    insertData([req.body], 'telegram', messageType)
  }

  // sending of the message (as a confirmation of successful receiving)

  console.log('\n-------------------\nMessage send🔝\n-------------------')
  await axios
    .post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatID,
      text: 'Your data was saved successfully🌟',
    })
    .then((res) => console.log(res.data))
    .catch((error) => console.log(error))
  switch (messageType) {
    case 'text':
      await axios
        .post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: chatID,
          text: `text:  "${text}"\ndate:  ${myDate}`,
        })
        .then((res) => console.log(res.data))
        .catch((error) => console.log(error))
      break
    case 'photo':
      await axios
        .post(`${TELEGRAM_API}/sendPhoto`, {
          chat_id: chatID,
          photo: req.body.message.photo[0].file_id,
          caption: `caption:  "${text}"\ndate:  ${myDate}`,
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
          caption: `caption:  "${text}"\ndate:  ${myDate}`,
        })
        .then((res) => console.log(res.data))
        .catch((error) => console.log(error))
      break
    case 'command':
      switch (text) {
        case '/start':
          await axios
            .post(`${TELEGRAM_API}/sendMessage`, {
              chat_id: chatID,
              text: `Hello there!👋\nWelcome to the reminding bot!🤓\nSend me some message/photo/video, I will save them and then, with /get_reminder command, I will send you a random uploaded one.🤩🤩`,
            })
            .then((res) => console.log(res.data))
            .catch((error) => console.log(error))
          break

        case '/help':
          await axios
            .post(`${TELEGRAM_API}/sendMessage`, {
              chat_id: chatID,
              text: `Here is the list of all commands:\n/start - check if the bot is active and get recieve a greeting\n/help - see all commands\n/get_reminder - get a random reminder`,
            })
            .then((res) => console.log(res.data))
            .catch((error) => console.log(error))
          break

        default:
          await axios
            .post(`${TELEGRAM_API}/sendMessage`, {
              chat_id: chatID,
              text: `Undefined command: ${text} (sry we can't do much)`,
            })
            .then((res) => console.log(res.data))
            .catch((error) => console.log(error))
          break
          break
      }
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
