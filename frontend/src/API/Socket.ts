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

export default socket;
