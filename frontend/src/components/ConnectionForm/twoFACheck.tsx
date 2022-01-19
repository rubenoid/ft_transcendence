import React, {useEffect} from 'react';
import { useState } from 'react';
import { FormContainer, Form, Label, Button } from './ConnectionFormElements';
import { postData, User, fetchData } from '../../API/API';
import QRCode from "qrcode.react";
import { useNavigate, Link } from 'react-router-dom';
import { Item } from '../Utils/List/List';
import { TextInput } from '../Utils/TextInput/TextInput';
import { Text } from '../Utils/Text/Text';

const TwoFACheck = () => {

  const navigate = useNavigate();
  const [twoFA, settwoFA] = useState<boolean>(undefined);
  const [inputtedTwoFA, setinputtedTwoFA] = useState<string>(undefined);

  useEffect(() => {
    async function inputAccessCode(): Promise<boolean> {
      if (inputtedTwoFA.length != 6)
        return;
      const endpoint = `/auth/inputAccessCode`;
      const validated: boolean = await postData(endpoint, {usertoken: inputtedTwoFA});
      if (validated == true)
      { 
        settwoFA(true); 
        console.log("GOOD QR code inpute 2FA");
        await fetchData("auth/twoFALogin");
        navigate("/", {replace: true});
      }
      else
      { 
        settwoFA(undefined); 
        console.log("BAD QR code input 2FA");
      }
      return (validated);
    }
    inputAccessCode();
  }, [inputtedTwoFA]);

  return (
      <FormContainer>
          <Form> 
                    <Item>
                      <Label> <Text fontSize='20px'>Enter your 2FA code</Text></Label><TextInput type='text' onChange={(e) => {setinputtedTwoFA(e.target.value)}}/>
                    </Item>
                    {twoFA ?
                    <Item>
                      <Button><Text fontSize='15px'><Link to="/">sign in</Link></Text></Button>
                  </Item>
                  : ''}
          </Form>
      </FormContainer>
  );
}

export default TwoFACheck;