import React, {useEffect} from 'react';
import { useState } from 'react';
import { FormContainer, Form, Label, Button } from './ConnectionFormElements';
import { RoundButton, List, LongList, Item, Link } from '../Utils/Utils';
import { TextInput, Text } from '../Utils/Utils';
import { register, User, fetchData } from '../../API/API';

const RegistrationForm = () => {

  const [user, setUser] = useState<User>(undefined);
  const [registered, setRegistered] = useState<boolean>(false);
  const [twoFA, settwoFA] = useState<boolean>(false);
  const [changefa, setchangefa] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
      async function getUsers(): Promise<User> {
        const endpoint = `/user/getByUserName/${userName}`;
          const user: User = await fetchData(endpoint);
          user ? setUser(user) : setUser(undefined);
          return user;
      }
      getUsers();
  }, [userName]);

  useEffect(() => {
    console.log("in use effects setchangefa");
      if (twoFA == true)
      {  
        setchangefa(true);
        console.log("changefa", changefa);
      }
      else
      {  
        setchangefa(undefined);
        console.log("changefa", changefa);

      }
}, [twoFA]);

const handletwoFA = (e: any) => {
  e.preventDefault();
  console.log("INN");
  if (twoFA == true)
  {  
    settwoFA(false);
    console.log("twoFA", twoFA);
  }
  else
  {  
    settwoFA(true);
    console.log("twoFA", twoFA);
  }
}

  const registerNewUser = (e: any, username: string, firstname: string, lastname:string, twoFA:boolean) => {
    e.preventDefault();
    if (username && firstName && lastName && !user) {
      register(username, firstName, lastName, twoFA);
      setRegistered(true);
    }
    else {
      console.log("Error->", username, firstName, lastName, twoFA);
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
                  <Text>Enable Two factor Authenication</Text>
                      <Button type='submit' onClick={(e) => {handletwoFA(e)}}>
                      {changefa ? <Text fontSize='20px'>Disable</Text> : <Text fontSize='20px'>Enable</Text>}
                      </Button>
                  </Item>

                  <Item>
                      {registered ? '' : 
                      <Button type='submit' onClick={(e) => {registerNewUser(e, userName, firstName, lastName, twoFA)}}>
                        <Text fontSize='20px'>Register</Text>
                      </Button>
                      }
                  </Item>
                  {registered ? <Text>Registered now please signin</Text> : ''}
                  {/* if no 2FA link below otherwise */}
                  <Button><Text fontSize='15px'><Link href="http://localhost:5000/auth/login">sign in</Link></Text></Button>
          </Form>
      </FormContainer>
  );
}

export default RegistrationForm;