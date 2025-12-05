# YouTube Clone Backend

* This is the backend API for a YouTube clone project built with Node.js, Express, and MongoDB. It provides user authentication, channel management, video management, and comment functionality with JWT-based authentication

## Features

- User Authentication: Sign up, login, JWT token-based authentication.

- Channel Management: Create, edit, delete channels, subscribe/unsubscribe.

- Video Management: Upload, update, delete, like/dislike videos.

- Comments: Add, edit, delete, like/dislike comments.

- MongoDB Database: Stores users, channels, videos, comments, and file metadata.

## Technologies

- **Node.js**

- **Express.js**

- **MongoDB**

- **Mongoose**

- **JWT** (JSON Web Tokens)

- **bcrypt** (Password hashing)

- **Multer** (File uploads)

## Installation

* Clone the repository:
```bash
git clone https://github.com/R-Srijanki/Final-Backend.git
cd Final-Backend
```

* Install dependencies:
```bash
npm install
```

* Start the server:
```bash
npm start
```

- Server runs on http://localhost:8000.

## API Endpoints

- User Authentication
| Endpoint    | Method | Description                     |
| ----------- | ------ | ------------------------------- |
| `/register` | POST   | Register a new user             |
| `/login`    | POST   | Login user and return JWT token |

- Channel Management
| Endpoint                  | Method | Authentication | Description                        |
| ------------------------- | ------ | -------------- | ---------------------------------- |
| `/channels`               | POST   | ✅              | Create a new channel               |
| `/channels/:id`           | GET    | ✅              | Get channel details                |
| `/channels/:id`           | PATCH  | ✅              | Edit channel details               |
| `/channels/:id`           | DELETE | ✅              | Delete channel                     |
| `/channels/:id/subscribe` | POST   | ✅              | Subscribe/unsubscribe to a channel |

- Video Management

| Endpoint              | Method | Authentication | Description              |
| --------------------- | ------ | -------------- | ------------------------ |
| `/videos`             | GET    | ❌              | Fetch all videos         |
| `/videos/:id`         | GET    | ❌              | Fetch a single video     |
| `/videos`             | POST   | ✅              | Upload a new video       |
| `/videos/:id`         | PATCH  | ✅              | Update video details     |
| `/videos/:id`         | DELETE | ✅              | Delete a video           |
| `/videos/:id/like`    | POST   | ✅              | Like a video (toggle)    |
| `/videos/:id/dislike` | POST   | ✅              | Dislike a video (toggle) |

- Comments

| Endpoint                                  | Method | Authentication | Description                |
| ----------------------------------------- | ------ | -------------- | -------------------------- |
| `/videos/:id/comments`                    | GET    | ❌              | Fetch comments for a video |
| `/videos/:id/comments`                    | POST   | ✅              | Add a new comment          |
| `/videos/:id/comments/:commentId`         | PATCH  | ✅              | Edit a comment             |
| `/videos/:id/comments/:commentId`         | DELETE | ✅              | Delete a comment           |
| `/videos/:id/comments/:commentId/like`    | POST   | ✅              | Like a comment (toggle)    |
| `/videos/:id/comments/:commentId/dislike` | POST   | ✅              | Dislike a comment (toggle) |

## Usage

- Use thunderClient to test the API endpoints.

- Include the Authorization header for protected routes:

- Authorization: JWT <your_token_here>


- Uploaded channel banners are stored as Base64 strings.

- User avatars are automatically generated using ui-avatars.com .

# Project Github Link
Github Link: [Project](https://github.com/R-Srijanki/Final-Backend.git)

## Author
**Rathod Srijanki**  
GitHub: [R-Srijanki](https://github.com/R-Srijanki)