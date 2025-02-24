import express from 'express';
import { PORT } from './config';

const app = express();

app.get('/' , (req , res) => {
    res.send("InfinoStore API is UP!!");
})

app.listen(PORT);