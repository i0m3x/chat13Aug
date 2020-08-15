const yo = require('yo-yo')

// to GET and POST messages, we use javascript's built-in function "fetch"
// fetch returns a "promise", which is a fancy object representing an asynchronous computation
// We call ".then" and ".catch" on the promise object where we can register success and error callbacks respectively.

// document.body.appendChild(yo`<h1>This is a test!</h1>`)

let listOfMessages = undefined
let currentChannel = "home"

function makeList(messages){
    return yo`<div id="list">
          <ul>
          <li>The current channel is ${currentChannel}</li>
          ${messages.map(message => {
              return yo`<li>${message.username}:${message.text}</li>`
          })}
          </ul>
          </div>`
}

function postMessage (text, channel, username) {
    console.log('posting message')
    fetch('/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: username, channel: channel, text: text, date: new Date() })
    })
      .then(data => {
        console.log('Success:', data)
        getMessages()
      })
      .catch((error) => {
        console.error('Error:', error)
      })
}
  
function getMessages () {
    fetch('/messages')
    .then(response => response.json())
    .then(data => {

        displayMessages = []
        for(let i = 0; i < data.messages.length; i++){
            let message = JSON.parse(data.messages[i])
            if(message.channel === currentChannel){
              displayMessages.push(message)

            }
        }
        if(displayMessages.length === 0) {
          alert(`no messages in ${currentChannel}, making a new channel... `)
        }

        listOfMessages = makeList(displayMessages)
        
        if(document.getElementById('list') != null){
            document.body.removeChild(document.getElementById('list'))
        }
        
        yo.update(listOfMessages, makeList(displayMessages))
        document.body.appendChild(listOfMessages)

        console.log(displayMessages)

        //create function that shows chan

    })
}
getMessages()
// setInterval(function(){ getMessages() }, 1000);

sendMessage.addEventListener('click', function(event){
    postMessage(document.querySelector('#message').value, 
    currentChannel,
    document.querySelector('#username_box').value)
    console.log(document.querySelector('#username_box').value)
  //  getMessages() async needed - it runs simulataneously -we need lag
})

sendChannel.addEventListener('click', function(event){
    currentChannel = document.querySelector("#channel_box").value
    getMessages()


})

