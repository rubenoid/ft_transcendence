import styled, { createGlobalStyle } from 'styled-components';

export const Container = styled.div`
    display: flex;
    width: 100%;
    position: relative;
`;

export const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: 'Encode Sans Expanded', sans-serif;
    }

    html, body {
        position: relative;
        width: 100%;
        height: 100%;
    }
`;