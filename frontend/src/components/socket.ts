

import { io } from "socket.io-client";

// this needs to be server out of chat.gateway



const socket = io("http://localhost:5000")

socket.on("connect", () => {
    console.log(socket.id); 
    console.log("do something with data");
  });
  

//const message = (<HTMLInputElement>document.getElementById('msgtosent'));
const messages = (<HTMLInputElement>document.getElementById('messages'));

export const handlesSubmitNewMessages = (message:string) => {
    // extract the data property/ looks at inputfield message and then extracts the value. 
    socket.emit('message', message);
    console.log(message);
} 

// listen to incoming messages, and add it to our list of documents. 
socket.on('message', (message:string) => {
    handleNewMessage(message);

})

// for chat history
const handleNewMessage = (message:string) => {
// new node appendchild 
    console.log(buildNewMessage);
    //messages.appendChild(buildNewMessage)
}

const buildNewMessage  = (message:string) =>{
    const li  = document.createElement("li");
    li.appendChild(document.createTextNode(message))
    return li;
}

export default socket