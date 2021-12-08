import { GlobalStyle, Container } from './App.styles';
import React from 'react';
import HeroSection from '../HeroSection/HeroSection';
import SideBar from '../SideBar/SideBar';

export default () => {
    return(
        <>
            <GlobalStyle />
            <Container>
                <SideBar/>
                <HeroSection/>
            </Container>
        </>
    );
}