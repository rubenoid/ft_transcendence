import React, { useEffect, useState } from "react";
import {
	UserWrapper,
	UserRow,
	RowButton,
	UserRowContainer,
} from "./ChatSettingsElements";
import { Link } from "react-router-dom";
import { User } from "../../Types/Types";
import EndpointButton from "../EndpointButton/EndpointButton";
import { Text } from "../Utils/Text/Text";
import { ChatData, toSend, roleLevel } from "./ChatSettings";
import { SharedUserState } from "../../App/UserStatus";

interface InputParams {
	chatData: ChatData;
	myRole: roleLevel;
	setEndpoints: React.Dispatch<React.SetStateAction<toSend[]>>;
	chatId: string;
}

const UserList = (props: InputParams): JSX.Element => {
	const { user, setUser } = SharedUserState();

	const listUsers = (): JSX.Element[] => {
		return props.chatData.users.map((mapUser: User, key: number) => {
			return (
				<UserRowContainer key={key}>
					<Link to={`/profile/${mapUser.id}`}>
						<Text>{mapUser.userName}</Text>
					</Link>
					{props.chatData.owner == mapUser.id
						? "OWNER"
						: props.chatData.admins.find((x) => x.id == mapUser.id)
						? "ADMIN"
						: ""}
					{props.myRole != roleLevel.user && mapUser.id != user.id ? (
						<UserRow>
							{props.chatData.admins.find((x) => x.id != mapUser.id) ? (
								<EndpointButton
									useSmall={true}
									toSet={{
										endpoint: "/chat/addAdmin",
										data: { newAdminId: mapUser.id, chatId: props.chatId },
									}}
									endpointRef={props.setEndpoints}
								>
									<Text>Promote</Text>
								</EndpointButton>
							) : (
								""
							)}
							<EndpointButton
								useSmall={true}
								toSet={{
									endpoint: "/chat/banUser",
									data: { chatId: props.chatId, userId: mapUser.id },
								}}
								endpointRef={props.setEndpoints}
							>
								<Text>Ban</Text>
							</EndpointButton>

							<EndpointButton
								useSmall={true}
								toSet={{
									endpoint: "/chat/muteUser",
									data: { chatId: props.chatId, userId: mapUser.id },
								}}
								endpointRef={props.setEndpoints}
							>
								<Text>Mute</Text>
							</EndpointButton>
						</UserRow>
					) : (
						""
					)}
				</UserRowContainer>
			);
		});
	};
	return (
		<UserWrapper>
			<Text color="black">Users</Text>
			{listUsers()}
		</UserWrapper>
	);
};

export default UserList;
