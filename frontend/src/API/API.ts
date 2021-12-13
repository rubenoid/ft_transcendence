export const fetchData = async () => {
    const endPoint = 'http://localhost:5000/user/random';
    const data = await (await fetch(endPoint)).json();
    return data.results;
}