export type User = {
	id: number;
	userName: string;
	firstName: string;
	lastName: string;
	avatar: string;
	wins: number;
	losses: number;
	rating: number;
	friends: User[];
};

export interface detailedUser extends User {
	status: string;
}

export interface userStatus {
	id: number;
	status: string;
}

export type Match = {
	id: number;
	players: User[];
	scorePlayer1: number;
	scorePlayer2: number;
};

export interface Message {
	data: string;
	senderId: number;
	channelId: number;
}

export interface Channel {
	id: number;
	name: string;
	users: User[];
	isPublic: boolean;
	isProtected: boolean;
	messages: Message[];
	owner: number;
	admins: User[];
}
