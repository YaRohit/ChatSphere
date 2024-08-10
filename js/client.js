const socket = io('http://localhost:8000');

// Get DOM elements in a escpective js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// audio played on receiving mssg
var audio = new Audio('ting.mp3') ;

// function which will append event info to the container
const append = (message,position)=>{
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerText = message;
    messageElement.classList.add(position);
    messageContainer.append(messageElement);

    if(position =='left'){
        audio.play();
    }
}

// ask new user's name & let the server know
const username = prompt("Enter your name to join");
console.log("name :",username);
socket.emit('new-user-joined', username);

// if new user joins receive his name from server
socket.on('user-joined',username =>{
    append(`${username} joined the chat`,'right')
    audio.play();
})

// if the sever sends a mssg ,receive it
socket.on('receive',data =>{
    append(`${data.username}: ${data.message}`, 'left');
});

// if a user leaves chat , appent the info to container
socket.on('left',username =>{
    append(`${username} left the chat`, 'right')
});

// if form gets submitted send server the mssg
form.addEventListener('submit', (e)=>{  
    e.preventDefault();
    const message = messageInput.value ;
    append(`You: ${message}`,'right') ;
    socket.emit('send',message);
    messageInput.value=''
})