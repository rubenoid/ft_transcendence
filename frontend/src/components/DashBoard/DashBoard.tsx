import React from 'react';
import { DashBoardContainer, Box } from './DashBoardElements';
import Users from '../Users/Users';
import Pong from '../Pong/Pong';
import AddFriend from '../AddFriend/AddFriend';
import Chat from '../Chat/Chat';
import Profile from '../Profile/Profile';

export const DashBoard = () => {
    return (
        <DashBoardContainer>
            <Box gridArea='info1'><Users/></Box>
            <Box gridArea='profile'><Profile></Profile></Box>
            <Box gridArea='info2'><AddFriend/></Box>
            <Box  gridArea='game'><Pong/></Box>
            <Box  gridArea='chat' alignSelf='center'><Chat/></Box>
        </DashBoardContainer>
    );
}

export default DashBoard;
