# SocialSphere - Mini Social Media Platform

Stack: HTML, CSS, JavaScript, Node.js, Express.js, MySQL, JWT and bcrypt.

Features:
- User registration/login
- User profiles and profile editing
- Posts with optional image URL
- Comments
- Like/unlike
- Follow/unfollow
- People discovery
- Follower/following counts

Setup:
1. Run `npm install`
2. Execute `database/schema.sql` in MySQL Workbench
3. Copy `.env.example` to `.env`
4. Put your MySQL password in `.env`
5. Run `npm start`
6. Open http://localhost:3001

API:
POST /api/auth/register
POST /api/auth/login
GET /api/posts/feed
POST /api/posts
POST /api/posts/:id/like
POST /api/posts/:id/comments
GET /api/users
GET /api/users/:id
POST /api/users/:id/follow
PUT /api/users/profile/me
