import React, { useState, useEffect } from "react";
import { WidgetContainer } from "../Utils/Containers/Containers";
import { Button } from "../Utils/Buttons/Button/Button";
import { fetchData } from "../../API/API";
import { SearchResultContainer } from "./AddFriendElements";
import { TextInput } from "../Utils/TextInput/TextInput";
import { Text } from "../Utils/Text/Text";
import { User } from "../../Types/Types";

const AddFriend = (): JSX.Element => {
	const [user, setUser] = useState<User>();
	const [userName, setUserName] = useState<string>("");

	useEffect(() => {
		async function getUsers(): Promise<User> {
			if (userName) {
				const user: User = await fetchData(`/user/getByUserName/${userName}`);
				if (user) setUser(user);
				return user;
			}
		}
		getUsers();
	}, [userName]);
	console.log(user);
	console.log("UserName->" + userName);

	const addFriend = async (id: number): Promise<void> => {
		const endpoint = `/friends/add/${id}`;
		await fetchData(endpoint);
	};

	const SearchResult = (): JSX.Element => {
		return (
			<SearchResultContainer>
				<Text>{user.userName}</Text>
				<Button
					onClick={(e) => {
						addFriend(user.id);
					}}
				>
					Add
				</Button>
			</SearchResultContainer>
		);
	};

	return (
		<WidgetContainer>
			<Text>Search for User</Text>
			<TextInput
				type="text"
				placeholder="Type to search..."
				onChange={(e) => setUserName(e.target.value)}
			></TextInput>
			{user && user.userName == userName ? SearchResult() : ""}
		</WidgetContainer>
	);
};

export default AddFriend;
