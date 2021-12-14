import axios from 'axios';

export type User = {
  id: number,
  userName: string,
  fistName: string,
  lastName: string,
  nbWin: number,
  nbLost: number,
  rating: number,
  isActive: boolean
}

const instance = axios.create({
  baseURL: "http://localhost:5000",
});

export const fetchUsers = async () => {

  let users: User[];

  await instance.get<User[]>('/user/all')
  .then( response => {
      users = response.data;
    }
  )
  .catch(error => {
    console.log('ERROR->' + error);
  });

  return users;
}
  