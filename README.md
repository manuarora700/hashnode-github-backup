## Hashnode Blogs

Problem Statement: Create a page that can fetch blog posts of a user on Hashnode using the Hashnode API. Create a mechanism to take backup of the latest 5 articles onto GitHub using the GitHub API.

## Todos

- [x] Connect Hashnode GraphQL API and fetch blogs for a user.
- [x] Connect GitHub API using PAT
- [ ] Create file on the lambda instance using `contentMarkdown` field.
- [ ] Push changes to a PARTICULAR GitHub repo.
- [ ] Show only 5 latest blogs.
- [ ] Check best scaling practices
- [ ] Bonus: OAuth flow for GitHub. Make the user login to their GitHub, use THEIR Repositories to take Backup.
- [ ] Bonus: Fetch ALL repos of a user and then make them choose which one they want the backup on.
- [ ] Bonus: Fetch more repos on load more click.
