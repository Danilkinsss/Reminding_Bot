// node insert-data.js
//
//
function insertData(objsArr, dbName, colName) {
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

      // Create new documents
      console.log('🐛🐛🐛🐛', objsArr)
      objsArr.type = colName
      console.log('🐛🐛🐛🐛🐛🐛🐛🐛', objsArr)
      let collectionDocument = [objsArr]
      console.log('😻😻😻😻😻😻', collectionDocument)
      // const collectionDocument = [...objsArr, colName]

      // Insert the documents into the specified collection
      const p = await col.insertMany(collectionDocument)

      // Find the document
      //TODO: check if needed ↓↓↓
      const filter = { 'message.from.username': 'danilkinsss' }
      const document = await col.findOne(filter)

      // Print results
      console.log('Some file from danilkinsss:\n' + JSON.stringify(document))
    } catch (err) {
      console.log(err.stack)
    } finally {
      await client.close()
    }
  }

  run().catch(console.dir)
}

module.exports = {
  insertData,
}
