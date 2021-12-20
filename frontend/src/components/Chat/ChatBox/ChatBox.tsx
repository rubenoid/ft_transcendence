import React from 'react';
import {TopContainer, ChatBoxContainer, InputContainer} from './ChatBoxElements';
import { TextInput, Text, List, LongList, Item } from '../../Utils/Utils';
import { ChatContainer } from '../ChatElements';

const ChatBox = () => {
    return (
        <ChatBoxContainer>
            <TopContainer>
                <Text>friend</Text>
            </TopContainer>
            <ChatContainer>

            </ChatContainer>
                <TextInput type="text" onChange={(e) => ({})}></TextInput>
        </ChatBoxContainer>
    );
}

export default ChatBox;
