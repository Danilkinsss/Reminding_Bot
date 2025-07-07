function deleteData(dbName, colName, id) {
  const { MongoClient } = require('mongodb')

  require('dotenv').config()
  const { MONGODB } = process.env
  const uri = MONGODB
  const client = new MongoClient(uri)

  async function run() {
    try {
      // Connect to the Atlas cluster
      await client.connect()
      console.log('🟪🟪🟪IN DELETE')
      console.log('🟪🟪🟪', dbName, colName, id)

      // Get the database and collection on which to run the operation
      const database = client.db(dbName)
      const collection = database.collection(colName)

      const query = { _id: id }
      const result = await collection.deleteOne(query)
      if (result.deletedCount === 1) {
        console.log('Successfully deleted one document.')
      } else {
        console.log('No documents matched the query. Deleted 0 documents.')
      }

      return result
    } finally {
      await client.close()
    }
  }

  return run()
}

module.exports = {
  deleteData,
}
