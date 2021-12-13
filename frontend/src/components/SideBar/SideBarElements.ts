import styled from 'styled-components';
import { Link as LinkR } from 'react-router-dom';

export const Nav = styled.div`
    width: 150px;
    height: 100%;
    background-color: #444;
    margin: 0;
    display: flex;
	flex-direction: column;
    padding: 10px;
`;

export const Logo = styled(LinkR)`
    color: #fff;
    cursor: pointer;
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
`;


export const Button = styled(LinkR)`
    color: #dad8d6;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    text-decoration: none;

    &:hover {
        transition: all 0.2s ease-in-out;
        color: #537133;
        cursor: pointer;
    }
`;
