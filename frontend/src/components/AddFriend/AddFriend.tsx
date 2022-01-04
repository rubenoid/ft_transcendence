import React, { useState, useEffect } from 'react';
import { Item, TextInput ,Text, Button, WidgetContainer, TextContainer } from '../Utils/Utils';
import { fetchUserByUserName, User } from '../../API/API';
import { AddIconContainer, SearchResultContainer } from './AddFriendElements';
import { MdPersonAdd as AddIcon } from 'react-icons/md';

const AddFriend = () => {
    
    const [user, setUser] = useState<User>();
    const [userName, setUserName] = useState<string>('');

    useEffect(() => {
        async function getUsers(): Promise<User> {
            const user: User = await fetchUserByUserName(userName);
            console.log('USER');
            console.log(user);
            if (user)
                setUser(user);
            return user;
        }
        getUsers();
    }, [userName]);
    console.log(user);
    console.log('UserName->' + userName);

    const SearchResult = () => {
        return (
            <SearchResultContainer>
                <Text>{user.userName}</Text>
            </SearchResultContainer>
        );
    }
    return (
        <WidgetContainer>
            <TextContainer>
                <Text>Search for User</Text>
            </TextContainer>
                <TextInput type="text" placeholder="Type to search..." onChange={(e) => setUserName(e.target.value)}></TextInput>
                <Text>{user && user.userName == userName ? SearchResult() : ''}</Text>
        </WidgetContainer>
    ); 
}

export default AddFriend;
