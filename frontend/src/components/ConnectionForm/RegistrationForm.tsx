import React, {useEffect} from 'react';
import { useState } from 'react';
import { FormContainer, Form, Label, Button } from './ConnectionFormElements';
import { RoundButton, List, LongList, Item, Link } from '../Utils/Utils';
import { TextInput, Text } from '../Utils/Utils';
import { register, User, fetchData } from '../../API/API';
import QRCode from "qrcode.react";


const RegistrationForm = () => {

  const [user, setUser] = useState<User>(undefined);
  const [registered, setRegistered] = useState<boolean>(false);
  const [twoFA, settwoFA] = useState<boolean>(false);
  const [changefa, setchangefa] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [qrcode, setqrcode] = useState<string>(undefined);

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

useEffect(() => {
  async function getQR(): Promise<string> {
    const endpoint = `auth/getQr`;
    const qrcodegot: string = await fetchData(endpoint);
    console.log("fetched: qrcode", qrcodegot);
    setqrcode(qrcodegot);
    console.log("QRCODE:", qrcode);
    return (qrcode);
  }
  getQR();
}, [twoFA]);

const handletwoFA = (e: any) => {
  e.preventDefault();
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
      console.log("registering with TWOFA is", twoFA);
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
                  {registered ? '' : 
                    <Text>Enable Two factor Authenication</Text>
                  }
                    {registered ? '' : 
                      <Button type='submit' onClick={(e) => {handletwoFA(e)}}>
                      {changefa ? <Text fontSize='20px'>Disable</Text> : <Text fontSize='20px'>Enable</Text>}
                      </Button>
                    }
                  </Item>

                  <Item>
                      {registered ? '' : 
                      <Button type='submit' onClick={(e) => {registerNewUser(e, userName, firstName, lastName, twoFA)}}>
                        <Text fontSize='20px'>Register</Text>
                      </Button>
                      }
                  {/* </Item> */}
                    {/* {registered && twoFA ? <text>QRCODE IS: {qrcode} </text> : ''} */}
                  {/* <Item> */}
                  {registered && twoFA ? 
                    <Item>
                      <img src={qrcode} alt="" />
                      <a href="http://localhost5000:auth/getQr" download="QRCode"></a>
                      <Label> <Text fontSize='20px'>Input2FA code pls</Text></Label><TextInput type='text'></TextInput></Item>  : ''} 
                    {(!twoFA) && registered ?
                    <Button><Text fontSize='15px'><Link href="http://localhost:5000/auth/login">sign in</Link></Text></Button> : ''}
                  </Item>
                  {/* if no 2FA link below otherwise */}
          </Form>
      </FormContainer>
  );
}

export default RegistrationForm;