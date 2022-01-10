import React from 'react';
import {TopContainer, ChatBoxContainer, InputContainer, SendIconContainer} from './ChatBoxElements';
import { TextInput, Text, List, LongList, Item } from '../../Utils/Utils';
import { ChatContainer } from '../ChatElements';
import { AiOutlineSend as SendIcon} from 'react-icons/ai';
import SendButton from '../../Buttons/Send/SendButton';

const ChatBox = () => {
    return (
        <ChatBoxContainer>
            <TopContainer>
                <Text>friend</Text>
            </TopContainer>
            <ChatContainer>

            </ChatContainer>
            <InputContainer>
                <TextInput type="text" onChange={(e) => ({})}></TextInput>
                <SendButton/>
            </InputContainer>
        </ChatBoxContainer>
    );
}

export default ChatBox;