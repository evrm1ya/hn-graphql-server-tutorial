const { MongoClient } = require('mongodb')

const MONGO_URL = 'mongodb://localhost:27017/hackernews'

// return collections the resolvers will use
module.exports = async () => {
  const db = await MongoClient.connect(MONGO_URL)
  return { 
    Links: db.collection('links'),
    Users: db.collection('users')
  }
}

