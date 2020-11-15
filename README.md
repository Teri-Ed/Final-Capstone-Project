# Capstone-Project
Node.js Express Question and Answer Website

#download latest version of node and install node (I'm using version 12.19.0)
#after installing use "node --version" to confirm version
#within VSC install the "Rest Client" extension
npm init
npm install express
npm install nodemon
npm install uuid
npm install body-parser
npm install ejs
#create index.js
#google "express resources middleware"


GET  /users         finds all users
POST /users         creates a user
GET  /users/:id     finds user details
DELETE /users/:id   deletes a user
PATCH /users/:id    updates portion of a user
PUT /users/:id      updates a user