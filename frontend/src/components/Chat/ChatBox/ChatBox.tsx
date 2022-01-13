import React, { useEffect, useState } from 'react';
import {TopContainer, ChatBoxContainer, InputContainer, SendIconContainer} from './ChatBoxElements';
import { TextInput, Text, List, LongList, Item } from '../../Utils/Utils';
import { ChatContainer } from '../ChatElements';
import { AiOutlineSend as SendIcon} from 'react-icons/ai';
import { User } from '../../../API/API'

type ChatBoxProps = {
    chatWith: User;
}

const sendMsg = (userToSendTo: User, msg: string) => {
    console.log('Sending message |', msg, '| to ->', userToSendTo.userName);
}

const ChatBox = (props: ChatBoxProps) => {

    const [msgToSend, setMsgToSend] = useState<string>('');
    const [msgHistory, setMsgHistory] = useState<string[]>([]);

    const history = msgHistory.map((msg: string, key: number) => {
        return <Item key={key}><Text color='black'>{msg}</Text></Item>;
    });

    const addToHistory = () => {
        msgHistory.push(msgToSend);
        sendMsg(props.chatWith, msgToSend);
        setMsgToSend('');
    }

    return (
        <ChatBoxContainer>
            <TopContainer>
                <Text>{props.chatWith.userName}</Text>
            </TopContainer>
            <ChatContainer>
                    {history.length ? history : <Text color='black'>Send your first message !</Text>}
            </ChatContainer>
            <InputContainer>
                <TextInput type="text" value={msgToSend} onChange={(e) => {setMsgToSend(e.target.value)}}></TextInput>
                <SendIconContainer onClick={()=>{addToHistory()}}>
                    <SendIcon/>
                </SendIconContainer>
            </InputContainer>
        </ChatBoxContainer>
    );
}

export default ChatBox;