import React from 'react'
import { Form, Label, Button, FormContainer } from './ConnectionFormElements';
import { TextInput, Text } from '../Utils/Utils'
import { RoundButton, List, LongList, Item } from '../Utils/Utils';

const ConnectionForm = () => {
    return (
        <FormContainer>
            <Form>
                    <Item><RoundButton><Text fontSize='20px'>42</Text></RoundButton></Item>
                    <Item><Label> <Text fontSize='20px'>Email</Text></Label><TextInput type='text'/></Item>
                    <Item><Label><Text fontSize='20px'>Password</Text></Label><TextInput type='password'/></Item>
                    <Item><Button type='submit'><Text fontSize='20px'>Connect</Text></Button></Item>
                    <Text fontSize='15px'>Sign Up</Text>
            </Form>
        </FormContainer>
    )
}

export default ConnectionForm
