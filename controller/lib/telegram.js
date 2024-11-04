const { axiosPost } = require('./axios')

async function sendMessage(messageObj, messageText) {
  console.log('------------------------In telegram sendMessage')
  return await axiosPost('sendMessage', {
    chat_id: messageObj.chat.id,
    text: messageText,
  })
}

async function handleMessage(messageObj) {
  console.log('-----------------------In telegram handleMessage')
  const messageText = messageObj.text || ''
  if (messageText.charAt(0) === '/') {
    await sendMessage(messageObj, `Nice command:  ${messageText}`)
  } else {
    await sendMessage(messageObj, `Here is your message: ${messageText}`)
  }
  return messageObj
}

module.exports = { handleMessage }
