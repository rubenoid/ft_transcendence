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

	twoFactorSecret: string;
	blockedUsers: User[];
	blockedBy: User[];
	initial2FAEnabled: boolean;
	matches: Match[];
	status: string;
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
