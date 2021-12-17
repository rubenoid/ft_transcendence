import React from 'react';
import { ChatGrid, ChatBoxContainer, ChatContainer, ChatSideBar } from './ChatElements';
import { Text, TextInput, WidgetContainer } from '../Utils/Utils';
import { List, LongList, Item } from '../Utils/Utils';

const Chat = () => {
    return (
                <ChatGrid>
                    <ChatSideBar>
                    <List>
                            <Item><Text>friend</Text></Item>
                            <Item><Text>friend</Text></Item>
                            <Item><Text>friend</Text></Item>
                            <Item><Text>friend</Text></Item>
                            <Item><Text>friend</Text></Item>
                    </List>
                    </ChatSideBar>
                    <ChatBoxContainer>
                    <Item>
                        <TextInput type="text" onChange={(e) => ({})}></TextInput>
                    </Item>
                    </ChatBoxContainer>
                </ChatGrid>
    );
}

export default Chat;