import React, {useState} from 'react';
import {TopContainer, ChatBoxContainer, InputContainer, SendIconContainer} from './ChatBoxElements';
import { TextInput, Text, List, LongList, Item } from '../../Utils/Utils';
import { ChatContainer } from '../ChatElements';
import { handlesSubmitNewMessages} from '../../socket'
import { AiOutlineSend as SendIcon} from 'react-icons/ai';

const ChatBox: React.FunctionComponent = () => {
    const [term, setTerm] = useState('');
    let allMsg = ['Abc', 'def'];
    
    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
      // Preventing the page from reloading
      event.preventDefault();
  
      <div id = "message"></div>
        console.log(term);
        

        allMsg.push(term); 
        handlesSubmitNewMessages(term);
    
    }
  

    return (
      <ChatBoxContainer>
        
        <InputContainer>
      <div className="container">
        <form onSubmit={submitForm}>
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            type="text"
            placeholder="Enter a term"
            className="input"
          />
          <button type="submit" className="btn">Submit</button>
        </form>
      </div>
      </InputContainer>
      
        <div>
            {allMsg.map(msg => <h4>{msg}</h4>)}
        </div>
    
      </ChatBoxContainer>
    );
  };


  export default ChatBox;