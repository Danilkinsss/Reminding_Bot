// node insert-data.js
//
//
function checkData(msgTextOrFile, dbName, colName) {
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
      // AQADBOkxG7DTwUh4
      // AQADBOkxG7DTwUh4

      // Get the database and collection on which to run the operation
      const db = client.db(dbName)
      const col = db.collection(colName)
      let filter = {}
      if (colName === 'text') {
        filter = { 'message.text': msgTextOrFile }
      } else if (colName === 'photo') {
        filter = { 'message.photo.0.file_unique_id': msgTextOrFile }
        console.log('------hereeeeeeee', msgTextOrFile)
      } else {
        filter = { 'message.video.file_unique_id': msgTextOrFile }
      }
      const document = await col.findOne(filter)

      // Print results
      const result = JSON.stringify(document)
      console.log('Doooooooooooocument found:\n' + result)
      return result
    } finally {
      await client.close()
    }
  }

  run()
}

module.exports = {
  checkData,
}
