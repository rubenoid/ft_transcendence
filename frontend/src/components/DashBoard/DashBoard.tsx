import React from 'react';
import { DashBoardContainer, Box } from './DashBoardElements';
import Widget from '../Widget/Widget';
import Title from '../Title/Title';
import ConnectionForm from '../ConnectionForm/ConnectionForm';
import Pong from '../Pong/Pong';
import AddFriend from '../AddFriend/AddFriend';
import Chat from '../Chat/Chat';
import Profile from '../Profile/Profile';

export const DashBoard = () => {
    return (
        <DashBoardContainer>
            <Box gridArea='info1'><Widget/></Box>
            <Box gridArea='profile'><Profile></Profile></Box>
            <Box gridArea='info2'><AddFriend/></Box>
            <Box  gridArea='game'><Pong/></Box>
            <Box  gridArea='chat' alignSelf='center'><Chat/></Box>
        </DashBoardContainer>
    );
}

export default DashBoard;
