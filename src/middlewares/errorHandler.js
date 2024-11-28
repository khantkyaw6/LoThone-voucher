const { CustomApiError } = require("../utilities/errors");

const errorHandler = (error, req, res, next) => {
	console.error(error);
	if (error instanceof CustomApiError) {
		// console.log(error.statusCode, error.message, error.cause, error.name, error.stack);
		return res.status(error.statusCode).json({
			success: false,
			statusCode: error.statusCode,
			message: error.message,
		});
		// Handle MySQL-specific errors from mysql2 package
	} else if (error.code && error.sqlMessage) {
		// Handle duplicate entry error specifically
		if (error.code === "ER_DUP_ENTRY") {
			return res.status(409).json({
				success: false,
				statusCode: 409,
				message: "The data already exists.",
			});
		}
	}

	// Fallback for unhandled errors
	return res.status(500).json({
		success: false,
		statusCode: 500,
		message: "Internal Server Error",
	});
};

module.exports = errorHandler;
