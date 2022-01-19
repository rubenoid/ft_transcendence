import React, { useEffect, useState } from 'react';
import {TopContainer, ChatBoxContainer, InputContainer, SendIconContainer} from './ChatBoxElements';
import { ChatContainer } from '../ChatElements';
import { AiOutlineSend as SendIcon} from 'react-icons/ai';
import { User, fetchData, postData } from '../../../API/API';
import { Channel, Message } from "../Chat";
import { TextInput } from '../../Utils/TextInput/TextInput';
import { Text } from '../../Utils/Text/Text';

type ChatBoxProps = {
    chatWith: Channel;
}

const ChatBox = (props: ChatBoxProps) => {

    const [msgToSend, setMsgToSend] = useState<string>('');
    const [msgHistory, setMsgHistory] = useState<Message[]>([]);

    useEffect(() => {
        async function getMessages() {
            const messages: Message[] = await fetchData(`chat/messages/${props.chatWith.id}`);

            console.log("messges:", messages);
            setMsgHistory(messages);
        } 
        getMessages();
    }, [props.chatWith]);

    const history = msgHistory.map((msg: Message, key: number) => {
        return <Text key={key}color='black'>{msg.data}</Text>;
    });

    const addToHistory = async () => {
        msgHistory.push({data: msgToSend, senderId: -1});

        await postData("chat/addChatMessage", {data: msgToSend, chatId: props.chatWith.id });
        setMsgToSend('');
    }

    return (
        <ChatBoxContainer>
            <TopContainer>
                <Text>{props.chatWith.name}</Text>
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