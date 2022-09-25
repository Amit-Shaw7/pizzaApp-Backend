import express, { urlencoded } from 'express';
import dotenv from "dotenv";
import UserRouter from './routes/UserRouter.js';
import AuthRouter from './routes/AuthRouter.js';
import { connectPasspport } from './utils/Provider.js';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { createError } from './middlewares/error.js';
import OrderRouter from './routes/OrderRouter.js';
import cors from 'cors';

const app = express();



dotenv.config({
    path: "./config/config.env"
});

// Using Middlewares ------------------------------------
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
        secure: process.env.NODE_ENV === "development" ? false : true,
        httpOnly: process.env.NODE_ENV === "development" ? false : true,
        sameSite: process.env.NODE_ENV === "development" ? false : "none"
    }
}));

app.use(express.json());
app.use(urlencoded({
    extended: true
}));

app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"]
}))

app.use(cookieParser());

app.use(passport.authenticate("session"));
app.use(passport.initialize());


connectPasspport();
app.use("/api/users", UserRouter);
app.use("/api/auths", AuthRouter);
app.use("/api/orders", OrderRouter);


// Error Middleware
app.use(createError);

export default app;
