const UserService = require("../services/user.service");
const controllerAsyncWrapper = require("../utilities/controllerAsyncWrapper.util");
const {
	BadRequestError
} = require("../utilities/errors/badRequestError.util.error");

class UserController {
	constructor() {
		this.userService = new UserService();
		this.getAllUser = controllerAsyncWrapper(this.getAllUser.bind(this));
		this.createUser = controllerAsyncWrapper(this.createUser.bind(this));
		this.getUser = controllerAsyncWrapper(this.getUser.bind(this));
		this.updateUser = controllerAsyncWrapper(this.updateUser.bind(this));
		this.deleteUser = controllerAsyncWrapper(this.deleteUser.bind(this));
	}
	async getAllUser(req, res) {
		const [users, metaData] = await this.userService.getAllUser(
			req.query,
			req.pagination
		);
		return res.status(200).json({
			success: true,
			statusCode: 200,
			data: { users, metaData }
		});
	}

	async getUser(req, res) {
		const user = await this.userService.getUser(req.params.id);
		return res
			.status(200)
			.json({ success: true, statusCode: 200, data: { user } });
	}

	async createUser(req, res, next) {
		const user = await this.userService.createUser(req.body);
		return res.status(201).json({
			success: true,
			statusCode: 201,
			data: { user }
		});
	}

	async updateUser(req, res) {
		const result = await this.userService.updateUser(
			req.params.id,
			req.body
		);
		return res
			.status(200)
			.json({ success: true, statusCode: 200, message: result });
	}

	async deleteUser(req, res) {
		const message = await this.userService.deleteUser(req.params.id);
		return res.status(200).json({
			success: true,
			statusCode: 200,
			message
		});
	}
}

module.exports = new UserController();
