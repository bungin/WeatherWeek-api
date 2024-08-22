import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.static('../client/dist'));    //static
app.use(express.urlencoded(({extended: true})));  //needed?
app.use(express.json()); //json
app.use(routes); //middlware routes

// DOne: Serve static files of entire client dist folder
// DOne: Implement middleware for parsing JSON and urlencoded form data
// DOne: Implement middleware to connect the routes

app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
