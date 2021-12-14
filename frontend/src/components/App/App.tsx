import { GlobalStyle, Container } from './App.styles';
import React from 'react';
import HeroSection from '../HeroSection/HeroSection';
import { BrowserRouter as Router } from 'react-router-dom'

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