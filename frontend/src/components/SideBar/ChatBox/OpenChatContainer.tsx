import React, { useState } from "react";
import {
	TopContainer,
	ChatBoxContainer,
	InputContainer,
	SendIconContainer,
	MsgContainer,
	MsgContainerOther,
	MsgText,
	TopText,
	TopButtonsContainer,
	MsgOwnerText,
} from "./ChatBoxElements";
import { SharedChatState } from "../SideBar";
import { SharedUserState } from "../../../App/UserStatus";
import { Message } from "../../../Types/Types";
import socket from "../../../API/Socket";
import { outputChatName } from "../SideBar";
import { postData } from "../../../API/API";
import { Link } from "react-router-dom";
import { AiOutlineSend as SendIcon } from "react-icons/ai";
import { FaWindowMinimize } from "react-icons/fa";
import { Text } from "../../Utils/Text/Text";
import { TextInput } from "../../Utils/TextInput/TextInput";
import { Button } from "../../Utils/Buttons/Button/Button";
import { ChatContainer } from "./ChatBoxElements";
import { IconContainer } from "../../Utils/IconContainer";
import { FiSettings as SettingsIcon } from "react-icons/fi";
import { IoMdCloseCircle as CloseIcon } from "react-icons/io";
import colormap from "colormap";

interface InputParams {
	msgHistory: Message[];
	passwordNeeded: boolean;
	setPasswordNeeded: React.Dispatch<React.SetStateAction<boolean>>;
	setMinimized: React.Dispatch<React.SetStateAction<boolean>>;
}

const OpenChatContainer = (props: InputParams): JSX.Element => {
	const [msgToSend, setMsgToSend] = useState<string>("");
	const { channel, setChannel } = SharedChatState();
	const [password, setPassword] = useState<string>("");
	const { user, setUser } = SharedUserState();
	const [colors, setColors] = useState(
		colormap({
			colormap: "warm",
			nshades: channel.users.length < 9 ? 9 : channel.users.length,
			format: "hex",
			alpha: 1,
		}),
	);

	const history = props.msgHistory.map((msg: Message, key: number) => {
		const foundUserIndex = channel.users.findIndex((x) => x.id == msg.senderId);
		const foundUser = channel.users[foundUserIndex];
		return (
			<div key={key}>
				{msg.senderId != user.id ? (
					<MsgContainerOther style={{ background: colors[foundUserIndex] }}>
						<MsgText>{msg.data}</MsgText>
						<MsgOwnerText color="white">{foundUser.userName}</MsgOwnerText>
					</MsgContainerOther>
				) : (
					<MsgContainer>
						<MsgText>{msg.data}</MsgText>
					</MsgContainer>
				)}
			</div>
		);
	});

	const addToHistory = async (): Promise<void> => {
		if (msgToSend) {
			socket.emit("addChatMessage", { data: msgToSend, chatId: channel.id });
			setMsgToSend("");
		}
	};

	async function checkProtected(): Promise<void> {
		const res: boolean = await postData("/chat/enterProtected", {
			chatId: channel.id,
			password: password,
		});
		if (res === true) {
			props.setPasswordNeeded(false);
			setChannel(channel);
		}
		setPassword("");
	}

	function enterCheck(keyCode: string): void {
		if (keyCode == "Enter") addToHistory();
	}

	return (
		<>
			<ChatBoxContainer>
				<TopContainer>
					<TopText>{outputChatName(channel, user, channel.name)}</TopText>
					<TopButtonsContainer>
						<Link to={`/chat/${channel.id}`}>
							<SettingsIcon />
						</Link>
						<TopText onClick={() => props.setMinimized(true)}>
							<FaWindowMinimize />
						</TopText>
						<IconContainer
							color="#ff3a3a"
							hoverColor="#cc3a3a"
							onClick={() => setChannel(undefined)}
						>
							<CloseIcon size={30} />
						</IconContainer>
					</TopButtonsContainer>
				</TopContainer>
				{props.passwordNeeded ? (
					<>
						<Text>Enter Password</Text>
						<TextInput
							type="text"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
						></TextInput>
						<Button
							onClick={() => {
								checkProtected();
							}}
						>
							Send
						</Button>
					</>
				) : (
					<ChatContainer>{history.length ? history : ""}</ChatContainer>
				)}
				<InputContainer>
					<TextInput
						type="text"
						value={msgToSend}
						onKeyDown={(e) => enterCheck(e.key)}
						onChange={(e) => {
							setMsgToSend(e.target.value);
						}}
					></TextInput>
					<SendIconContainer
						onClick={() => {
							addToHistory();
						}}
					>
						<SendIcon />
					</SendIconContainer>
				</InputContainer>
			</ChatBoxContainer>
		</>
	);
};

export default OpenChatContainer;
