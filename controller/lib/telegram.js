const { axiosInstance } = require('./axios')

function sendMessage(messageObj, messageText) {
  return axiosInstance.get('sendMessage', {
    chat_id: messageObj.chat.id,
    text: messageText,
  })
}

function handleMessage(messageObj) {
  const messageText = messageObj.text || ''
  if (messageText.charAt(0) === '/') {
    sendMessage(messageObj, `Nice command:  ${messageText}`)
  } else {
    sendMessage(messageObj, `Here is your message: ${messageText}`)
  }
  return messageObj
}

module.exports = { handleMessage }
