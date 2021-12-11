import React from 'react'
import { Form, TextInput, Text, Label, Button } from './ConnectionFormElements';

import { List, LongList, Item } from '../SideBar/SideBarElements';

const ConnectionForm = () => {
    return (
        <Form>
            <Text>Login</Text>
                <Item><Label> Email </Label><TextInput type='text'/></Item>
                <Item><Label> Password </Label><TextInput type='password'/></Item>
                <Item><Button type='submit'>Connect</Button></Item>
        </Form>
    )
}

export default ConnectionForm
