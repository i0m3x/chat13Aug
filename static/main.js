const yo = require('yo-yo')
var socket = require('socket.io');

let listOfRooms = undefined
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

function makeRooms(rooms){
    return yo`<div id="room_box">
              <select name="rooms" id="rooms">
              ${rooms.map(room => {
                return yo `<option value=${room}>
                          ${room}
                          </option>`
              })}
              </select>
              <button id="select_room">Submit
              </button>
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
      console.log(data)
        displayMessages = []
        let rooms = {}
        for(let i = 0; i < data.messages.length; i++){
            let message = data.messages[i]
            rooms[message.channel] = true

            if(message.channel === currentChannel && message.text != ""){
              displayMessages.push(message)

            }
        }
        console.log(rooms)
        if(displayMessages.length === 0) {
          alert(`no messages in ${currentChannel}, making a new channel... `)
        }
        listOfRooms = makeRooms(Object.keys(rooms))
        listOfMessages = makeList(displayMessages)
        
        if(document.getElementById('room_box') != null){
          document.body.removeChild(document.getElementById('room_box'))
        }

        yo.update(listOfRooms, makeRooms(Object.keys(rooms)))
        document.body.appendChild(listOfRooms)

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

sendMessage.addEventListener('click', () => {
  socket.emit(
    //name of the event being emitted to the backend socket
    'chat message',
    // content of the emit-ion
    JSON.stringify({ 
      username: document.querySelector('#username_box').value, 
      channel: currentChannel,
      text: document.querySelector('#message').value,
      date: new Date()
    })
  )
})

sendChannel.addEventListener('click', function(event){
    currentChannel = document.querySelector("#channel_box").value
    postMessage("", currentChannel, "", "")
    
    
  })
  
  select_room.addEventListener('click', function(event){
    currentChannel = document.querySelector('#rooms').value
    getMessages()
    
})