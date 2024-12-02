// node insert-data.js
//
// AQADBOIxG33-WUl4
// AQADBOIxG33-WUl4
//
// AgACAgIAAxkBAAIC5Gc8YId97_GR2wyyA64yEhOxJwccAAIE4jEbff5ZSQABSkki7zS8EQEAAwIAA3MAAzYE
// AgACAgIAAxkBAAIC5Gc8YId97_GR2wyyA64yEhOxJwccAAIE4jEbff5ZSQABSkki7zS8EQEAAwIAA3MAAzYE
function checkData(msgID, msgTextOrFile, dbName, colName) {
  const { MongoClient } = require('mongodb')

  require('dotenv').config()
  const { MONGODB } = process.env
  // Replace the following with your Atlas connection string
  const uri = MONGODB

  const client = new MongoClient(uri)

  async function run() {
    try {
      // Connect to the Atlas cluster
      await client.connect()

      // Get the database and collection on which to run the operation
      const db = client.db(dbName)
      const col = db.collection(colName)
      let filter = {}
      if (colName === 'text') {
        filter = {
          'message.text': { $eq: msgTextOrFile },
          'message.message_id': { $not: { $eq: msgID } },
        }
      } else if (colName === 'photo') {
        filter = {
          'message.photo.0.file_unique_id': { $eq: msgTextOrFile },
          'message.message_id': { $not: { $eq: msgID } },
        }
        console.log('--------hereeeeeeee', msgTextOrFile)
      } else if (colName === 'video') {
        filter = {
          'message.video.file_unique_id': { $eq: msgTextOrFile },
          'message.message_id': { $not: { $eq: msgID } },
        }
      } else {
        filter = {
          'message.check-for-data-error...': { $eq: msgTextOrFile },
          'message.message_id': { $not: { $eq: msgID } },
        }
      }
      const document = await col.findOne(filter)

      return document // "null" or not null (object)
    } finally {
      await client.close()
    }
  }

  return run()
}

module.exports = {
  checkData,
}
