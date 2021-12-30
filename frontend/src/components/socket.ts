

const { Server } = require("socket.io");
const io = new Server(aerver);

const socket = io("http:://localhost:3000")

const message = document.getElementById('message');
const messages = document.getElementById('messages');

const handlesSubmitNewMessages = () =>{
    // extract the data property/ looks at inputfield message and then extracts the value. 
    socket.emit('message', {data: message.value})
} 

// listen to incoming messages 