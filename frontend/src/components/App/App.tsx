import { GlobalStyle, Container } from './App.styles';
import React, { useState, useEffect } from 'react';
import HeroSection from '../HeroSection/HeroSection';
import { BrowserRouter as Router } from 'react-router-dom'
import { fetchUsers, User } from '../../API/API';

export default () => {

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        async function getUsers(): Promise<User[]> {
            const users: User[] = await fetchUsers();
            setUsers(users);
            return users;
        }
        getUsers();
    }, [fetchUsers]);

    console.log('USERS');
    console.log(users);

    return(
        <>
            <GlobalStyle />
            <Router>
                    <HeroSection/>
            </Router>
        </>
    );
}