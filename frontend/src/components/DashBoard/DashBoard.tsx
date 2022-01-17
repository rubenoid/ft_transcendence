import React from 'react';
import { DashBoardContainer, Box } from './DashBoardElements';
import Users from '../Users/Users';
import Pong from '../Pong/Pong';
import AddFriend from '../AddFriend/AddFriend';
import Chat from '../Chat/Chat';
import Profile from '../Profile/Profile';
import { Route, Routes } from 'react-router-dom';
import SettingsForm from '../settings/settings';
import ProfileExtended from '../ProfileExtended/ProfileExtended'

export const DashBoard = () => {
    return (
        <DashBoardContainer>
            <Box gridArea='info1'><Users/></Box>
            <Box gridArea='profile'><Profile></Profile></Box>
            <Box gridArea='info2'><AddFriend/></Box>
            <Box  gridArea='game'>
            <Routes>
                <Route path="/" element={<ProfileExtended/>}/>
                <Route path="test" element={<p>jeff</p>}/>
                <Route path="settings" element={<SettingsForm/>}/>
                <Route path="game" element={<Pong/>}/>
            </Routes>
            </Box>
            <Box  gridArea='chat' alignSelf='center'><Chat/></Box>
        </DashBoardContainer>
    );
}

export default DashBoard;
