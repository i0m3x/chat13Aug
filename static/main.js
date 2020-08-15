const yo = require('yo-yo')

// to GET and POST messages, we use javascript's built-in function "fetch"
// fetch returns a "promise", which is a fancy object representing an asynchronous computation
// We call ".then" and ".catch" on the promise object where we can register success and error callbacks respectively.

// document.body.appendChild(yo`<h1>This is a test!</h1>`)

let listOfMessages = undefined

function makeList(messages){
    return yo`<div id="list">
          <ul>
          ${messages.map(message => {
              return yo`<li>${message.text}</li>`
          })}
          </ul>
          </div>`
}

function postMessage (text) {
    console.log('posting message')
    fetch('/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: text, date: new Date() })
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
            displayMessages.push(JSON.parse(data.messages[i]))
        }

        listOfMessages = makeList(displayMessages)
        
        if(document.getElementById('list') != null){
            document.body.removeChild(document.getElementById('list'))
        }
        
        yo.update(listOfMessages, makeList(displayMessages))
        document.body.appendChild(listOfMessages)

        console.log(displayMessages)
    })
}
getMessages()


sendMessage.addEventListener('click', function(event){
    
    postMessage(document.querySelector('#message').value)
  //  getMessages() async needed - it runs simulataneously -we need lag
})