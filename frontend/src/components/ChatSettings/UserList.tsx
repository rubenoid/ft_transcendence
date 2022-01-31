import React from "react";
import { UserWrapper, UserRow, UserRowContainer, StyledName } from "./ChatSettingsElements";
import { Link } from "react-router-dom";
import { User, ChatData, ToSend } from "../../Types/Types";
import { Text } from "../Utils/Text/Text";
import { roleLevel } from "./ChatSettings";
import { SharedUserState } from "../../App/UserStatus";
import EndpointButton from "../Utils/Buttons/EndpointButton/EndpointButton";

interface InputParams {
	chatData: ChatData;
	myRole: roleLevel;
	setEndpoints: React.Dispatch<React.SetStateAction<ToSend[]>>;
	chatId: string;
}

const UserList = (props: InputParams): JSX.Element => {
	const { user, setUser } = SharedUserState();

	const listUsers = (): JSX.Element[] => {
		return props.chatData.users.map((mapUser: User, key: number) => {
			return (
				<UserRowContainer key={key}>
					<StyledName>
						<Link to={`/profile/${mapUser.id}`}>
							<Text>{mapUser.userName}</Text>
						</Link>
					</StyledName>
					{props.chatData.owner == mapUser.id ? (
						<StyledName>
							<Text>Owner</Text>
						</StyledName>
					) : props.chatData.admins.find((x) => x.id == mapUser.id) ? (
						<StyledName>
							<Text>Admin</Text>
						</StyledName>
					) : (
						""
					)}
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
			<Text>Users</Text>
			{listUsers()}
		</UserWrapper>
	);
};

export default UserList;
