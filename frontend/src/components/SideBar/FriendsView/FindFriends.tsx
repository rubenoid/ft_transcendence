import React, { useEffect, useState } from "react";
import { fetchData } from "../../../API/API";
import { User } from "../../../Types/Types";
import { WidgetContainer } from "../../Utils/Containers/Containers";
import { Text } from "../../Utils/Text/Text";
import { TextInput } from "../../Utils/TextInput/TextInput";
import { FindResultWrapper } from "./FindFriendsElements";

interface InputParams {
	onEnter(user: User): void;
}

const FindFriends = (props: InputParams): JSX.Element => {
	const [userName, setUserName] = useState<string>("");
	const [similarUsers, setSimilarUsers] = useState<User[]>([]);

	useEffect(() => {
		async function getSimilarUsers(): Promise<void> {
			if (userName != "") {
				const res: User[] = await fetchData(`/user/find/${userName}`);
				console.log("similarUsers", res);
				const sortedsimilar = res.sort(
					(first, second) => 0 - (first.userName > second.userName ? -1 : 1),
				);
				console.log("sortedsimilar", sortedsimilar);
				setSimilarUsers(sortedsimilar);
			} else setSimilarUsers([]);
		}
		getSimilarUsers();
	}, [userName]);

	function handleEnter(key: string): void {
		if (key == "Enter") {
			setSimilarUsers([]);
			setUserName("");
			props.onEnter(similarUsers[0]);
		}
	}

	const similarUserList = similarUsers.map(
		(user: User, key: number): JSX.Element => {
			return (
				<div key={key}>
					<Text color="black">{user.userName}</Text>
				</div>
			);
		},
	);

	return (
		<WidgetContainer>
			<Text>Search for User</Text>
			<TextInput
				type={"text"}
				placeholder={"search for users"}
				value={userName}
				onKeyDown={(e) => handleEnter(e.key)}
				onChange={(e) => setUserName(e.target.value)}
			></TextInput>
			<FindResultWrapper>{similarUserList}</FindResultWrapper>
		</WidgetContainer>
	);
};

export default FindFriends;
