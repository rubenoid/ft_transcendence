import React from 'react';
import { HeroContainer } from './HeroSectionElements';
import DashBoard from '../DashBoard/DashBoard';
import SideBar from '../SideBar/SideBar';

const HeroSection = () => {
    return (
        <HeroContainer>
            <DashBoard/>
        </HeroContainer>
    );
}

export default HeroSection;
