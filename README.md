# GitHub Repo Explorer — Backend

Express + PostgreSQL REST API powering user auth, Github username repo search, and saving repos to favorites.

[Check out the frontend Github Repo Explorer here](https://github.com/jadonahue/github_repo_explorer_frontend)

---

## Features

-   **User management**: register, login with JWT
-   **Repo search**: fetch via GitHub API (`fetch` or `axios`)
-   **Favorites**: CRUD operations linked to authenticated users
-   **Typescript** with type safety throughout
-   **PostgreSQL** schema:
    -   `users(id, email, password)`
    -   `favorites(user_id, repo_id, repo_name, ...)`

---

## Tech Stack

-   Node.js + Express 5
-   TypeScript
-   PostgreSQL (`pg`)
-   Auth: JWT (`jsonwebtoken`)
-   Passwords: bcrypt
-   Config management: dotenv
-   API testing: Postman / cURL
-   Deployment: Heroku

---

## Installation

Clone and set up:

```bash
git clone https://github.com/jadonahue/github_repo_explorer_backend.git
cd github_repo_explorer_backend

npm install
touch .env
```

Create .env:

```bash
DB_HOST=...
DB_USER=...
DB_PASS=...
DB_NAME=...
JWT_SECRET=your_super_secret
PORT=3001
```

Start development server:

```bash
cd github_repo_explorer_backend
node src/server.ts
```

Database Schema
Run migrations:

```bash
psql -d yourdb -f src/db/schema.sql
```

Check tables in psql:

```sql
\dt
SELECT * FROM users;
```

## API Endpoints

| Method     | Endpoint              | Description                               | Auth Required |
| ---------- | --------------------- | ----------------------------------------- | ------------- |
| **POST**   | `/auth/register`      | Register a new user with email & password | ❌ No         |
| **POST**   | `/auth/login`         | Login user and return a JWT token         | ❌ No         |
| **GET**    | `/user/searchRepo`    | Search GitHub repositories by username    | ✅ Yes        |
| **GET**    | `/user/favorites`     | Get a list of the user's favorite repos   | ✅ Yes        |
| **POST**   | `/user/favorites`     | Add a new favorite repo                   | ✅ Yes        |
| **DELETE** | `/user/favorites/:id` | Remove a repo from favorites by `repo_id` | ✅ Yes        |

## Deployment

This API is deployed on Heroku but feel free to use whichever platform you prefer.

## Testing Endpoints

Use Postman or curl
Include Authorization: Bearer <token> for protected routes

## Security Notes

Passwords are hashed using bcrypt
JWT tokens expire in 60 days
Ensure JWT_SECRET is complex and never committed
