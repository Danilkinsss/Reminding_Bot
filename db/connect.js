// node connect.js
//
//
const { MongoClient } = require('mongodb')

require('dotenv').config()
const { MONGODB } = process.env
// Replace the following with your Atlas connection string
const url = MONGODB
// Connect to your Atlas cluster
const client = new MongoClient(url)

async function run() {
  try {
    await client.connect()
    console.log('Successfully connected to Atlas')
  } catch (err) {
    console.log(err.stack)
  } finally {
    await client.close()
  }
}

run().catch(console.dir)
