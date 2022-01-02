import React, {useEffect} from 'react';
import { Form, Label, Button, FormContainer } from './ConnectionFormElements';
import { TextInput, Text } from '../Utils/Utils';
import { RoundButton, List, LongList, Item } from '../Utils/Utils';
import { isLogedIn, loginThroughIntra } from '../../API/API';

const ConnectionForm = () => {
    
    function login(e: any) {
      e.preventDefault();
      console.log('Login');
      const apiLogin = async () => {
        console.log('IT WORKS');
        //await loginThroughIntra();
        await isLogedIn();
      }
      apiLogin();
    }
    
    return (
        <FormContainer>
            <Form>
                    <Item><RoundButton><Text fontSize='20px'><a href="http://localhost:5000/auth/login">42</a></Text></RoundButton></Item>
                    <Item><Button onClick={login}>WORK</Button></Item>
                    <Item><Label> <Text fontSize='20px'>Email</Text></Label><TextInput type='text'/></Item>
                    <Item><Label><Text fontSize='20px'>Password</Text></Label><TextInput type='password'/></Item>
                    <Item><Button type='submit'><Text fontSize='20px'>Connect</Text></Button></Item>
                    <Text fontSize='15px'>Sign Up</Text>
            </Form>
        </FormContainer>
    );
}

export default ConnectionForm;
