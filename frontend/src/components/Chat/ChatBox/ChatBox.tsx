import React from 'react';
import {TopContainer, ChatBoxContainer, InputContainer} from './ChatBoxElements';
import { ChatContainer } from '../ChatElements';
import SendButton from '../../Utils/Buttons/Send/SendButton';
import { TextInput } from '../../Utils/TextInput/TextInput';
import { Text } from '../../Utils/Text/Text';

const ChatBox = () => {
    return (
        <ChatBoxContainer>
            <TopContainer>
                <Text>friend</Text>
            </TopContainer>
            <ChatContainer>

            </ChatContainer>
            <InputContainer>
                <TextInput type="text" onChange={() => ({})}></TextInput>
                <SendButton/>
            </InputContainer>
        </ChatBoxContainer>
    );
}

export default ChatBox;