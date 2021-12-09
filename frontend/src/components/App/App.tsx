import { GlobalStyle, Container } from './App.styles';
import React from 'react';
import HeroSection from '../HeroSection/HeroSection';
import SideBar from '../SideBar/SideBar';
import { BrowserRouter as Router } from 'react-router-dom'

export default () => {
    return(
        <>
            <GlobalStyle />
            <Router>
                <Container>
                    <SideBar/>
                    <HeroSection/>
                </Container>
            </Router>
        </>
    );
}