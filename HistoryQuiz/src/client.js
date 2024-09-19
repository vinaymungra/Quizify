const {Redis} = require('ioredis')

const client = new Redis({
    host:'0.0.0.0', //127.0.0.1 when not running with docker file
    port:6379
})

module.exports = client