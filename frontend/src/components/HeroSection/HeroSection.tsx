import React from 'react';
import SideBar from '../SideBar/SideBar';
import { HeroContainer, Title, Header } from './HeroSectionElements';

const HeroSection = () => {
    return (
        <HeroContainer>
            <Title>
                   <Header>Play Pong</Header>
                   <Header>for Free</Header>
                   <Header>on the #1 Site!</Header>
            </Title>
        </HeroContainer>
    );
}

export default HeroSection;
