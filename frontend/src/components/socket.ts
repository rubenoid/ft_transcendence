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
const messages = <HTMLInputElement>document.getElementById("messages");

export const handlesSubmitNewMessages = (message: string): void => {
	// extract the data property/ looks at inputfield message and then extracts the value.
	socket.emit("message", message);
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
