GETFLIX API

Description
The GETFLIX API is the server-side component of a movie app which allows a user to sign-up,
create a username & password to login & create a list of their favourite movies.


Documentation
Please find Documentation in documentation.html in the public folder.


API Endpoints

https://getflix-29822f4978ec.herokuapp.com/movies
Return a list of all movies
URL: /movies
HTTP Method: GET
Request Body: None
Response Body Format: JSON object holding data about all the movies

https://getflix-29822f4978ec.herokuapp.com/movies/Blood%20Sisters
Return data of a single movie by title
URL: /movies/[title]
HTTP Method: GET
Request Body: None
Response Body Format: JSON object holding all data about a single movie

https://getflix-29822f4978ec.herokuapp.com/movies/genre/Thriller
Return data (description) about a genre by name
URL: /movies/[genre]/[name]
HTTP Method: GET
Request Body: None
Response Body Format: JSON object holding all data about a genre

https://getflix-29822f4978ec.herokuapp.com/movies/director/Ang Lee
Return data (bio, birth year, death year) about a director by name
URL: /movies/[director]/[name]
HTTP Method: GET
Request Body: None
Response Body Format: JSON object holding all data about a director

https://getflix-29822f4978ec.herokuapp.com/users
Register a new user
URL: /users/
HTTP Method: POST
Request Body Format: JSON object holding data about the new user being added.
Response Body Format: JSON object holding data about the new user being added with an ID.

https://getflix-29822f4978ec.herokuapp.com/users/TestGuy
Update user info by username
URL: /users/[username]/
HTTP Method: PUT
Request Body Format: JSON object holding the user’s data being updated.
Response Body Format: JSON object holding data about the user being updated.

https://getflix-29822f4978ec.herokuapp.com/users/TestGuy/movies/660694c781c6986f26d931d2
Update user favourite movie list
URL: /users/[username]/movies/[movieId]/
HTTP Method: PUT
Request Body: None
Response Body: A text message indicating the user’s favourite movies list has been updated

https://getflix-29822f4978ec.herokuapp.com/users/445394**********H65hg/660694c781c6986f26d931d2
Remove a movie from user’s favourite movie list
URL: /users/[id]/[movieId]/
HTTP Method: DELETE
Request Body: None
Response Body: A text message indicating the title has been removed from the user’s favourite movies list

https://getflix-29822f4978ec.herokuapp.com/users/testGuy
De-register a user
URL: /users/[username]/
HTTP Method: DELETE
Request Body: None
Response Body: A text message indicating the user’s email has been removed from GETFLIX


Dependencies:
bcrypt: Library for hashing passwords securely.
body-parser: Middleware for parsing incoming request bodies in Express.js.
cors: Package for enabling Cross-Origin Resource Sharing (CORS) in Express.js.
express: Web framework for Node.js, used for building APIs and web applications.
express-validator: Middleware for validating and sanitizing request data in Express.js.
jsonwebtoken: Package for generating and verifying JSON Web Tokens (JWT) for user authentication.
mongoose: MongoDB object modeling tool for Node.js, used for interacting with MongoDB databases.
morgan: HTTP request logger middleware for Express.js.
passport: Authentication middleware for Node.js, used for implementing user authentication strategies.
passport-jwt: Passport strategy for authenticating with JSON Web Tokens (JWT).
passport-local: Passport strategy for authenticating with a username and password.
uuid: Package for generating universally unique identifiers (UUIDs).

DevDependencies:
nodemon: Utility for automatically restarting the Node.js server when changes are made to files during development.
