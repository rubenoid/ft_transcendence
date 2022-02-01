export type User = {
	avatar: string;
	firstName: string;
	id: number;
	lastName: string;
	logedin: boolean;
	losses: number;
	rating: number;
	registered: boolean;
	twoFactorSecret: string;
	twoFactorvalid: boolean;
	userName: string;
	wins: number;
	friends: User[];
	blockedUsers: User[];
	blockedBy: User[];
	initial2FAEnabled: boolean;
	matches: Match[];
	status: string;
	achievements: Achievement[];
};

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

export interface ChatData {
	id: number;
	hasPassword: boolean;
	isPublic: boolean;
	name: string;
	users: User[];
	admins: User[];
	bannedUsers: User[];
	muted: MutedUser[];
	owner: number;
}

export interface MutedUser {
	userTargetId: number;
	endDate: number;
}

export interface ToSend {
	endpoint: string;
	data: object;
}


export interface UserStatus {
	id: number;
	status: string;
}

export interface Achievement {
	id: number;
	date: number;
	title: string;
	description: string;
}
