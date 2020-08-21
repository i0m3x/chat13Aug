const http = require('http')
const path = require('path')
const st = require('st') // st is a useful module to make serving static files easier
// const Router = require('http-hash-router') // this module makes defining HTTP routes easier

const express = require('express')
const app = express()
const fs = require('fs')

const port = 8000
const MESSAGES_PATH = './messages.txt'

const server = require('http').createServer(app)
// similiar to a 'require' this allows us to use the request.body in our post request
app.use(express.json());
app.use(express.static('static'))

//make it work with express
//back end express
//front end unchanged
//then add websockets
//remove post route?
//remove get route


app.get('/messages', (req, res) => {
  console.log("got get request")
  getMessages(req, res)
})

app.post('/messages', (req, res) => {
  postMessage(req, res)
})



// this is the POST handler for /messages - this function should write a new message to the file
function postMessage (req, res) {
  
  // at this point, data should be the entire json payload of the request
  fs.readFile('./messages.json', function(err, dataJson){
    if(err){
      console.log(404)
      return err
    }
    console.log("You're inside the readFile")
    // take the buffer from the json, call toString to make it a string, then parse to JSON
    let message_list = JSON.parse(dataJson.toString())
    //push our req to it as a JSON object
    message_list.messages.push(req.body)
    // original buffer + req as string
      const dataToJson = JSON.stringify(message_list)
      
      fs.writeFile('./messages.json', dataToJson, (err) => {
        if(err){
          return res.status(500).send('Something is wrong here')
        }
        res.send(req.body);
      })
    })
}

// this is the GET handler for /messages
// this function should respond with the list of messages
function getMessages (req, res) {
  fs.readFile('./messages.json', function(err, data){
    if(err){
      return res.status(500).send('Something is wrong here')
    }
    let message_list = JSON.parse(data.toString())
    console.log(message_list)
    res.json(message_list)
  })
}

server.listen(port)
console.log('server listening on port:', port)
