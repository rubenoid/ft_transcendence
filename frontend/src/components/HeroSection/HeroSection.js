import React from 'react';
import { HeroContainer, HeroTitle, HeroContent, Label } from './HeroElements';

const HeroSection = () => {
    return (
        <HeroContainer>
            <HeroContent>
               <HeroTitle>
                   <Label> Play Pong </Label>
                   <Label> for Free </Label>
                   <Label> on the #1 Site! </Label>
               </HeroTitle>
            </HeroContent>
        </HeroContainer>
    );
}

export default HeroSection;
