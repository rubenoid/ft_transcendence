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

export async function fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    const body = await response.json();
    return body;
}

export const fetchUsers = async() => {
  const users = await fetchData<User[]>('http://localhost:5000/user/all');
  return users;
}
  