import React from 'react';
import { HeroContainer, Logo, Title, Header } from './HeroSectionElements';
import DashBoard from '../DashBoard/DashBoard';

const HeroSection = () => {
    return (
        <HeroContainer>
            <Logo to='/'>Pong.com</Logo>
            <DashBoard/>
        </HeroContainer>
    );
}

export default HeroSection;
