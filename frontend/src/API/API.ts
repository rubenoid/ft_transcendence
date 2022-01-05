import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

export type User = {
  id: number,
  userName: string,
  firstName: string,
  lastName: string,
  avatar: string,
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

export const fetchMySelf = async (): Promise<User> => {

  let usr: User;

  await instance.get<User>('/user/me', {headers: {
	"Access-Control-Allow-Credentials": "true",
	"Access-Control-Allow-Origin": "http://localhost:5000",
	'Authorization': Cookies.get("AuthToken"),
  }})
  .then( response => {
      usr = response.data;
    })
  .catch(error => {
    console.log('ERROR->' + error);
  });
  return usr;
}

export const fetchUsers = async (): Promise<User[]> => {

  let users: User[];

  await instance.get<User[]>('/user/all', {headers: {
	"Access-Control-Allow-Credentials": "true",
	"Access-Control-Allow-Origin": "http://localhost:5000",
	'Authorization': Cookies.get("AuthToken"),
  }})
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

  await instance.get<User>(endpoint, {headers: {
	"Access-Control-Allow-Credentials": "true",
	"Access-Control-Allow-Origin": "http://localhost:5000",
	'Authorization': Cookies.get("AuthToken"),
  }})
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

  await instance.get(endpoint, {headers: {
	"Access-Control-Allow-Credentials": "true",
	"Access-Control-Allow-Origin": "http://localhost:5000",
	'Authorization': Cookies.get("AuthToken"),
  }})
  .then(response => {
    console.log('RESPONSE LOGIN: ');
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  })
}

export const isLogedIn = async () => {
  console.log("Cookies.get(AuthToken): " + Cookies.get("AuthToken"));
  const endpoint = '/auth/guarded-jwt';

  await instance.get(endpoint, {headers: {
	  "Access-Control-Allow-Credentials": "true",
	  "Access-Control-Allow-Origin": "http://localhost:5000",
	  'Authorization': Cookies.get("AuthToken"),
	}})
  .then(response => {
    console.log('RESPONSE LOGIN: ');
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  })
}