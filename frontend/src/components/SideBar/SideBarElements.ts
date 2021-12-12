import styled from 'styled-components';
import { Link as LinkR } from 'react-router-dom';

export const Nav = styled.div`
    margin: 0;
    display: flex;
	flex-direction: column;
    height: 100%;
    padding: 10px;
    position: relative;
`;

export const Logo = styled(LinkR)`
    color: #fff;
    cursor: pointer;
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
`;

export const List = styled.ul`
    width: 100%;
    display: block;
    padding: 10px 0 0 0;
    list-style-type: none;
`;

export const LongList = styled.ul`
    width: 100%;
    margin: 10px 0;
    list-style-type: none;
    height: 100%;
    display: block;
    padding: 10px 0;
    position: relative;
`

export const Item = styled.li`
    list-style-type: none;
    width: 100%;
    padding: 5px 0;
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
