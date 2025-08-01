import express from 'express'
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from 'cors';
import rateLimiter from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

// Routes and DB
import connectDB from "./database/connect.js";
import notFoundMiddleWare from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js"
import authRoutes from './routes/authRoutes.js'
import agentRoutes from './routes/agentRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express();

// Cookie parser
app.use(cookieParser());


// CORS – configure before routes
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// Logger
app.use(morgan("dev"));

//  Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Rate limiter – should be as early as possible to protect all endpoints

const limiter = rateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 1000,
    message: 'Too many requests, please try again later',
});
app.use(limiter);


//  API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/agents', agentRoutes);
app.use('/api/v1/upload', taskRoutes);
app.use('/api/v1/users', userRoutes);

//  Not Found and Error Handlers
app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleware);

// Server init
const port = process.env.PORT || 5000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
