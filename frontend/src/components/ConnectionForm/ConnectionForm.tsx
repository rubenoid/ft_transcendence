import React, {useEffect} from 'react';
import { Form, Label, Button, FormContainer } from './ConnectionFormElements';
import { TextInput, Text } from '../Utils/Utils';
import { RoundButton, Link, Item } from '../Utils/Utils';
import { isLogedIn, loginThroughIntra } from '../../API/API';

const ConnectionForm = () => {
    return (
        <FormContainer>
            <Form>
                    <Item><RoundButton><Text fontSize='20px'><Link href="http://localhost:5000/auth/login">42</Link></Text></RoundButton></Item>
            </Form>
        </FormContainer>
    );
}

export default ConnectionForm;
