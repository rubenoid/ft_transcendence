import React from 'react';
import { DashBoardContainer, Box } from './DashBoardElements';
import Widget from '../Widget/Widget';

const DashBoard = () => {
    return (
        <DashBoardContainer>
            <Box gridColumn='1' gridRow='1' ><Widget/></Box>
            <Box gridColumn='2 / span 1' gridRow='' ><Widget/></Box>
            <Box gridColumn='3' gridRow='1'><Widget/></Box>
            <Box gridColumn='3' gridRow='2'><Widget/></Box>
            <Box gridColumn='3' gridRow='2'><Widget/></Box>
            <Box gridColumn='1' gridRow='2'><Widget/></Box>
            <Box gridColumn='2' gridRow='2'><Widget/></Box>
        </DashBoardContainer>
    );
}

export default DashBoard;
