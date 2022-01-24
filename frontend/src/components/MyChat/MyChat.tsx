import React from 'react'
import { InputContainer, TopContainer } from '../Chat/ChatBox/ChatBoxElements'
import { ChatBoxContainer, SendIconContainer } from './MyChatElements'
import { AiOutlineSend as SendIcon } from "react-icons/ai";
import {Text} from "../Utils/Text/Text";
import {TextInput} from "../Utils/TextInput/TextInput";
import { useSelector } from 'react-redux';
import { RootState } from "../..";
import ChatHistory from './ChatHistory/ChatHistory';

const MyChat = () => {

    const usr = useSelector((state: RootState) => state.value);

    return (
		<ChatBoxContainer>
			<TopContainer>
				<Text>{usr ? usr.userName : 'friend'}</Text>
			</TopContainer>

            <ChatHistory/>

			<InputContainer>
				<TextInput></TextInput>
				<SendIconContainer>
					<SendIcon />
				</SendIconContainer>
			</InputContainer>
		</ChatBoxContainer>
    );
}

export default MyChat;
