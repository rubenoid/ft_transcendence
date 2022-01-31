import React from "react";
import EndpointButton from "../Utils/Buttons/EndpointButton/EndpointButton";
import { Text } from "../Utils/Text/Text";
import { roleLevel } from "./ChatSettings";
import { User } from "../../Types/Types";
import { UserWrapper, UserRowContainer } from "./ChatSettingsElements";
import { ChatData, MutedUser, ToSend } from "../../Types/Types";

interface InputParams {
	chatData: ChatData;
	myRole: roleLevel;
	setEndpoints: React.Dispatch<React.SetStateAction<ToSend[]>>;
	mutedUsers: MutedUser[];
	bannedUsers: User[];
	chatId: string;
}

const PunishedList = (props: InputParams): JSX.Element => {
	const listMutedUsers = (): JSX.Element[] => {
		return props.mutedUsers.map((user: MutedUser, key: number) => {
			const realUser = props.chatData.users.find(
				(x) => x.id == user.userTargetId,
			);
			const time = new Date(user.endDate * 1000);
			if (realUser == undefined) return;
			return (
				<UserRowContainer key={key}>
					<Text>{realUser.userName}</Text>
					<Text>
						{time.getHours() +
							":" +
							time.getMinutes() +
							":" +
							time.getSeconds()}
					</Text>
					{props.myRole != roleLevel.user ? (
						<EndpointButton
							useSmall={true}
							endpointRef={props.setEndpoints}
							toSet={{
								endpoint: "/chat/unmute",
								data: { chatId: props.chatId, userId: realUser.id },
							}}
						>
							<Text>unmute</Text>
						</EndpointButton>
					) : (
						""
					)}
				</UserRowContainer>
			);
		});
	};

	const listBannedUsers = (): JSX.Element[] => {
		return props.bannedUsers.map((user: User, key: number) => {
			return (
				<UserRowContainer key={key}>
					<Text>{user.userName}</Text>
					{props.myRole != roleLevel.user ? (
						<EndpointButton
							useSmall={true}
							endpointRef={props.setEndpoints}
							toSet={{
								endpoint: "/chat/unbanUser",
								data: { chatId: props.chatId, userId: user.id },
							}}
						>
							<Text>unban</Text>
						</EndpointButton>
					) : (
						""
					)}
				</UserRowContainer>
			);
		});
	};

	return (
		<>
			<UserWrapper>
				<Text>Muted Users</Text>
				{listMutedUsers()}
			</UserWrapper>
			<br />
			<UserWrapper>
				<Text>Banned Users</Text>
				{listBannedUsers()}
			</UserWrapper>
			<br />
		</>
	);
};

export default PunishedList;
