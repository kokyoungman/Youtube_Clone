import express from "express";
import passport from "passport";

import routes from "../routes";

import { onlyPublic, onlyPrivate } from "../middlewares";

import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  logout,
  getMe,
  githubLogin,
  postGithubLogin,
} from "../controllers/userController";
import { home, search } from "../controllers/videoController";

const globalRouter = express.Router();

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);
globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);
globalRouter.get(routes.logout, onlyPrivate, logout);

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);

globalRouter.get(routes.me, getMe);

globalRouter.get(routes.github, githubLogin);
globalRouter.get(
  routes.githubCallback,
  passport.authenticate("github", {
    failureRedirect: routes.login,
  }),
  postGithubLogin
);

export default globalRouter;
