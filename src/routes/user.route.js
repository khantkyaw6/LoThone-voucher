const route = require("express").Router();

const userController = require("../controllers/user.controller");

const {
	getPaginationValidator,
	getParamIdValidator,
} = require("../common/middlewares/validators");
const {
	getAllUserValidator,
	createUserValidator,
} = require("../middlewares/validators/user");
const {
	updateUserValidator,
} = require("../middlewares/validators/user/updateUser.validator");

route
	.route("/")
	.get(getPaginationValidator, getAllUserValidator, userController.getAllUser)
	.post(createUserValidator, userController.createUser);

route
	.route("/:id")
	.all(getParamIdValidator)
	.get(userController.getUser)
	.patch(updateUserValidator, userController.updateUser)
	.delete(userController.deleteUser);

module.exports = route;
