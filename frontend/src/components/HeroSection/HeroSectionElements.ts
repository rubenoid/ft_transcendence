import styled, { createGlobalStyle } from 'styled-components';
import { Link as LinkR } from 'react-router-dom';

export const HeroContainer = styled.div`
    padding: 5px 10px;
`;

export const Logo = styled(LinkR)`
    color: green;
    cursor: pointer;
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
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