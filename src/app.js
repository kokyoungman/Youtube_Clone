import express from "express";

import path from "path";

import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import session from "express-session";
import passport from "passport";
import "./passport";

import MongoStore from "connect-mongo";

import { localsMiddleware } from "./middlewares";

import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

import apiRouter from "./routers/apiRouter";

import routes from "./routes";

import mongoose from "mongoose";

const app = express();

const CokieStore = MongoStore(session);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CokieStore({ mongooseConnection: mongoose.connection }),
  })
);
console.log("패스포트 : initialize, session");
app.use(passport.initialize());
app.use(passport.session());

app.use(localsMiddleware);

app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

app.use(routes.api, apiRouter);

export default app;
