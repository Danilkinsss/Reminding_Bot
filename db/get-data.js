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

      //   const document = await col.findOne(filter)
      // const document2 = col.aggregate([{ $sample: { size: 1 } }])

      const filter = {}
      // const document3 = await col.getIndexes({})
      // const document = await col.aggregate([{ $sample: { size: 1 } }])
      // const document = await col.findOne()
      const document = collections.find({})
      const elements = []
      console.log('\tfor awaits start:\n')
      for await (const doc of document) {
        elements.push(doc)
        console.log(doc)
      }
      console.log('\tfor awaits finish:\n')
      // Print results
      //
      // const result = JSON.stringify(document)
      console.log(elements)
      return elements // "null" or not null (object)
    } finally {
      await client.close()
    }
  }

  return run()
}

module.exports = {
  getData,
}
