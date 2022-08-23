export const getUserRepo = (userrepo: any, username: any) => {
    return fetch(`https://api.github.com/users/${username}/repos`)
    .then(response => response.json())
    .then(response => {
     return response;
   })}

   export const getUser = (username: any) => {
    return fetch(`https://api.github.com/users/${username}`)
    .then(response => response.json())
    .then(response => {
      return response;
     })
}