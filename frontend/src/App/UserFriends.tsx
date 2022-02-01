import React, { useEffect, useState } from "react";
import { useBetween } from "use-between";
import { fetchData } from "../API/API";
import { User } from "../Types/Types";

const UserFriends = (): {
	friends: User[];
	setFriends: React.Dispatch<React.SetStateAction<User[]>>;
} => {
	const [friends, setFriends] = useState<User[]>([]);

	useEffect(() => {
		async function getFriends(): Promise<void> {
			const res: User[] = await fetchData("/friends/me");
			setFriends(res);
		}
		getFriends();
	}, []);

	return { friends, setFriends };
};

export const SharedUserFriends = (): {
	friends: User[];
	setFriends: React.Dispatch<React.SetStateAction<User[]>>;
} => useBetween(UserFriends);
