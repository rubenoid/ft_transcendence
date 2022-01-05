import React, {useEffect} from 'react';
import { useState } from 'react';
import { FormContainer, Form, Label, Button  } from './ConnectionFormElements';
import { RoundButton, List, LongList, Item, Link } from '../Utils/Utils';
import { TextInput, Text } from '../Utils/Utils';
import { register, fetchUserByUserName, User } from '../../API/API';

const RegistrationForm = () => {

  const [user, setUser] = useState<User>(undefined);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
      async function getUsers(): Promise<User> {
          const user: User = await fetchUserByUserName(userName);
          user ? setUser(user) : setUser(undefined);
          return user;
      }
      getUsers();
  }, [userName]);

  const registerNewUser = (e: any, username: string, firstname: string, lastname:string) => {
    e.preventDefault();
    if (username && firstName && lastName) {
      register(username, firstName, lastName);
    }
    else {
      console.log("Error->", username, firstName, lastName);
    }
  }
  return (
      <FormContainer>
          <Form>
                  <Item><RoundButton><Text fontSize='20px'>42</Text></RoundButton></Item>
                  <Item>
                    <Label> <Text fontSize='20px'>Username</Text></Label>
                    <TextInput type='text' onChange={(e) => {setUserName(e.target.value)}}/>
                    {user ? <Text>username already in use</Text> : ''}
                  </Item>
                  <Item>
                    <Label> <Text fontSize='20px'>FirstName</Text></Label>
                    <TextInput type='text' onChange={(e) => {setFirstName(e.target.value)}}/>
                  </Item>
                  <Item>
                    <Label> <Text fontSize='20px'>Lastname</Text></Label>
                    <TextInput type='text' onChange={(e) => {setLastName(e.target.value)}}/>
                  </Item>
                  <Item>
                      <Button type='submit' onClick={(e) => {registerNewUser(e, userName, firstName, lastName)}}>
                        <Text fontSize='20px'>Register</Text>
                      </Button>
                  </Item>
                  <Text fontSize='15px'>Sign In</Text>
          </Form>
      </FormContainer>
  );
}

export default RegistrationForm;