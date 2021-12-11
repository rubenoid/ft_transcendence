import React from 'react';
import { Nav, Logo, List, LongList, Item, Button } from './SideBarElements';

const SideBar = () => {
    return (
        <Nav>
            <Logo to='/'>Pong.com</Logo>
            <List>
                    <Item><Button to='/'>Play</Button></Item>
                    <Item><Button to='/'>Chat</Button></Item>
                    <Item><Button to='/'>Connect</Button></Item>
            </List>
            <LongList>
                    <Item><Button to='/'>Sign Up</Button></Item>
                    <Item><Button to='/'>Log In</Button></Item>
            </LongList>
            <List>
                <Item><Button to='/'>English</Button></Item>
                <Item><Button to='/'>Help</Button></Item>
            </List>
        </Nav>
    );
}

export default SideBar;
