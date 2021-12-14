import React from 'react';
import { WidgetWrapper } from './WidgetElements';
import { fetchUsers } from '../../API/API';

type User = {
  id: number,
  userName: string,
  fistName: string,
  lastName: string,
  nbWin: number,
  nbLost: number,
  rating: number,
  isActive: boolean
}


const Widget = () => {
    const data = fetchUsers();
    console.log('DATA->' + data.then((val) => {
        console.log('VAL->' + val.users);
    }));
    return (
        <WidgetWrapper>
        </WidgetWrapper>
    );
}

export default Widget;
