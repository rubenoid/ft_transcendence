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

axios.interceptors.request.use(function(config) {
  console.log('Test Interceptor request->');
  return config;
},
  function(error) {
    console.log('Test Interceptor request Error->');
    return Promise.reject(error);
  }
)

axios.interceptors.response.use(function (response) {
  console.log('Test interceptor response->');
  return response;
}, function(error) {
  console.log('Test interceptor response error->');
    return Promise.reject(error);
})

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
