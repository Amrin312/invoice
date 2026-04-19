import express from 'express';
import cors from  'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express'
import { connectDB } from './config/db.js';


const app = express();
const port = 4000;

app.use(cors());
app.use(clerkMiddleware());
app.use(express.json({limit: "20mb"}));
app.use(express.urlencoded({limit: "20mb", extended: true}));

//db
connectDB();

app.get('/', (req, res) => {
    res.send('API working');
});

app.listen(port, () =>{
    console.log('Server started!');
    
})