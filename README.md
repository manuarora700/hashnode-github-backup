## Hashnode Blogs Backup

<img src="https://res.cloudinary.com/algochurn/image/upload/v1661619210/assets/ezgif.com-gif-maker_12_z66pjk.gif" />

The projects mimics the `Backup` functionality as seen on [Hashnode](https://hashnode.com).

## Tech Stack

- [Next.js](https://nextjs.org) for front-end
- [Next.js Serverless](https://nextjs.org/docs/api-routes/introduction) for API calls communicating to the [GitHub](https://github.com) API
- [TailwindCSS](https://tailwindcss.com) for styling.
- [Hashnode API](https://api.hashnode.com) for fetching blogs of a user from hashnode.

## Folder Structure and Files

- `/components`: All React components.
- `/pages`: All routes in the application.
- `/lib`: Helper methods for fetching data from GitHub
- `/util`: Utility methods and classes
- `/interface`: All interfaces for TypeScript
- `/Icons`: All App icons.
- `/requests`: All HTTP requests to the Hashnode API.
- `.env`: Environment variables.

## Functionalities And Implementation

### Backup feature

In the `v0.1.1` branch, I started off with implementing the basic approach of calling the [GitHub API for fetching user files](https://docs.github.com/en/rest/repos/contents#get-repository-content). This involved 2 processes:

1. Fetch the repo contents and analyse all files. If the blogs that we are trying to take backup of **already exists**, the response will return a `sha` key. That `sha` key can be used to `Update` the file.
2. If the file DOES NOT EXIST, it can simply be created using the same API.

The **problem** I see with the above approach is if a user has 5 blogs, it will make `5 API CALLS` to `GET` the files to determine if the `sha` exists. And the next subsequent `5 API calls` will be to update each blog. The makes it a total of `10 API Calls` to the GitHub api for taking backup once.

Also, it will result in creating `5 commits` for `5 blog posts`.

### Backup feature - Optimal solution (generating sha for files).

#### Basic Explanation

1. Get the contents of the file using the `getRepoContents()` functionality

```javascript
export const getContentsOfRepo = async (
  owner: string,
  repo: string
): Promise<GithubContents[] | null> => {
  return axios
    .get(`https://api.github.com/repos/${owner}/${repo}/contents`)
    .then((response) => response?.data as GithubContents[])
    .catch(function (error) {
      console.log("Error in getRepo...", error?.message);
      return null;
    });
};
```

2. Create a `HashMap` to `fileName` as `key` and `sha` as the `value`.
3. Iterate through the `contentMarkdowns` of the blogs which were initially provided the the serverless API. Essentially, here the `sha` of the file will be created using the following function.

```javascript
public static getFileSha = (contents: string) => {
    return sha1(`blob ${Buffer.byteLength(contents)}\0${contents}`);
};
```

This creates a `sha` value which is used by GitHub also (Got it from stack overflow, not going to lie. 😶).

4. IF the `generated sha` of the file matches with the `retrieved sha` - That means the file didn't change AND the file is already created - the we basically UPDATE the file using the following code snippet.

```javascript
diffFiles.push({
  contents: Buffer.from(markdowns[i]?.contentMarkdown).toString("base64"),
  fileName,
});
```

`diffFiles` is the array that will contain files which needs `creation and updation`.

#### Pushing To Origin

To update the files, I follow a simple process which will result in a single commit:

1. create `Blobs` of the supplied `diffFiles`.
2. Get the `defaultBranchHeadSha` - We are only concerned about the `main` branch here. For this, we are going to essentially `loadRef` using the `OctoKit` apis. This is also configurable.
3. Once we have the `branch head sha`, we can essentially create a `tree` using `OctoKit`.
4. Finally, the `createCommit()` method from `OctoKit` can create a commit and push to the `main` branch.

### The reason for creating custom `sha`

This will help in NOT UPDATING the files which have not been modified by the user. If the user has 5 blogs today and 10 blogs in the future. If the past 5 blogs are not updated, this approach will only update the next 5 blogs which were recently added by the user.

## Todos

- [x] Connect Hashnode GraphQL API and fetch blogs for a user.
- [x] Connect GitHub API using PAT
- [x] Create file on the lambda instance using `contentMarkdown` field. [NOT REQUIRED]
- [x] Push changes to a PARTICULAR GitHub repo.
- [x] Show only 5 latest blogs. [SHOWING 6]
- [x] Check best scaling practices
- [ ] Bonus: OAuth flow for GitHub. Make the user login to their GitHub, use THEIR Repositories to take Backup.
- [ ] Bonus: Fetch ALL repos of a user and then make them choose which one they want the backup on.
- [ ] Bonus: Fetch more repos on load more click.
