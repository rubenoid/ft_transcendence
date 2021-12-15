import React from 'react';
import { DashBoardContainer, Box } from './DashBoardElements';
import Widget from '../Widget/Widget';
import Title from '../Title/Title';
import ConnectionForm from '../ConnectionForm/ConnectionForm';
import Pong from '../Pong/Pong';

export const DashBoard = () => {
    return (
        <DashBoardContainer>
            <Box gridArea='info1'><Widget/></Box>
            <Box gridArea='info2'><Widget/></Box>
            <Box gridArea='info3'><Widget/></Box>
            <Box bgColor="#fff" gridArea='title' alignSelf='center'><Title/></Box>
            <Box bgColor="#fff" gridArea='game'><Pong/></Box>
            <Box bgColor="#fff" gridArea='chat' alignSelf='center'><ConnectionForm/></Box>
        </DashBoardContainer>
    );
}

export default DashBoard;
