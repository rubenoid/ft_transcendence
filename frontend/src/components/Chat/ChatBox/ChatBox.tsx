import React, { useState, useEffect} from 'react';
import {TopContainer, ChatBoxContainer, InputContainer, SendIconContainer} from './ChatBoxElements';
import { TextInput, Text, List, LongList, Item, Button } from '../../Utils/Utils';
import { ChatContainer } from '../ChatElements';
import { AiOutlineSend as SendIcon} from 'react-icons/ai';
import { fetchData, User } from '../../../API/API';
import { ImgContainer, Img } from '../../Profile/ProfileElements';
import { socket } from '../../socket';
import exportId from '../ChatBox/ChatBox';
import { useBetween } from 'use-between';
import { chatState } from '../ChatState';

interface Message {
    from: number,
    room: number,
    data: string,
}

// let msgObj = {from: number, room: number, data: string}


const ChatBox = () => {
    const {otherUser, setUser} = useBetween(chatState);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageCount, setMessageCount] = useState(0);

    /* for now a hacky way to get the other person on the server */
    useEffect(() => {
        async function openChat() {
            socket.emit("chat:login");
        }
        socket.on("newMessage", (message: string) => {
            // put it in an array of messages
            const currentMsg : Message = {"from": 0, "room": 1, "data": message};
            let MsgArr: Message[] = messages;
            MsgArr.push(currentMsg);
            setMessages(MsgArr);
            setMessageCount(messageCount+1);
            createMessages();
            console.log('socket.on');
            console.log(MsgArr);
            console.log('<<<<');
            
        });
        openChat();
    }, []);
    
    
    const createMessages = () => {
        for (let i = 0; i < messages.length; i++) {
            return (
                <Text color='black' fontSize='10' >{messages[i]["data"]}</Text>
            )
        }
        // return ( <Text color='black' fontSize='10' >{steststring}</Text>);
    }
   

    /* end hackieness */

    const handlesSubmitNewMessages = (message: any): void => {
        // extract the data property/ looks at inputfield message and then extracts the value.
        console.log("SOCKET.ID:" + socket.id);
        
        socket.emit("chat:message", message, (returnedValue: any) => {console.log('returnedValue', returnedValue)});
        console.log("handlesubmitmessage");
    };

    function handleSubmit(e: any, msg: string) {
        e.preventDefault();
        const currentMsg : Message = {"from": 1, "room": 1, "data": msg};
        let MsgArr: Message[] = messages;
        MsgArr.push(currentMsg);
        setMessages(MsgArr);

        console.log("handleSubmit");
        console.log(MsgArr);
        console.log('<<<<');
        
        let data = {from: -1, room: otherUser.id, data: msg};
        handlesSubmitNewMessages(JSON.stringify(data));
    }

    


    let [msg, setMsg] = useState<string>('');
    
    return (
        <ChatBoxContainer>
            <TopContainer>
                <Text>{otherUser ? otherUser.firstName : 'loading'}</Text>
            </TopContainer>
            <ChatContainer>

            </ChatContainer>
            <InputContainer>
                <TextInput type="text" onChange={(e) => setMsg(e.target.value)}></TextInput>             
                <SendIconContainer>
                    <SendIcon onClick={(e) => handleSubmit(e, msg)}/>
                </SendIconContainer>
            </InputContainer>
        </ChatBoxContainer>
    );
}

export default ChatBox;