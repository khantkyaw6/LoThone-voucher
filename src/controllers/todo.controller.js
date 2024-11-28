const TodoService = require("../services/todo.service");
const controllerAsyncWrapper = require("../utilities/controllerAsyncWrapper.util");

class TodoController {
	constructor() {
		this.todoService = new TodoService();
		this.getAllTodo = controllerAsyncWrapper(this.getAllTodo.bind(this));
		this.createTodo = controllerAsyncWrapper(this.createTodo.bind(this));
		this.getTodo = controllerAsyncWrapper(this.getTodo.bind(this));
		this.updateTodo = controllerAsyncWrapper(this.updateTodo.bind(this));
		this.deleteTodo = controllerAsyncWrapper(this.deleteTodo.bind(this));
	}
	async getAllTodo(req, res) {
		const [todos, metaData] = await this.todoService.getAllTodo(
			req.query,
			req.pagination
		);
		return res.status(200).json({
			success: true,
			statusCode: 200,
			data: { todos, metaData }
		});
	}

	async getTodo(req, res) {
		const todo = await this.todoService.getTodo(req.params.id);
		return res
			.status(200)
			.json({ success: true, statusCode: 200, data: { todo } });
	}

	async createTodo(req, res, next) {
		const todo = await this.todoService.createTodo(req.body);
		return res.status(201).json({
			success: true,
			statusCode: 201,
			data: { todo }
		});
	}

	async updateTodo(req, res) {
		const result = await this.todoService.updateTodo(
			req.params.id,
			req.body
		);
		return res
			.status(200)
			.json({ success: true, statusCode: 200, message: result });
	}

	async deleteTodo(req, res) {
		const message = await this.todoService.deleteTodo(req.params.id);
		return res.status(200).json({
			success: true,
			statusCode: 200,
			message
		});
	}
}

module.exports = new TodoController();
