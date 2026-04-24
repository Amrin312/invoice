import express from 'express';
import cors from  'cors';
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

import { connectDB } from './config/db.js';


const app = express();
const port = 4000;

//middlewares
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", 'DELETE'],
    allowedHeaders: ["content-Type", "Authorization"],

}));

app.use(express.json());

app.use(express.urlencoded({limit: "20mb", extended: true}));

//db
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/ai", aiRoutes);


app.get('/', (req, res) => {
    res.send('API working');
});

app.listen(port, () =>{
    console.log('Server started!');
    
});