import React from 'react';
import { DashBoardContainer, Box } from './DashBoardElements';
import Widget from '../Widget/Widget';

const DashBoard = () => {
    return (
        <DashBoardContainer>
            <Box gridArea='col1'><Widget/></Box>
            <Box gridArea='col2'><Widget/></Box>
            <Box gridArea='col3'><Widget/></Box>
            <Box gridArea='col4'><Widget/></Box>
            <Box gridArea='col5'><Widget/></Box>
            <Box gridArea='col6'><Widget/></Box>
            <Box gridArea='game'><Widget/></Box>
            <Box gridArea='chat'><Widget/></Box>
        </DashBoardContainer>
    );
}

export default DashBoard;
