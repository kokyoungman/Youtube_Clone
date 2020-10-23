import routes from "./routes";
import multer from "multer";

const multerAvatar = multer({ dest: "uploads/avatars/" });
export const uploadAvatar = multerAvatar.single("avatar");

const multerVideo = multer({ dest: "uploads/videos/" });
export const uploadVideo = multerVideo.single("videoFile");

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "타이틀1";
  res.locals.routes = routes;
  res.locals.loginUser = req.user || null;
  //console.log(`===> ${req.user}`);

  next();
};

export const onlyPublic = (req, res, next) => {
  // 로그인이 되지 않았을 때만, 접근을 허용함
  if (req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};

export const onlyPrivate = (req, res, next) => {
  // 로그인이 되었을 때만, 접근을 허용함
  if (req.user) {
    next();
  } else {
    res.redirect(routes.home);
  }
};
