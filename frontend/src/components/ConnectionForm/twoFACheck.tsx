import React, {useEffect} from 'react';
import { useState } from 'react';
import { FormContainer, Form, Label, Button } from './ConnectionFormElements';
import { postData, fetchData } from '../../API/API';
import QRCode from "qrcode.react";
import { useNavigate, Link } from 'react-router-dom';
import { sharedHeroSection } from '../HeroSection/HeroSection';
import { Item } from '../Utils/List/List';
import { TextInput } from '../Utils/TextInput/TextInput';
import { Text } from '../Utils/Text/Text';

const TwoFACheck = () => {

  const navigate = useNavigate();
  const [twoFA, settwoFA] = useState<boolean>(undefined);
  const [inputtedTwoFA, setinputtedTwoFA] = useState<string>(undefined);
  const { isConnected, setIsConnected } = sharedHeroSection();

  useEffect(() => {
    async function inputAccessCode(): Promise<boolean> {
      if (inputtedTwoFA && inputtedTwoFA.length != 6)
        return;
      const validated: boolean = await postData(`/auth/inputAccessCode`, {usertoken: inputtedTwoFA});
      if (validated == true)
      { 
        settwoFA(true); 
        console.log("GOOD QR code inpute 2FA");
        await fetchData("auth/logedin");
        setIsConnected(true);
        navigate("/logedin", {replace: true});
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
                <Label> <Text fontSize='20px'>Enter your 2FA code</Text></Label>
                <TextInput type='text' onChange={(e) => {setinputtedTwoFA(e.target.value)}}/>
              </Item>
          </Form>
      </FormContainer>
  );
}

export default TwoFACheck;