import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;
app.options('*', cors());
// const corsOptions = {
//     origin: 'http://localhost:3000',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }
//   app.get('/api/weather', cors(corsOptions), function (_req, res) {
//     res.json({msg: 'This is CORS-enabled for only example.com.'})
//   })

app.use(express.static('../client/dist'));    //static
// app.use(express.urlencoded(({extended: true})));  //needed?
app.use(express.json()); //middleware json
app.use(routes); //middlware routes

// DOne: Serve static files of entire client dist folder
// DOne: Implement middleware for parsing JSON and urlencoded form data
// DOne: Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
