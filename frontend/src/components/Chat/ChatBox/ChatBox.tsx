import React, { useState, useEffect} from 'react';
import {TopContainer, ChatBoxContainer, InputContainer, SendIconContainer} from './ChatBoxElements';
import { TextInput, Text, List, LongList, Item, Button } from '../../Utils/Utils';
import { ChatContainer } from '../ChatElements';
import { AiOutlineSend as SendIcon} from 'react-icons/ai';
import { fetchData, User } from '../../../API/API';
import { ImgContainer, Img } from '../../Profile/ProfileElements';
import { handlesSubmitNewMessages } from '../../socket';

const ChatBox = () => {
    const [otherUser, setUser] = useState<User>(undefined);

    /* for now a hacky way to get the other person on the server */
    useEffect(() => {
        async function getOtherUser() {
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

    const userInfo = () => {
        return (
            <> 
                <Text>{otherUser.firstName}</Text>
            </>
        )
    }
    /* end hackieness */

    function handleSubmit(e: any, msg: string) {
        e.preventDefault();
        console.log(e);
        console.log(msg);
        handlesSubmitNewMessages(msg);
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