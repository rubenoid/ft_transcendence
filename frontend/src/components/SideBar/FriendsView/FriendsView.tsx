import React, { useEffect, useState } from "react";
import { Text } from "../../Utils/Text/Text";
import { fetchData } from "../../../API/API";
import { List, Item } from "../../Utils/List/List";
import { Button } from "../../Utils/Buttons/Button/Button";
import { User } from "../../../Types/Types";

const FriendsView = (): JSX.Element => {
	const [friends, setFriends] = useState<User[]>([]);

	useEffect(() => {
		async function getFriends(): Promise<User[]> {
			const friends: User[] = await fetchData("/friends/me");
			console.log("USERS->", friends);
			setFriends(friends);
			return friends;
		}
		getFriends();
	}, [fetchData]);

	const listFriends = friends.map((user: User, key: number) => {
		return (
			<Item key={user.id}>
				<Button>{user.userName}</Button>
			</Item>
		);
	});

	return (
		<div>
			<List>
				<Item>
					<Text>Friends:</Text>
				</Item>
				{friends.length ? listFriends : <Item>No Friends Yet, Add one !</Item>}
			</List>
		</div>
	);
};

export default FriendsView;
