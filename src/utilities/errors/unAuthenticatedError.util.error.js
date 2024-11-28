const CustomApiError = require("./CustomApiError.util.error");

class UnAuthenticatedError extends CustomApiError {
	constructor(message, cause = "Unauthenticated error") {
		super(message, cause);
		this.statusCode = 401;
		this.name = this.constructor.name;
	}
}

module.exports = { UnAuthenticatedError };
