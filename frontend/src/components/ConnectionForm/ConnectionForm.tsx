import React from 'react'
import { Form, Label, Button, FormContainer } from './ConnectionFormElements';
import { TextInput, Text } from '../Utils/Utils'
import { List, LongList, Item } from '../Utils/Utils';

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
