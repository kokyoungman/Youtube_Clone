import axios from "axios";

const api = axios.create({
  baseURL: "https://yts.mx/api/v2/",
});

let movies = [];

const initDb = async () => {
  console.log("DB 준비 시작");
  try {
    ({
      data: {
        data: { movies },
      },
    } = await api.get("/list_movies.json", { params: { limit: 50 } }));
    console.log("DB 준비 완료");
  } catch (e) {
    console.log("에러");
  }
};

initDb();

// 영화 정보들을 가져옴
export const getMovies = () => movies;

// 해당 아이디의 영화 정보를 가져옴
export const getMovieById = (id) => {
  if (id === false) throw Error("ID 정보가 없습니다.");

  return movies.find((m) => m.id === parseInt(id, 10));
};

// 해당 년도보다 높은 영화 정보를 가져옴
export const getMovieByMinYear = (year) => {
  if (year === false) throw Error("년도 정보가 없습니다.");

  return movies.filter((m) => m.year >= year);
};

// 해당 평점보다 높은 영화 정보를 가져옴
export const getMovieByMinRating = (rating) => {
  if (rating === false) throw Error("평점 정보가 없습니다.");

  return movies.filter((m) => m.rating >= rating);
};

// 영화 정보를 추가합니다. (사이트에 추가하는 것이 아니라, 변수에 추가하는 것뿐임)
export const addMovie = ({ title, synopsis, genres }) => {
  if (typeof title !== "string" || typeof synopsis !== "string")
    throw Error("제목과 시놉시스는 문자열이어야 합니다.");

  if (genres instanceof Array === false)
    throw Error("장르는 배열이어야 합니다.");

  const id = Math.floor(Math.random() * (title.length + Date.now()));
  movies = [{ id, title, synopsis, genres }, ...movies];
};
