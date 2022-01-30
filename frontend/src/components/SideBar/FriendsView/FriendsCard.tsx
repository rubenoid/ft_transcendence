import React from "react";
import {
	FriendsCardContainer,
	FriendsTitleContainer,
	FriendsImageContainer,
	FriendsNameContainer,
	FriendsButtonContainer,
	FriendsCardButton,
} from "./FriendsViewElements";
import { Img } from "../MiniProfile/MiniProfileElements";
import { Channel, User } from "../../../Types/Types";
import { fetchData, postData } from "../../../API/API";
import { SharedChatState } from "../SideBar";
import { Item } from "../../Utils/List/List";
import { useNavigate } from "react-router-dom";
import { Text } from "../../Utils/Text/Text";
import { IconContainer } from "../../Utils/IconContainer";
import { TiMessages as ChatIcon } from "react-icons/ti";
import { CgProfile as ProfileIcon } from "react-icons/cg";

interface InputParams {
	friends: User[];
}
const FriendsCard = (props: InputParams): JSX.Element => {
	const navigate = useNavigate();
	const { channel, setChannel } = SharedChatState();

	function goToProfile(id: number): void {
		navigate(`/profile/${id}`, { replace: true });
	}

	async function createNewChat(id: number): Promise<void> {
		console.log("createNewChattt");
		const chatId: number = await postData("chat/createNewChat", { ids: [id] });
		console.log(chatId);

		const chatData: Channel = await fetchData(`chat/get/${chatId}`);
		console.log("cheatData: ", chatData);
		setChannel(chatData);
	}

	const listFriends = props.friends.map((user: User, key: number) => {
		return (
			<Item key={user.id}>
				<FriendsCardContainer>
					<FriendsTitleContainer>
						<FriendsImageContainer>
							<Img src={"http://localhost:5000/" + user.avatar} />
						</FriendsImageContainer>
						<FriendsNameContainer>
							<Text>{user.userName}</Text>
							<Text>{"Online"}</Text>
						</FriendsNameContainer>
					</FriendsTitleContainer>
					<FriendsButtonContainer>
						<div>
							<FriendsCardButton
								onClick={() => {
									goToProfile(user.id);
								}}
							>
								<IconContainer>
									<ProfileIcon size={25} />
								</IconContainer>
							</FriendsCardButton>
						</div>
						<div>
							<FriendsCardButton
								onClick={() => {
									createNewChat(user.id);
								}}
							>
								<IconContainer>
									<ChatIcon size={25} />
								</IconContainer>
							</FriendsCardButton>
						</div>
					</FriendsButtonContainer>
				</FriendsCardContainer>
			</Item>
		);
	});

	return (
		<>
			{props.friends.length ? (
				listFriends
			) : (
				<Item>No Friends Yet, Add one !</Item>
			)}
		</>
	);
};
export default FriendsCard;
