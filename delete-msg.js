function deleteMessage(msgID, chatID) {
  async function run() {
    await axios
      .post(`${TELEGRAM_API}/deleteMessage`, {
        chat_id: chatID,
        message_id: msgID,
      })
      .then((res) => console.log(res.data))
      .catch((error) => console.log(error))
  }

  run()
}

module.exports = {
  deleteMessage,
}
