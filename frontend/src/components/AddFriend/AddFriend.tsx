import React, { useState, useEffect } from 'react';
import { TextInput ,Text, Button, WidgetContainer, TextContainer } from '../Utils/Utils';
import { fetchData, User } from '../../API/API';
import { SearchResultContainer } from './AddFriendElements';

const AddFriend = () => {
    
    const [user, setUser] = useState<User>(undefined);
    const [userName, setUserName] = useState<string>('');

    useEffect(() => {
        async function getUsers(): Promise<User> {
	        const endpoint = `/user/getByUserName/${userName}`;
            const user: User = await fetchData(endpoint);
            if (user)
                setUser(user);
            return user;
        }
        getUsers();
    }, [userName]);

    const SearchResult = () => {
        return (
            <SearchResultContainer>
                <Text>{user.userName}</Text>
                <Button>Add</Button>
            </SearchResultContainer>
        );
    };

    return (
        <WidgetContainer>
            <TextContainer>
                <Text>Search for User</Text>
            </TextContainer>
                <TextInput type="text" placeholder="Type to search..." onChange={(e) => setUserName(e.target.value)}></TextInput>
                {user && user.userName == userName ? SearchResult() : ''}
        </WidgetContainer>
    ); 
}

export default AddFriend;
