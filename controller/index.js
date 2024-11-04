const { handleMessage } = require('./lib/telegram.js')

async function handler(body) {
  console.log('-------------------In handler')
  if (body) {
    const messageObj = body.message
    await handleMessage(messageObj)
  }
  return
}

module.exports = { handler }
