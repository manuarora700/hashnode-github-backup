import axios from "axios";

export const getUserRepo = (userrepo: any, username: any) => {
  return fetch(`https://api.github.com/users/${username}/repos`)
    .then((response) => response.json())
    .then((response) => {
      return response;
    });
};

export const getUser = (username: any) => {
  return fetch(`https://api.github.com/users/${username}`)
    .then((response) => response.json())
    .then((response) => {
      return response;
    });
};

export const updateRepoWithMarkdown = async (config: any) => {
  console.log(config?.url);
  return axios(config)
    .then(function (response) {
      return response?.data;
    })
    .catch(function (error) {
      return null;
    });
};

export const getRepo = async (fileName: any) => {
  // https://api.github.com/repos/manuarora700/posts-backup/contents/62d605a4bc2c7a1dc672d101.md
  let API = `https://api.github.com/repos/manuarora700/posts-backup/contents/${fileName}`;
  console.log("API", API);
  return axios
    .get(API, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    })
    .then(function (response) {
      return response?.data;
    })
    .catch(function (error) {
      console.log("Error in getRepo...", error?.message);
      return null;
    });
};
