import { GlobalStyle, Container } from './App.styles';
import React from 'react';
import HeroSection from '../HeroSection/HeroSection';
import { BrowserRouter as Router } from 'react-router-dom'
import DashBoard from '../DashBoard/DashBoard';

export default () => {
    return(
        <>
            <GlobalStyle />
            <Router>
                    <HeroSection/>
            </Router>
        </>
    );
}