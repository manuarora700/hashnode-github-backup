import axios from "axios";

export const fetchArticles = (username: any) => {
  let data = JSON.stringify({
    query: `query {
              user(username:"${username}") {
                photo
                publication {
                  posts (page:0) {
                    _id
                    title
                    slug
                    cuid
                    coverImage
                    dateAdded
                    brief
                    contentMarkdown
                  }
                }
              }
            }`,
    variables: {},
  });
  var config = {
    method: "post",
    url: "https://api.hashnode.com",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios(config);
};
