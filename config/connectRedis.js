const redis=require('redis')

const client=redis.createClient(6379)
client.connect().catch(console.error)

module.exports=client