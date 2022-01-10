import React, { useState, useEffect} from 'react';
import {TopContainer, ChatBoxContainer, InputContainer, SendIconContainer} from './ChatBoxElements';
import { TextInput, Text, List, LongList, Item, Button } from '../../Utils/Utils';
import { ChatContainer } from '../ChatElements';
import { AiOutlineSend as SendIcon} from 'react-icons/ai';
import { fetchData, User } from '../../../API/API';
import { ImgContainer, Img } from '../../Profile/ProfileElements';
import { socket } from '../../socket';

interface Message {
    from: number,
    room: number,
    data: string,
}

const ChatBox = () => {
    const [otherUser, setUser] = useState<User>(undefined);

    /* for now a hacky way to get the other person on the server */
    useEffect(() => {
        async function getOtherUser() {
            socket.emit("chat:login");

            socket.on("newMessage", (message: Message) => {
                // put it in an array of messages
                console.log("message", message);
            });

            const users: User[] = await fetchData('/user/all');
            if (users.length < 2) {
                throw new Error('not enough users in database for ChatBox');
            }
            const me: User = await fetchData('/user/me');
            if (me.id === users[0].id) {
                setUser(users[1]);
            } else {
                setUser(users[0]);
            }
          }
        getOtherUser();
    }, []);

    useEffect(() => {
        // This gets called after every render, by default
        // (the first one, and every one after that)
        console.log('render!');
    
        // If you want to implement componentWillUnmount,
        // return a function from here, and React will call
        // it prior to unmounting.
        return () => console.log('unmounting...');
      })


    const userInfo = () => {
        return (
            <> 
                <Text>{otherUser.firstName}</Text>
            </>
        )
    }
    /* end hackieness */

    const handlesSubmitNewMessages = (message: any): void => {
        // extract the data property/ looks at inputfield message and then extracts the value.
        console.log("SOCKET.ID:" + socket.id);
        
        socket.emit("chat:message", message, (returnedValue: any) => {console.log('returnedValue', returnedValue)});
        console.log("handlesubmitmessage");
    };
    
    // for chat history
    const handleNewMessage = (message: string): void => {
        // new node appendchild
        console.log(buildNewMessage);
        //messages.appendChild(buildNewMessage)
    };
    
    const buildNewMessage = (message: string) => {
        const li = document.createElement("li");
        li.appendChild(document.createTextNode(message));
        return li;
    };
    

    function handleSubmit(e: any, msg: string) {
        e.preventDefault();
        console.log(e);
        console.log(msg);
        let data = {from: -1, room: otherUser.id, data: msg};
        handlesSubmitNewMessages(JSON.stringify(data));
    }

    


    let [msg, setMsg] = useState<string>('');
    
    return (
        <ChatBoxContainer>
            <TopContainer>
                <Text>{otherUser ? userInfo() : 'loading'}</Text>
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