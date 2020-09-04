# API Endpoints for Coificacion:
An application to teach the user programming terms in Spanish using spaced repetition.

## API url 
__https://radiant-tundra-91363.herokuapp.com/__ 

## Users Endpoints
`POST /api/users` Creates an account

### Auth Endpoints
`POST /api/auth/token` Retrieves a JWT token

### Language Endpoints
`GET /api/language Gets` all words for specific language

`GET /api/language/head` Gets the current word in the users list

`POST /api/language/guess` Submits a users guess

### User Endpoints
`POST /api/user` Follows an idea

## Technology
- Express.js
- Node.js
- Heroku

### Database
- PostgreSQL
- postgrator
- knex

### Testing
- supertest
- Mocha
- Chai

### Misc
- bcryptjs

## Authors
- Gage Migan
- Nick Thorpe 