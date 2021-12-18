import React from 'react';
import {ChatBoxContainer} from './ChatBoxElements';
import { TextInput, List, LongList, Item } from '../../Utils/Utils';

const ChatBox = () => {
    return (
        <ChatBoxContainer>
            <Item>
                <TextInput type="text" onChange={(e) => ({})}></TextInput>
            </Item>
        </ChatBoxContainer>
    );
}

export default ChatBox;
