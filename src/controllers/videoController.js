import routes from "../routes";
import { videos } from "../db";
import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

import fs from "fs";

/*
export const home = (req, res) =>
  res.render("home", { pageTitle: "홈", videos });
*/
export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

export const search = async (req, res) => {
  const {
    query: { keyword: searchingBy },
  } = req;

  let videos = [];

  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" },
    }); // 찾기와 같은 기능을 하려면, 정규식을 사용해야 좋음
    // i (Insensitive) (둔감) (민감하지 않음) : 대소문자를 구분하지 않을 때 넣는 옵션
  } catch (error) {}
  res.render("search", { pageTitle: "써치", searchingBy, videos });
};

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "업로드" });
  
export const postUpload = async (req, res) => {
  const {
    body: { title, genres, description },
    file: { path },
  } = req;

  const newVideo = await Video.create({
    fileUrl: path,
    title,
    genres: genres.split(","),
    description,
    creator: req.user._id,
  });

  const user = await User.findOne({ _id: req.user._id });
  user.videos.push(newVideo.id);
  user.save();

  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
	const {
		params: { id }
	} = req;
	
	try {
		const video = await Video.findById(id).populate("creator").populate("comments");

		let comments = [];
		
		const setComments = async (videocomments) => {
			for(const videocomment of videocomments)
			{
				const comment = await Comment.findById(videocomment).populate("creator");
				comments.push(comment);
			}
		}

		await setComments(video.comments);

		res.render("videoDetail", { pageTitle: `${video.title}`, video, comments });
	} catch (error) {
		res.redirect(routes.home);
	}
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id).populate("creator");

    if (video.creator.id !== req.user._id) {
      throw Error();
    } else {
      res.render("editVideo", { pageTitle: `${video.title} 편집`, video });
    }
  } catch (error) {
    res.redirect(routes.home);
  }
};
export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};
export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
	const video = await Video.findById(id).populate("creator");

    if (video.creator.id !== req.user._id) {
      throw Error();
    } else {
		await Video.findOneAndRemove({ _id: id });

		const user = await User.findOne({ _id: video.creator.id });
		console.log(user.videos);
		user.videos = user.videos.filter((video) => {
			return String(video) !== String(id);
		})
		user.save();

		console.log(user.videos);
	  
    }
  } catch (error) {}
  res.redirect(routes.home);
};

export const postRegisterView = async (req, res) => {
	const {
		params: { id }
	} = req;

	try {
		const video = await Video.findById(id);
		video.views += 1;
		video.save();
		
		res.status(200);
	} catch (error) {
		res.status(400);
	} finally {
		res.end();
	}
};

export const postAddComment = async (req, res) => {
	const {
		params: { id },
		body: { comment },
		user
	} = req;

	try {
		const newComment = await Comment.create({ text: comment, creator: user._id });

		const video = await Video.findById(id);
		video.comments.push(newComment.id);
		video.save();

		const me = await User.findOne({ _id: user._id });
		me.comments.push(newComment.id);
		me.save();

		res.json({
			creatorName: user.name,
			comment,
			commentId: newComment.id
		})
		
	} catch (error) {
		res.status(400);
	} finally {
		res.end();
	}
};

export const postRemoveComment = async (req, res) => {
	const {
		params: { id },
		body: { commentId }
	} = req;

	try {
		const comment = await Comment.findById(commentId).populate("creator");
		
		if (comment.creator.id !== req.user._id) {
			throw Error();
		} else {
			await Comment.findOneAndRemove({ _id: commentId });

			const video = await Video.findById(id);
			video.comments = video.comments.filter((comment) => {
				return String(comment) !== String(commentId);
			});
			video.save();

			const user = await User.findOne({ _id: comment.creator.id });
			user.comments = user.comments.filter((comment) => {
				return String(comment) !== String(commentId);
			})
			user.save();
		}
	} catch (error) {
		res.status(400);
	} finally {
		res.end();
	}
};