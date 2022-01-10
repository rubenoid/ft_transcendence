import Cookies from "js-cookie";
import { io, Socket } from "socket.io-client";

const socketOptions = {
	extraHeaders: {
		Authorization: Cookies.get("AuthToken"),
	},
};

const socket: Socket = io("http://localhost:5000", socketOptions);

socket.on("connect", () => {
	console.log(socket.id);
	console.log("do something with data");
});

socket.on("error", (e: string) => {
	console.error("hoi ik heb een error:" + e);
});

socket.on("banaan:nieuw", (message: string) => {
	console.log("bericht terug van server: " + message);
});

socket.on("banaan:delete", (message: string) => {
	console.log("delete die banaan: " + message);
});

// // listen to incoming messages, and add it to our list of documents.
// socket.on('message', (message:string) => {
//     handleNewMessage(message);
// })
const messages = <HTMLInputElement>document.getElementById("messages");

export const handlesSubmitNewMessages = (message: string): void => {
	// extract the data property/ looks at inputfield message and then extracts the value.
	console.log("SOCKET.ID:" + socket.id);
	
	socket.emit("chat:message", message, (returnedValue: any) => {console.log('returnedValue', returnedValue)});
	console.log("handlesubmitmessage");
};

// for chat history
const handleNewMessage = (message: string): void => {
	// new node appendchild
	console.log(buildNewMessage);
	//messages.appendChild(buildNewMessage)
};

const buildNewMessage = (message: string) => {
	const li = document.createElement("li");
	li.appendChild(document.createTextNode(message));
	return li;
};

export default socket;
