import passport from "passport";

import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) =>
  res.render("join", { pageTitle: "회원 가입" });
export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password1, password2 },
  } = req;

  if (password1 !== password2) {
    res.status(400);
    res.render("join", { pageTitle: "회원 가입" });
  } else {
    try {
      const user = await User({
        name,
        email,
      });
      console.log(`이름 : ${name}`);
      await User.register(user, password1);
      console.log(`넥스트`);
      next();
    } catch (error) {
      console.log(`에러 : ${error}`);
      res.redirect(routes.home);
    }
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "로그인" });
export const postLogin = passport.authenticate("local", {
  successRedirect: routes.search,
  failureRedirect: routes.join,
});
/*
export const postLogin = (req, res) => {
  try {
    console.log("이상1");
    passport.authenticate("local", {
      successRedirect: routes.home,
      failureRedirect: routes.login,
    });
    console.log("이상2");
  } catch (error) {
    console.log(error);
  }
};
*/

export const githubLogin = passport.authenticate("github");
export const githubLoginCallback = async (
  accessToken,
  refreshToken,
  profile,
  cb
) => {
  const {
    _json: { id, name, email, avatarUrl },
  } = profile;

  if (email === null) {
    console.log("깃허브에 이메일이 비공개이면, 가입을 할 수 없습니다.");
    return cb(null);
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    } else {
      const newUser = await User.create({
        name: name === null ? "비공개" : name,
        email,
        avatarUrl:
          avatarUrl === undefined
            ? "https://github.com/fluidicon.png"
            : avatarUrl,
        githubId: id,
      });
      return cb(null, newUser);
    }
  } catch (error) {
    return cb(error);
  }
};
export const postGithubLogin = (req, res) => {
  // 깃허브에서 사용자 정보를 제공받은 후, 실행함
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  // 이 곳에 로그아웃 기능을 추가해야 함

  req.logout();
  res.redirect(routes.home);
};

export const getEditProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "유저 편집" });
export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file,
  } = req;

  try {
    const avatarUrl = file ? file.path : req.user.avatarUrl;

    await User.findOneAndUpdate(req.user._id, {
      name,
      email,
      avatarUrl,
    });
    req.user.name = name;
    req.user.email = email;
    req.user.avatarUrl = avatarUrl;
    res.redirect(routes.me);
  } catch (error) {
    res.redirect(routes.editProfile);
  }
};
export const getChangePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "비밀번호 변경" });
export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword1, newPassword2 },
  } = req;

  console.log(oldPassword);
  console.log(newPassword1);
  console.log(newPassword2);

  try {
    if (newPassword1 !== newPassword2) {
      res.status(400);
      res.redirect(`${routes.users}${routes.changePassword}`);
      return;
    }
    const user = await User.findOne({ _id: req.user._id });
    await user.changePassword(oldPassword, newPassword1);
    res.redirect(routes.me);
  } catch (error) {
    res.status(400);
    res.redirect(`${routes.users}${routes.changePassword}`);
  }
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate("videos");
  res.render("userDetail", { pageTitle: "내 상세 정보", user });
};

export const userDetail = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
	const user = await User.findById(id).populate("videos");
	console.log(user);
    res.render("userDetail", { pageTitle: `유저 상세 정보 : ${id}`, user });
  } catch (error) {
    res.redirect(routes.home);
  }
};
