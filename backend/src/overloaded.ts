import { UserEntity } from "./user/user.entity";
import { Request } from "@nestjs/common";
import { Socket } from "socket.io";

export interface GuardedRequest extends Request {
	user: { id: number };
}

export interface GuardedSocket extends Socket {
	user: { id: number };
}
