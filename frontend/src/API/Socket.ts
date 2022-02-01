import Cookies from "js-cookie";
import { io, Socket } from "socket.io-client";

const socketOptions = {
	extraHeaders: {
		Authorization: Cookies.get("AuthToken"),
	},
};

const socket: Socket = io("http://localhost:5000", socketOptions);

export const updateSocketHeaders = (force?: boolean): Promise<void> => {
	// eslint-disable-next-line
	const tmp: any = socket;
	if (
		!force &&
		(socketOptions.extraHeaders.Authorization == Cookies.get("AuthToken") &&
			socket.connected)
	)
		return;
	tmp.disconnect();
	socketOptions.extraHeaders.Authorization = Cookies.get("AuthToken");
	tmp.io.extraHeaders = socketOptions.extraHeaders;
	tmp.connect();
	return null;
};

socket.on("exception", () => {
	console.log("socket error");
	socket.disconnect();
});

socket.on("connect", () => {
	console.log("connected!");
	socket.emit("userConnect");
});

socket.on("reconnect", () => {
	socket.emit("userConnect");
});

export default socket;
