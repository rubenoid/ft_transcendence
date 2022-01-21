import Cookies from "js-cookie";
import { io, Socket } from "socket.io-client";

const socketOptions = {
	extraHeaders: {
		Authorization: Cookies.get("AuthToken"),
	},
};

const socket: Socket = io("http://localhost:5000", socketOptions);

socket.on("connect", () => {
	socket.emit("userConnect");
});

socket.on("reconnect", () => {
	socket.emit("userConnect");
});

// socket.on("userUpdate", (data: string) => {
// 	console.log(data);
// })

export const handlesSubmitNewMessages = (message: string): void => {
	// extract the data property/ looks at inputfield message and then extracts the value.
	socket.emit("message", message);
	console.log("handlesubmitmessage");
};

export default socket;
