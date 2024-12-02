// node insert-data.js
//
//
function insertData(mesObj, dbName, colName) {
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

      // Add a type to a document
      mesObj.type = colName

      // Insert the document into the specified collection
      const p = await col.insertOne(mesObj)
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
