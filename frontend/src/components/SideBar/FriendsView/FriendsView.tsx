import React, { useEffect } from "react";
import { Text } from "../../Utils/Text/Text";
import { fetchData } from "../../../API/API";
import { Item } from "../../Utils/List/List";
import { User } from "../../../Types/Types";
import { FriendsViewContainer } from "./FriendsViewElements";
import FindFriends from "./FindFriends";
import FriendsCard from "./FriendsCard";
import { SharedUserFriends } from "../../../App/UserFriends";

const FriendsView = (): JSX.Element => {
	// const [friends, setFriends] = useState<User[]>([]);
	const { friends, setFriends } = SharedUserFriends();

	async function getFriends(): Promise<User[]> {
		const friends: User[] = await fetchData("/friends/me");
		setFriends(friends);
		// status to be added
		return friends;
	}

	useEffect(() => {
		getFriends();
	}, []);

	async function addFriend(user: User): Promise<void> {
		await fetchData(`/friends/add/${user.id}`);
		getFriends();
	}

	return (
		<FriendsViewContainer>
			<Item>
				<Text>Friends:</Text>
				<FindFriends onEnter={(e) => addFriend(e)}></FindFriends>
			</Item>
			<FriendsCard friends={friends}></FriendsCard>
		</FriendsViewContainer>
	);
};

export default FriendsView;
