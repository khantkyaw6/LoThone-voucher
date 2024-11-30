const { CustomApiError } = require("../utilities/errors");

const errorHandler = (error, req, res, next) => {
	console.error(error);

	// Handle Custom API Errors
	if (error instanceof CustomApiError) {
		return res.status(error.statusCode).json({
			success: false,
			statusCode: error.statusCode,
			message: error.message,
		});
	}

	// Handle MySQL-specific errors from mysql2 package
	if (error.code && error.sqlMessage) {
		if (error.code === "ER_DUP_ENTRY") {
			return res.status(409).json({
				success: false,
				statusCode: 409,
				message: "The data already exists.",
			});
		}
	}

	// Handle MongoDB-specific errors
	if (error.name === "MongoError" || error.name === "MongoServerError") {
		// MongoDB Duplicate Key Error
		if (error.code === 11000) {
			return res.status(409).json({
				success: false,
				statusCode: 409,
				message: "Duplicate key error: The data already exists.",
				keyValue: error.keyValue, // Includes conflicting fields
			});
		}
	}

	// Handle Mongoose Validation Errors
	if (error.name === "ValidationError") {
		return res.status(400).json({
			success: false,
			statusCode: 400,
			message: "Validation failed.",
			errors: Object.keys(error.errors).map((key) => ({
				field: key,
				message: error.errors[key].message,
			})),
		});
	}

	// Fallback for Unhandled Errors
	return res.status(500).json({
		success: false,
		statusCode: 500,
		message: "Internal Server Error",
	});
};

module.exports = errorHandler;
