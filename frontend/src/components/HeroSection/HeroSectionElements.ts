import styled, { createGlobalStyle } from 'styled-components';

export const HeroContainer = styled.div`
    background: #312e2b;
    position: relative;
    display: flex;
    flex-grow: 1;
    margin: 15px 20%;
`;

export const Title = styled.div`
    margin-top: 30px;
    margin-left: auto;
    width: 400px;
    text-align: center;
    color: #fff;
    line-height: 1.2;
    font-weight: bold;
    font-size: 24px;
`;

export const Header = styled.h1`
   display: block; 
`;

export const HeroText = styled.p`
    margin-top: 24px;
    color: #fff;
    font-size: 24px;
    text-align: center;
    max-width: 600px;
    @media screen and (max-width: 768px) {
        font-size: 24px;
    }
    
    @media screen and (max-width: 480px) {
        font-size: 18px;
    }
`;