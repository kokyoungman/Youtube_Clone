/*
export const videos = [
  {
    id: 100,
    title: "인터넷 영상",
    description: "인터넷 영상 설명",
    views: 123,
    fileUrl: "uploads/videos/1c8e11a37bc2dd58401d822c2d06f73b",
    creator: {
      id: 10,
      name: "업로더 이름1",
      email: "a@gmail.com",
    },
  },
  {
    id: 101,
    title: "폴더 영상",
    description: "폴더 영상 설명",
    views: 123,
    fileUrl:
      "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
    creator: {
      id: 11,
      name: "업로더 이름2",
      email: "a@gmail.com",
    },
  },
];
*/
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

// 몽고DB에 연결함
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// 몽고DB와의 연결을 변수로 저장함
const db = mongoose.connection;

const handleOpen = () => console.log("DB가 연결되었습니다.");
const handleError = (error) =>
  console.log(`DB 연결중에 에러가 발생했습니다. : ${error}`);

db.once("open", handleOpen); // once()로 "open"을 한번만 실행하고, handleOpen()를 실행함
db.on("error", handleError); // 에러가 발생한다면, handleError()을 실행함
