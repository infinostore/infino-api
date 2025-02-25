import express from 'express';
import { MONGO_URL, PORT } from './config';
import { UserRouter } from './routes/UserRoutes';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());

app.use("/api/v1/auth/user" , UserRouter)

app.get('/' , (req , res) => {
    res.send("InfinoStore API is UP!!");
})

async function main() {
    mongoose.connect(MONGO_URL, {
    }).then(() => {
        console.log('Connection Successfully Established to the ECommerce Database!!');
        app.listen(PORT, () => {
            console.log(`Infino's Backend Hosted on: http://localhost:${PORT}`)
        });
    }).catch((err) => {
        console.error(err);
    });
}
main();