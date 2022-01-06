import React from 'react';
import { FormContainer, Form, Label, Button  } from './ConnectionFormElements';
import { RoundButton, Item } from '../Utils/Utils';
import { TextInput, Text } from '../Utils/Utils';

const RegistrationForm = () => {
    return (
        <FormContainer>
            <Form>
                    <Item><RoundButton><Text fontSize='20px'>42</Text></RoundButton></Item>
                    <Item><Label> <Text fontSize='20px'>Firstname</Text></Label><TextInput type='text'/></Item>
                    <Item><Label> <Text fontSize='20px'>Lastname</Text></Label><TextInput type='text'/></Item>
                    <Item><Label> <Text fontSize='20px'>Username</Text></Label><TextInput type='text'/></Item>
                    <Item><Button type='submit'><Text fontSize='20px'>Register</Text></Button></Item>
                    <Text fontSize='15px'>Sign In</Text>
            </Form>
        </FormContainer>
    );
}

export default RegistrationForm;
