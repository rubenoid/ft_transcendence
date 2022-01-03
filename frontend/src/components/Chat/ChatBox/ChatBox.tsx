import React from 'react';
import {TopContainer, ChatBoxContainer, InputContainer, SendIconContainer} from './ChatBoxElements';
import { TextInput, Text, List, LongList, Item } from '../../Utils/Utils';
import { ChatContainer } from '../ChatElements';
import { handlesSubmitNewMessages } from '../../socket'
import { AiOutlineSend as SendIcon} from 'react-icons/ai';

// const { Server } = require("socket.io");
// const io = new Server(Server);

// holding the messages 

export const ChatBox = () => {
    return (
        <ChatBoxContainer>
            <div> <ul id= "messages"></ul></div>
            <TopContainer>
                <Text>friend</Text>
            </TopContainer>
            <ChatContainer>

            </ChatContainer>
                
            
            <InputContainer>
                <div>
                    <TextInput id="message" type="text" onChange={(e) => ({})}></TextInput>
                    {/* <button onClick={() => handlesSubmitNewMessages(id)}>Submit</button> */}
                    
                </div>
                <SendIconContainer>
                    <SendIcon/>
                </SendIconContainer>
            </InputContainer>
        </ChatBoxContainer>
    );
}

export default ChatBox;
