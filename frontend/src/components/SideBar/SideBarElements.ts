import styled from 'styled-components';
import { Link as LinkR } from 'react-router-dom'

export const Nav = styled.div`
    background: #262421;
    position: relative;
    height: 100vh;
    width: 150px;
    margin: 0;
    padding: 10px 10px;
    z-index: 10;
    display: flex;
    flex-direction: column;
`;

export const Bottom = styled.div`
    background: #262421;
    position: absolute;
    bottom: 0;
`;

export const List = styled.ul`
    width: 100%;
    margin: 10px 0 ;
    list-style-type: none;
`;

export const Item = styled.li`
    background: #262421;
    width: 100%;
    padding: 5px 0;
`;

export const LogoContainer = styled.div`
    background: #262421;
`;

export const NavLogo = styled(LinkR)`
    width: 100%;
    background: #26211b;
    color: #fff;
    cursor: pointer;
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
`;

export const Button = styled(LinkR)`
    color: #dad8d6;
    background: #26211a;
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