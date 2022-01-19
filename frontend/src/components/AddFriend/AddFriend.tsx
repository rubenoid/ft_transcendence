import React, { useState, useEffect } from "react";
import {
	Item,
	TextInput,
	Text,
	Button,
	WidgetContainer,
	TextContainer,
	RoundButton,
} from "../Utils/Utils";
import { fetchData, User } from "../../API/API";
import { SearchResultContainer } from "./AddFriendElements";
import { MdPersonAdd as AddIcon } from "react-icons/md";

const AddFriend = (): JSX.Element => {
	const [user, setUser] = useState<User>();
	const [userName, setUserName] = useState<string>("");

	useEffect(() => {
		async function getUsers(): Promise<User> {
			const endpoint = `/user/getByUserName/${userName}`;
			const user: User = await fetchData(endpoint);
			if (user) setUser(user);
			return user;
		}
		getUsers();
	}, [userName]);
	console.log(user);
	console.log("UserName->" + userName);

	const addFriend = async (id: number): void => {
		const endpoint = `/friends/add/${id}`;
		await fetchData(endpoint);
	};

	const SearchResult = () => {
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
			<TextContainer>
				<Text>Search for User</Text>
			</TextContainer>
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
