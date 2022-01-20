import React from 'react';
import { Form, FormContainer } from './ConnectionFormElements';
import { Text } from '../Utils/Text/Text';
import { Link } from '../Utils/Link/Link';

const ConnectionForm = () => {

    return (
        <FormContainer>
            <Form>
                <Link href='http://localhost:5000/auth/login'><Text color='green'>42</Text></Link>
            </Form>
        </FormContainer>
    );
}

export default ConnectionForm;
