import { GlobalStyle, Container } from './App.styles';
import React, { useState } from 'react';
import HeroSection from '../HeroSection/HeroSection';
import { BrowserRouter as Router } from 'react-router-dom'
import { fetchUsers, User } from '../../API/API';

export default () => {
    const data = fetchUsers();
    console.log('DATA->' + data.then((value)=>{ console.log(value[1])}));
    return(
        <>
            <GlobalStyle />
            <Router>
                    <HeroSection/>
            </Router>
        </>
    );
}