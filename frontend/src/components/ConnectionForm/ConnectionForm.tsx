import React, {useEffect} from 'react';
import { Form, Label, Button, FormContainer } from './ConnectionFormElements';
import { TextInput, Text } from '../Utils/Utils';
import { RoundButton, List, LongList, Item } from '../Utils/Utils';
import { loginThroughIntra } from '../../API/API';

const ConnectionForm = () => {
    
    function login(e: any) {
      e.preventDefault();
      console.log('Login');
      const test = async () => {
        console.log('IT WORKS');
        await loginThroughIntra();
      }
      test();
    }
    
    return (
        <FormContainer>
            <Form>
                    <Item><RoundButton onClick = {login}><Text fontSize='20px'>42</Text></RoundButton></Item>
                    <Item><Label> <Text fontSize='20px'>Email</Text></Label><TextInput type='text'/></Item>
                    <Item><Label><Text fontSize='20px'>Password</Text></Label><TextInput type='password'/></Item>
                    <Item><Button type='submit'><Text fontSize='20px'>Connect</Text></Button></Item>
                    <Text fontSize='15px'>Sign Up</Text>
            </Form>
        </FormContainer>
    )
}

export default ConnectionForm;
