import React from 'react';
import { Form, Label, Button, FormContainer } from './ConnectionFormElements';
import { TextInput, Text } from '../Utils/Utils';
import { RoundButton, Link, Item } from '../Utils/Utils';


const ConnectionForm = () => {

    return (
        <FormContainer>
            <Form>
                <Item><Link href='http://localhost:5000/auth/login'><Text color='green'>42</Text></Link></Item>
            </Form>
        </FormContainer>
    );
}

export default ConnectionForm;
