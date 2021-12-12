import React from 'react'
import { Form, TextInput, Text, Label, Button, FormContainer } from './ConnectionFormElements';

import { List, LongList, Item } from '../SideBar/SideBarElements';

const ConnectionForm = () => {
    return (
        <FormContainer>
            <Form>
                <Text>Login</Text>
                    <Item><Label> Email </Label><TextInput type='text'/></Item>
                    <Item><Label> Password </Label><TextInput type='password'/></Item>
                    <Item><Button type='submit'>Connect</Button></Item>
            </Form>
        </FormContainer>
    )
}

export default ConnectionForm
