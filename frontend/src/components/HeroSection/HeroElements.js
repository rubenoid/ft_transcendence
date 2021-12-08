import styled from 'styled-components';

export const HeroContainer = styled.div`
    background: #312e2b ;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    position: relative;
    z-index: 1;
`;

export const HeroContent = styled.div`
    z-index: 3;
    max-width: 1200px;
    position: absolute;
    padding: 8px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const HeroTitle = styled.h1`
    color: #fff;
    font-size: 48px;
    text-align: center;
    @media screen and (max-width: 768px) {
        font-size: 40px;
    }
    
    @media screen and (max-width: 480px) {
        font-size: 32px;
    }
`;

export const Label = styled.span`
  display: flex;
  align-items: center;
  line-height: 1.2;
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