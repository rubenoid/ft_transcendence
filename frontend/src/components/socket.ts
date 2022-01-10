import Cookies from "js-cookie";
import { io, Socket } from "socket.io-client";

const socketOptions = {
	extraHeaders: {
		Authorization: Cookies.get("AuthToken"),
	},
};

export const socket: Socket = io("http://localhost:5000", socketOptions);

socket.on("connect", () => {
	console.log(socket.id);
});

socket.on("error", (e: string) => {
	console.error("hoi ik heb een error:" + e);
});

export default socket;
