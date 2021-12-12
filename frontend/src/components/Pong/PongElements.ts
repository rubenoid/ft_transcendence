import styled from 'styled-components';

export const PongContainer = styled.div`
    height: 100%;
    display: flex;
    position: relative;
    justify-content: center;
`;

export const PongImg = styled.img`
    position: relative;
    max-height: 100%;
    max-width: 100%;
    opacity: 0.7;
`;

export const ButtonContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 5px;
    background-color: #444;
    transform: translate(-50%, -50%);
    padding: 50px;
    opacity: 0.9;
`;

export const Button = styled.button`
    width: 100%;
    margin: 10px;
    background-color: #04AA6D;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #abc;
    }
`;