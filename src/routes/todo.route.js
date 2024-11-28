const route = require("express").Router();

const todoController = require("../controllers/todo.controller");

const {
	getPaginationValidator,
	getParamIdValidator
} = require("../common/middlewares/validators");
const {
	getAllTodoValidator,
	createTodoValidator
} = require("../middlewares/validators/todo");
const {
	updateTodoValidator
} = require("../middlewares/validators/todo/updateTodo.validator");

route
	.route("/")
	.get(getPaginationValidator, getAllTodoValidator, todoController.getAllTodo)
	.post(createTodoValidator, todoController.createTodo);

route
	.route("/:id")
	.all(getParamIdValidator)
	.get(todoController.getTodo)
	.patch(updateTodoValidator, todoController.updateTodo)
	.delete(todoController.deleteTodo);

module.exports = route;
