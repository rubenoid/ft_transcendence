import React from 'react'
import { List, Bottom, Item, Button, Nav, LogoContainer, NavLogo } from './SideBarElements'

const SideBar = () => {
    return (
        <>
            <Nav>
                <LogoContainer>
                    <NavLogo to='/'>Pong.com</NavLogo>
                </LogoContainer>
                <List>
                    <Item><Button to='/'>Play</Button></Item>
                    <Item><Button to='/'>Chat</Button></Item>
                    <Item><Button to='/'>Connect</Button></Item>
                    <Item><Button to='/'>Sign Up</Button></Item>
                    <Item><Button to='/'>Log In</Button></Item>
                </List>
                <Bottom>
                    <List>
                        <Item><Button to='/'>English</Button></Item>
                        <Item><Button to='/'>Help</Button></Item>
                    </List>
                </Bottom>
            </Nav>
        </>
    )
}

export default SideBar

