import React from 'react';
import { Form, FormContainer } from './ConnectionFormElements';
import { RoundButton } from '../Utils/Buttons/Round/RoundButton';
import { Text } from '../Utils/Text/Text';
import { Link } from '../Utils/Link/Link';
import { Item } from '../Utils/List/List';

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
