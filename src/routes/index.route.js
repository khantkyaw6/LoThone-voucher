const homeController = require("../controllers/home.controller.js");

const userRoute = require("./user.route.js");
const todoRoute = require("./todo.route.js");

const route = require("express").Router();

route.get("/", homeController.getHome);

route.use("/users", userRoute);
route.use("/todos", todoRoute);

module.exports = route;
