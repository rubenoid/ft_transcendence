import React from 'react';
import { DashBoardContainer, Box } from './DashBoardElements';
import Widget from '../Widget/Widget';
import SideBar from '../SideBar/SideBar';
import Title from '../Title/Title';
import ConnectionForm from '../ConnectionForm/ConnectionForm';
import Pong from '../Pong/Pong';

export const DashBoard = () => {
    return (
        <DashBoardContainer>
            <Box gridArea='sideBar'><SideBar/></Box>
            <Box gridArea='col2'><Widget/></Box>
            <Box gridArea='col3'><Widget/></Box>
            <Box bgColor="#fff" gridArea='col4' alignSelf='center'><Title/></Box>
            <Box bgColor="#fff" gridArea='game'><Pong/></Box>
            <Box bgColor="#fff" gridArea='chat' alignSelf='center'><ConnectionForm/></Box>
        </DashBoardContainer>
    );
}

export default DashBoard;
