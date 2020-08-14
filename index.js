const http = require('http')
const fs = require('fs')
const path = require('path')
const st = require('st') // st is a useful module to make serving static files easier
const Router = require('http-hash-router') // this module makes defining HTTP routes easier

const port = 8000

const MESSAGES_PATH = './messages.txt'

const mount = st({ path: path.join(__dirname, '/static'), url: '/static' })
const router = Router()

// going to /static/<file-name> will serve the file <file-name>
router.set('/static/*', mount)

// requests to /messages are either a GET or a POST
router.set('/messages', function (req, res) {
  if (req.method === 'GET') {
    getMessages(req, res)
  } else if (req.method === 'POST') {
    postMessage(req, res)
  } else {
    res.statusCode = 400
    res.end('unsupported operation')
  }
})

// this is the POST handler for /messages
// this function should write a new message to the file
function postMessage (req, res) {
  let data = ''
  req.on('data', function (chunk) {
    data += chunk
  })

  req.on('end', function () {
    // at this point, data should be the entire json payload of the request
    fs.readFile('./messages.json', function(err, dataJson){
        if(err){
            console.log(404)
            return err
        }

        let message_list = JSON.parse(dataJson.toString())

        message_list.messages.push(data)

        const dataToJson = JSON.stringify(message_list)

        fs.writeFile('./messages.json', dataToJson, function(err){
            if(err){
                console.log(404)
                return err
            }
            res.statusCode = 200
            res.end('Message posted successfully')
        })

        
    })
    // TODO: write code here to add the message to the messages file
    // hint: use fs.appendFile
    // make sure to separate each entry with a newline character

    // After writing to the file, we need to send up a response
    
  })
}

// this is the GET handler for /messages
// this function should respond with the list of messages
function getMessages (req, res) {
    fs.readFile('./messages.json', function(err, data){
        if(err){
            console.log(404)
            return err
        }
        let message_list = JSON.parse(data.toString())
        console.log(message_list)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(message_list))
    })
  // TODO: write code here to get your messages from the file
  // hint: use fs.readFile
  // you will need to split on newlines, filter out empty strings, and JSON.parse each object

  // here is an example of how your messages should be formatted after parsing them out from the file
//   const exampleMessages = [
//     { text: 'hello! This is an example message.', date: new Date() },
//     { text: 'This is another message.', date: new Date() }
//   ]

  // here we set the response code to 200 (success), and the content type to json
  // then we send up the response by stringifying the messages array
}

const server = http.createServer((req, res) => {
  router(req, res, {}, function onError (err) {
    if (err) {
      res.statusCode = err.statusCode || 500
      res.end(err.message)
    }
  })
})

server.listen(port)

console.log('server listening on port:', port)
