
import { Chatbox} from '/Chat/Chatbox';


const { Server } = require("socket.io");
const io = new Server(server);

const socket = io("http:://localhost:3000")

const message = document.getElementById('message');
const messages = document.getElementById('messages');

const handlesSubmitNewMessages = () => {
    // extract the data property/ looks at inputfield message and then extracts the value. 
    socket.emit('message', {data: message.value})
} 

// listen to incoming messages, and add it to our list of documents. 
socket.on('message', ({data}) =>{

})

const handleNewMessage = (messages) => {

    // new node
    messages.appendChild()
}


const buildNewMessage  = (message)