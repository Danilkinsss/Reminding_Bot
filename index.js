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
const { getData } = require('./db/get-data.js')
const { deleteData } = require('./db/delete-data.js')

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
let previousType
let previousID

app.post(URI, async (req, res) => {
  console.log('\n-------------------\nMessage recieved📩\n-------------------')
  console.log(req.body)
  const messageTypes = ['command', 'text', 'photo', 'video']

  //TODO: not used
  // res = handler(req.body)
  // if (deleteMessage(954, 300529652)) {
  //   console.log('\t\tSuccessfull🌟')
  // }

  /*
  
  reply_markup 	   InlineKeyboardMarkup
  
  */

  // handling message type and its' text/file
  let messageType = 'undefined'
  if (!req.body.message) {
    await axios
      .post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: '300529652',
        text: '6969',
      })
      .then((res) => console.log(res.data))
      .catch((error) => console.log(error))

    return res.sendStatus(200)
  }
  let text = req.body.message.text || null
  let fileID = null
  if (text !== null) {
    if (text.charAt(0) === '/') {
      messageType = messageTypes[0] // command
    } else {
      messageType = messageTypes[1] // text
      fileID = text
    }
  } else {
    if (req.body.message.photo) {
      messageType = messageTypes[2] // photo
      fileID = req.body.message.photo[0].file_unique_id
    } else if (req.body.message.video) {
      messageType = messageTypes[3] // video
      fileID = req.body.message.video.file_unique_id
    }
    text = req.body.message.caption
  }

  // check if dataType is supported -> TODO: fix
  if (!messageTypes.includes(messageType)) {
    console.log('\n-------------------\nMessage send🔝\n-------------------')
    console.log('type:', messageType)
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
  if (messageType !== 'command') {
    dbMessage = await checkData(messageID, fileID, 'telegram', messageType)
    console.log('\t\t\t🔮🔮🔮dbMessage:\n', dbMessage)
    if (dbMessage == null) {
      insertData(req.body, 'telegram', messageType)

      await axios
        .post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: chatID,
          text: 'Your data was saved successfully🌟',
        })
        .then((res) => console.log(res.data))
        .catch((error) => console.log(error))
      dbMessage = await checkData(-1, fileID, 'telegram', messageType)
    }
    console.log('\t\t\t🔮🔮🔮dbMessage 2!:\n', dbMessage)
  }

  const formatedMessageDate =
    messageType !== 'command' ? formatTime(dbMessage.message.date) : 69

  // sending  the message (as a confirmation of successful saving/finding it)
  console.log('\n-------------------\nMessage send🔝\n-------------------')
  let messageData = { chat_id: chatID }
  let telegramMethod

  switch (messageType) {
    case 'text':
      messageData.text = `"${dbMessage.message.text}"\n🗓  ${formatedMessageDate}`
      telegramMethod = 'sendMessage'
      break
    case 'photo':
      messageData.caption = `🗓  ${formatedMessageDate}` //caption:  "${text}"\n
      messageData.photo = dbMessage.message.photo[0].file_id
      telegramMethod = 'sendPhoto'
      break
    case 'video':
      messageData.caption = `🗓  ${formatedMessageDate}` //caption:  "${text}"\n
      messageData.video = dbMessage.message.video.file_id
      telegramMethod = 'sendVideo'
      break
    case 'command':
      switch (text) {
        case '/start':
          messageData.text = `Hello there!👋\nWelcome to the Reminding Bot!🤖\nSend me some message/photo/video, I will save them, and with /get_reminder command, I will send you a random one.🛫`
          telegramMethod = 'sendMessage'
          break
        case '/help':
          messageData.text = `Here is the list of all commands:\n/start - check if the bot is active and get recieve a greeting\n/help - see all commands\n/get_reminder - get a random reminder`
          telegramMethod = 'sendMessage'
          break
        case '/delete':
          //TODO: finish deleteData method
          if (previousType !== undefined && previousID !== undefined) {
            await deleteData('telegram', previousType, previousID)
          } else {
            console.log('User tried to delete unsupported message')
          }

          break
        case '/button':
          messageData.text = `It's a message with inline button(s) after it`
          telegramMethod = 'sendMessage'
          messageData = {
            chat_id: chatID,
            text: 'ololo',
            reply_markup: {
              remove_keyboard: true,
              // keyboard: [['yes']],
              // resize_keyboard: true,
              // one_time_keyboard: true,
              // is_persistent: true,
              //
              // inline_keyboard: [
              //   [
              //     {
              //       text: 'A',
              //       url: 'http://www.google.com/',
              //     },
              //     {
              //       text: 'B',
              //       url: 'tg://user?id=134744986',
              //     },
              //     {
              //       text: 'C',
              //       copy_text: { text: 'sasi da' },
              //     },
              //   ],
              // ],
            },
            // {
            // inline_keyboard: [
            //   [
            //     {
            //       text: 'A',
            //       callback_data: 'A1',
            //       url: 'http://www.google.com/',
            //     },
            //     {
            //       text: 'B',
            //       url: 'tg://user?id=134744986',
            //     },
            //   ],
            // ],
            // keyboard: [[]],
            // },
          }

          /*
          const keyboard = {
            reply_markup: {
              inline_keyboard: [[{ text: '', callback_data: '' }]],
            },
          }

          bot.editMessageReplyMarkup(keyboard, {
            chat_id: msg.message.chat.id,
            message_id: msg.message.message_id,
          })
          */
          // await axios
          //   .post(`${TELEGRAM_API}/sendMessage`, replyData)
          //   .then((res) => console.log(res.data))
          //   .catch((error) => console.log(error))
          // return 201
          break
        case '/get_reminder':
          const allMessages = []
          for (let i = 1; i < messageTypes.length; i++) {
            const typeMessages = await getData('telegram', messageTypes[i])
            allMessages.push(...typeMessages)
          }

          // const messageFromDB = await getData('telegram', collection)
          console.log('🍌🍌🍌🍌🍌🍌', allMessages)
          const randomMessage =
            allMessages[Math.floor(Math.random() * allMessages.length)]
          const randomMessageTypeFormatedDate = formatTime(
            randomMessage.message.date
          )
          const randomMessageType = randomMessage.type
          console.log('🍏🍏🍏🍏🍏🍏🍏GET RANDOM:', randomMessage)

          switch (randomMessageType) {
            case 'text':
              messageData.text = `"${randomMessage.message.text}"\n🗓  ${randomMessageTypeFormatedDate}`
              telegramMethod = 'sendMessage'
              break
            case 'photo':
              messageData.caption = `🗓  ${randomMessageTypeFormatedDate}`
              messageData.photo = randomMessage.message.photo[0].file_id
              telegramMethod = 'sendPhoto'
              break
            case 'video':
              messageData.caption = `🗓  ${randomMessageTypeFormatedDate}`
              messageData.video = randomMessage.message.video.file_id
              telegramMethod = 'sendVideo'
              break
            default:
              messageData.text = `Unexpected data type inside /get_reminder...`
              telegramMethod = 'sendMessage'
              break
          }
          break

        default:
          messageData.text = `Undefined command: ${text} (sry we can't do much)`
          telegramMethod = 'sendMessage'
          break
      }
      break
    default:
      console.log('Error type!❌❌')
      messageData.text = `Undefined message type: ${messageType} (sry we can't do much)`
      telegramMethod = 'sendMessage'
      break
  }

  console.log('🍅🍅🍅🍅🍅', messageData)
  // reply_markup: {
  //   remove_keyboard: true,
  // keyboard: [['yes']],
  // resize_keyboard: true,
  // one_time_keyboard: true,
  // is_persistent: true,
  //
  // inline_keyboard: [
  //   [
  //     {
  //       text: 'A',
  //       url: 'http://www.google.com/',
  //     },
  //     {
  //       text: 'B',
  //       url: 'tg://user?id=134744986',
  //     },
  //     {
  //       text: 'C',
  //       copy_text: { text: 'sasi da' },
  //     },
  //   ],
  // ],
  // },
  // messageData.reply_markup = {
  //   inline_keyboard: [
  //     [
  //       {
  //         text: 'Button 1',
  //         // url: 'http://www.google.com/',
  //         callback_data: 'clicked',
  //         // copy_text: { text: 'sasi da' },
  //       },
  //     ],
  //   ],
  // }
  await axios
    .post(`${TELEGRAM_API}/${telegramMethod}`, messageData)
    .then((res) => console.log(res.data))
    .catch((error) => console.log(error))

  // const queryID = 69
  // const answerCallbackQueryObject = {
  //   query: queryID,
  //   text: `You successfully clicked the button`,
  // }

  // const answerCallbackQueryData = {
  //   chat_id: chatID,
  //   reply_markup: {
  //     inline_keyboard: [
  //       [
  //         {
  //           text: 'Button 2',
  //           // url: 'http://www.google.com/',
  //           // callback_data: 'clicked',
  //           copy_text: { text: 'sasi da' },
  //         },
  //       ],
  //     ],
  //   },
  // }
  // await axios
  //   .post(`${TELEGRAM_API}/editMessageReplyMarkup`, answerCallbackQueryData)
  //   .then((res) => console.log(res.data))
  //   .catch((error) => console.log(error))

  // const answerCallbackQueryData = {
  //   callback_query_id: 'clicked',
  //   text: 'skibidi',
  //   show_alert: true,
  // }
  // await axios
  //   .post(`${TELEGRAM_API}/answerCallbackQuery`, answerCallbackQueryData)
  //   .then((res) => console.log(res.data))
  //   .catch((error) => console.log(error))
  console.log('🍍🍍🍍🍍🍍🍍🍍', previousType, previousID)
  console.log('🍌🍌🍌🍌', dbMessage.type)
  previousType = dbMessage.type || null
  previousID = dbMessage._id
  console.log('🍍🍍🍍🍍🍍🍍🍍', previousType, previousID)

  return res.sendStatus(200)
})

app.listen(process.env.PORT || 5000, async () => {
  console.log('🍩 App is running! on port:', process.env.PORT || 5000)
  await init()
})

function formatTime(time) {
  return new Date(time * 1000).toString().split(' ').slice(1, 4).join(' ')
}
