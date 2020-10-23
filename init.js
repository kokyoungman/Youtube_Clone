import dotenv from "dotenv";
dotenv.config();
import app from "./app";

import "./db";
import "./models/User";
import "./models/Video";
import "./models/Comment";

const PORT = process.env.PORT || 7000;

const handleListening = () => console.log(`URL : http://localhost:${PORT}`);

app.listen(PORT, handleListening);
