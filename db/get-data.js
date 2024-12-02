function getData(dbName, colName) {
  const { MongoClient } = require('mongodb')

  require('dotenv').config()
  const { MONGODB } = process.env
  const uri = MONGODB
  const client = new MongoClient(uri)

  async function run() {
    try {
      // Connect to the Atlas cluster
      await client.connect()

      // Get the database and collection on which to run the operation
      const database = client.db(dbName)
      const collections = database.collection(colName)

      const document = collections.find({})
      const elements = []
      for await (const doc of document) {
        elements.push(doc)
      }
      console.log(elements)
      return elements
    } finally {
      await client.close()
    }
  }

  return run()
}

module.exports = {
  getData,
}
