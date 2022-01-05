import React from 'react';
import { useState } from 'react';
import { FormContainer, Form, Label, Button  } from './ConnectionFormElements';
import { RoundButton, List, LongList, Item, Link } from '../Utils/Utils';
import { TextInput, Text } from '../Utils/Utils';
import { register } from '../../API/API';

const RegistrationForm = () => {
    const [first, setFirstname] = useState('');
    const [last, setLastname] = useState('');
    const [user, setUsername] = useState('');

    const handleFirstname = (e : any) => {
        setFirstname(e.target.value);
      };

      const handleLastname = (e : any) => {
        setLastname(e.target.value);
      };

      const handleUsername = (e : any) => {
        setUsername(e.target.value);
      };

      const handleSubmit = (e : any) => {
        e.preventDefault();
        if (first === '' || last === '' || user === '') {
          console.log("error submitting registration form");
        }
        else {
            register(user, first, last)
        }
      };

    
    return (
        <FormContainer>
            <Form>
                    <Item><RoundButton><Text fontSize='20px'>42</Text></RoundButton></Item>
                    <Item><label>Username</label><input onChange={handleUsername} className="input" value={user} type="text" /><TextInput type='user'/></Item>
                    <Item><label>Firstname</label><input onChange={handleFirstname} className="input" value={first} type="text" /><TextInput type='first'/></Item>
                    <Item><label>Lastname</label><input onChange={handleLastname} className="input" value={last} type="text" /><TextInput type='last'/></Item>
                    <Item><Button type='submit' onClick={handleSubmit}><Text fontSize='20px'>Register</Text></Button></Item>
                    <Item><RoundButton type='submit'><Text fontSize='20px'><Link href="http://localhost:8080/profile">Sign in</Link></Text></RoundButton></Item>
                    {/* <Item value={first}><Label><Text fontSize='20px' onChange={handleFirstname}>Firstname</Text></Label><TextInput type='text'/></Item> */}
                    {/* <Item><Label> <Text fontSize='20px' onChange={handleLastname}>Lastname</Text></Label><TextInput type='text'/></Item> */}
                    {/* <Item><Label> <Text fontSize='20px'onChange={handleUsername}>Username</Text></Label><TextInput type='text'/></Item> */}
            </Form>
        </FormContainer>
    );
}


export default RegistrationForm;
