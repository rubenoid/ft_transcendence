import axios, { AxiosInstance } from 'axios';

export type User = {
  id: number,
  userName: string,
  firstName: string,
  lastName: string,
  wins: number,
  losses: number,
  rating: number,
  isActive: boolean
}

const instance: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

export const fetchData = async (url?: string) => {
  await instance.get('/user/all')
  .then(response => {
    console.log('FETCHDATA');
    console.log(response);
    console.log(response.data);
    return(response.data);
  })
  .catch(error => {
    console.log(error);
  })
}

export const fetchUsers = async (): Promise<User[]> => {

  let users: User[];

  await instance.get<User[]>('/user/all')
  .then( response => {
      users = response.data;
    })
  .catch(error => {
    console.log('ERROR->' + error);
  });
  return users;
}

export const fetchUserByUserName = async (userName: string): Promise<User> => {
  
  let user: User;

  const endpoint = `/user/getByUserName/${userName}`;
  console.log('ENDPOINT->');
  console.log(endpoint);

  await instance.get<User>(endpoint)
  .then(response => {
    user = response.data;
  })
  .catch((error) => {
    return Promise.reject(error);
  });
  console.log(user);
  return user;
}

export const loginThroughIntra = async () => {
  const endpoint = '/auth/login';

  await instance.get(endpoint)
  .then(response => {
    console.log('RESPONSE LOGIN: ');
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  })
}

export const isLogedIn = async () => {
  const endpoint = '/auth/guarded-jwt';
  await instance.get(endpoint)
  .then(response => {
    console.log('RESPONSE LOGIN: ');
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  })
}