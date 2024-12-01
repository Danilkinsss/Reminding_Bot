// ngrok http 5000
// yarn dev

require('dotenv').config()
const express = require('express')
const axios = require('axios')

// const { users, User, Message } = require('./data.js')
const { insertData } = require('./db/insert-data.js')
const { checkData } = require('./db/check-for-data.js')

// TODO: not used
const { handleMessage } = require('./controller/lib/telegram.js')
const { handler } = require('./controller/index.js')
const { deleteMessage } = require('./delete-msg.js')
const { getData } = require('./db/get-data.js')

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

  // await axios
  //   .post(`${TELEGRAM_API}/deleteMessage`, {
  //     chat_id: 300529652,
  //     message_id: 890,
  //   })
  //   .then((res) => console.log(res.data))
  //   .catch((error) => console.log(error))
  // console.log('\tSuccessfull🌟')
}

/*


*/

app.post(URI, async (req, res) => {
  console.log('\n-------------------\nMessage recieved📩\n-------------------')
  console.log(req.body)

  //TODO: not used
  // res = handler(req.body)
  // if (deleteMessage(954, 300529652)) {
  //   console.log('\t\tSuccessfull🌟')
  // }

  // handling message type and its' text/file
  let messageType = null
  let text = req.body.message.text || null
  let fileID = null
  if (text !== null) {
    if (text.charAt(0) === '/') {
      messageType = 'command'
    } else {
      messageType = 'text'
      fileID = text
    }
  } else {
    if (req.body.message.photo) {
      messageType = 'photo'
      fileID = req.body.message.photo[0].file_unique_id
    } else if (req.body.message.video) {
      messageType = 'video'
      fileID = req.body.message.video.file_unique_id
    }
    text = req.body.message.caption
  }

  // check if dataType is supported -> TODO: fix
  if (
    messageType !== 'command' &&
    messageType !== 'text' &&
    messageType !== 'video' &&
    messageType !== 'photo'
  ) {
    console.log('\n-------------------\nMessage send🔝\n-------------------')
    console.log('type', messageType)
    await axios
      .post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatID,
        text: 'Unsupported data type❌❌❌',
      })
      .then((res) => console.log(res.data))
      .catch((error) => console.log(error))
    return res.sendStatus(200)
    // return new Error('Unsupported data type❌')
  }

  // getting useful variables
  const messageID = req.body.message.message_id
  const chatID = req.body.message.chat.id
  let dbMessage = null

  // addition message data to the db
  if (messageType === 'command') {
    console.log('\t\t\t It is a command type')
  } else {
    console.log('\t\t\t Here is the type:', messageType)
    dbMessage = await checkData(messageID, fileID, 'telegram', messageType)
    console.log('\t\t\t🔮🔮🔮dbMessage:\n', dbMessage)
    if (dbMessage == null) {
      insertData([req.body], 'telegram', messageType)

      await axios
        .post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: chatID,
          text: 'Your data was saved successfully🌟',
        })
        .then((res) => console.log(res.data))
        .catch((error) => console.log(error))
      dbMessage = await checkData(
        messageID + 1,
        fileID,
        'telegram',
        messageType
      )
    }
    console.log('\t\t\t🔮🔮🔮dbMessage 2!:\n', dbMessage)
  }

  const formatedMessageDate =
    messageType !== 'command'
      ? new Date(dbMessage.message.date * 1000)
          .toString()
          .split(' ')
          .slice(1, 4)
          .join(' ')
      : 69

  // sending  the message (as a confirmation of successful saving/finding it)
  console.log('\n-------------------\nMessage send🔝\n-------------------')
  switch (messageType) {
    case 'text':
      await axios
        .post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: chatID,
          text: `"${dbMessage.message.text}"\n🗓  ${formatedMessageDate}`,
        })
        .then((res) => console.log(res.data))
        .catch((error) => console.log(error))
      break
    case 'photo':
      await axios
        .post(`${TELEGRAM_API}/sendPhoto`, {
          chat_id: chatID,
          photo: dbMessage.message.photo[0].file_id,
          caption: `🗓  ${formatedMessageDate}`, //caption:  "${text}"\n
        })
        .then((res) => console.log(res.data))
        .catch((error) => console.log(error))
      break
    case 'video':
      // console.log(req.body.message.video.file_id || undefined)
      await axios
        .post(`${TELEGRAM_API}/sendVideo`, {
          chat_id: chatID,
          video: dbMessage.message.video.file_id,
          caption: `🗓  ${formatedMessageDate}`, //caption:  "${text}"\n
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
              text: `Hello there!👋\nWelcome to the Reminding Bot!🤖\nSend me some message/photo/video, I will save them, and with /get_reminder command, I will send you a random one.🛫`,
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

        case '/get_reminder':
          const options = ['text', 'photo', 'video']
          const collection = options[Math.floor(Math.random() * 3)]
          const messageFromDB = await getData('telegram', collection)
          const element =
            messageFromDB[Math.floor(Math.random() * messageFromDB.length)]
          const formatedMessageDate2 = new Date(element.message.date * 1000)
            .toString()
            .split(' ')
            .slice(1, 4)
            .join(' ')
          console.log('🍏🍏🍏🍏🍏🍏🍏GET RANDOM:', element)
          switch (collection) {
            case 'text':
              await axios
                .post(`${TELEGRAM_API}/sendMessage`, {
                  chat_id: chatID,
                  text: `"${element.message.text}"\n🗓  ${formatedMessageDate2}`,
                })
                .then((res) => console.log(res.data))
                .catch((error) => console.log(error))
              break
            case 'photo':
              await axios
                .post(`${TELEGRAM_API}/sendPhoto`, {
                  chat_id: chatID,
                  photo: element.message.photo[0].file_id,
                  caption: `🗓  ${formatedMessageDate2}`, //caption:  "${text}"\n
                })
                .then((res) => console.log(res.data))
                .catch((error) => console.log(error))
              break
            case 'video':
              // console.log(req.body.message.video.file_id || undefined)
              await axios
                .post(`${TELEGRAM_API}/sendVideo`, {
                  chat_id: chatID,
                  video: element.message.video.file_id,
                  caption: `🗓  ${formatedMessageDate2}`, //caption:  "${text}"\n
                })
                .then((res) => console.log(res.data))
                .catch((error) => console.log(error))
              break
          }
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
      }
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

app.listen(process.env.PORT || 5000, async () => {
  console.log('🍩 App is running! on port:', process.env.PORT || 5000)
  await init()
})
