import React, { useEffect, useState } from "react";
import { Text } from "../../Utils/Text/Text";
import { fetchData, postData } from "../../../API/API";
import { Channel } from "../../../Types/Types";
import { SharedChatState } from "../SideBar";
import {
	FriendsViewContainer,
	FriendsCardContainer,
	FriendsTitleContainer,
	FriendsCardButton,
	FriendsButtonContainer,
	FriendsImageContainer,
	FriendsNameContainer,
} from "./FriendsViewElements";
import { Img } from "../../Profile/ProfileElements";
import { useNavigate } from "react-router-dom";
import {IconContainer} from '../../Utils/IconContainer'
import {TiMessages as ChatIcon} from 'react-icons/ti';
import {CgProfile as ProfileIcon} from 'react-icons/cg';
import { detailedUser } from "../../../Types/Types";
import { getMyFriends } from './FriendsUtils';

const FriendsView = (): JSX.Element => {
	const navigate = useNavigate();
	const [friends, setFriends] = useState<detailedUser[]>([]);
	const { channel, setChannel } = SharedChatState();

	async function createNewChat(id: number): Promise<void> {
		console.log("createNewChattt");
		const chatId: number = await postData("chat/createNewChat", { ids: [id] });
		console.log(chatId);

		const chatData: Channel = await fetchData(`chat/get/${chatId}`);
		console.log("cheatData: ", chatData);
		setChannel(chatData);
	}

	useEffect(() => {
		async function getFriends(): Promise<detailedUser[]> {
			const friends: detailedUser[] = await getMyFriends();
			setFriends(friends);
			return friends;
		}
		getFriends();
	}, [friends]);


	function goToProfile(id: number): void {
		navigate(`/profile/${id}`, { replace: true });
	}

	const listFriends = friends.map((user: detailedUser, key: number) => {
		return (
				<FriendsCardContainer key={user.id}>
					<FriendsTitleContainer>
						<FriendsImageContainer>
							<Img src={"http://localhost:5000/" + user.avatar} />
						</FriendsImageContainer>
						<FriendsNameContainer>
							<Text color="black">{user.userName}</Text>
							<Text color="black">{user.status ? user.status : 'offline'}</Text>
						</FriendsNameContainer>
					</FriendsTitleContainer>
					<FriendsButtonContainer>
						<div>
							<FriendsCardButton
								onClick={() => {
									goToProfile(user.id);
								}}
							>
								<IconContainer><ProfileIcon size={25}/></IconContainer>
							</FriendsCardButton>
						</div>
						<div>
							<FriendsCardButton
								onClick={() => {
									createNewChat(user.id);
								}}
							>
								<IconContainer><ChatIcon size={25}/></IconContainer>
							</FriendsCardButton>
						</div>
					</FriendsButtonContainer>
				</FriendsCardContainer>
		);
	});

	return (
		<FriendsViewContainer>
				<Text>Friends:</Text>
			{friends.length ? listFriends : 'No Friends Yet, Add one !'}
		</FriendsViewContainer>
	);
};

export default FriendsView;
