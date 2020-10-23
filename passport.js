import passport from "passport";
import GithubStrategy from "passport-github";

import routes from "./routes";
import User from "./models/User";

import dotenv from "dotenv";
dotenv.config();

import { githubLoginCallback } from "./controllers/userController";

console.log("패스포트 : user, serializeUser, deserializeUser");
passport.use(User.createStrategy());
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: `http://localhost:5000${routes.githubCallback}`,
    },
    githubLoginCallback
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
