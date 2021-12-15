import React from 'react'
import { AddFriendContainer, SearchBox } from './AddFriendElements'
import { Item, TextInput ,Text, Button, WidgetContainer } from '../Utils/Utils'

const AddFriend = () => {
    return (
        <WidgetContainer>
            <Item><Text>User Manager</Text></Item>
            
            <Item>
                <TextInput type="text" placeholder="Type to search..."></TextInput>
            </Item>  
            <Item>
                <Button><Text fontSize='20px'>Search</Text></Button>
            </Item>
        </WidgetContainer>
    );
}

export default AddFriend
