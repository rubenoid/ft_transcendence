import React, {useEffect} from 'react';
import { useState } from 'react';
import { FormContainer, Form, Label, Button } from './ConnectionFormElements';
import { RoundButton, List, LongList, Item, Link } from '../Utils/Utils';
import { TextInput, Text } from '../Utils/Utils';
import { postData, User, fetchData } from '../../API/API';
import QRCode from "qrcode.react";


const TwoFACheck = () => {
  
  return (
      <FormContainer>
          <Form> 
                    <Item>
                      <Label> <Text fontSize='20px'>Enter your 2FA code</Text></Label><TextInput type='text' />
                    </Item>
                    <Item>
                      <Button><Text fontSize='15px'><Link href="http://localhost:8080/profile">sign in</Link></Text></Button>
                  </Item>
          </Form>
      </FormContainer>
  );
}

export default TwoFACheck;