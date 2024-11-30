const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const errorHandler = require("./src/middlewares/errorHandler");

const app = express();

const corsOptions = {
	origin: "*",
};

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
	console.log("in development");
}

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.send("API is running...");
});

app.use(errorHandler);

module.exports = app;
