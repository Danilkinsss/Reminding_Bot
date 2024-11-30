function getData(dbName, colName) {
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

      //   const document = await col.findOne(filter)
      const document2 = col.aggregate([{ $sample: { size: 1 } }])
      // Print results
      // const result = JSON.stringify(document)
      const result = document2
      console.log('\taggregate done')
      return result // "null" or not null (object)
    } finally {
      await client.close()
    }
  }

  return run()
}

module.exports = {
  getData,
}
