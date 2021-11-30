# BRANDO

A Movie searching web application build with REACT and TMDB API

### TMDB API

https://www.themoviedb.org/

### NOTE

For .env file: add
REACT_APP_SECRET_KEY = secret key

_Save in root file where package.json is present_

To Use .env in App.js

```javascript
process.env.REACT_APP_SECRET_KEY;
```

Server runs on port 5000
goto: http://localhost:5000/movies to view the database

### Server with Node Js

To run real REST API Server

Nodemon should be installed for development

```sh
$ npm run server
```

Runs in port 8080

In package.json file add proxy, to remove cors error:

```json
"proxy": "http://localhost:8080"
```

> P.S I know the file structure is messed by the server folder should be outside and the REACT files should be in client.... Also axios could have been used instead of classic fetch

## To Do

Css fixes in:

- [] Sidebar
- [] Profile Screen
- [] Other user's Screen
- [] Other user's fav list
- [x] Fav List Screen
