const mongoose = require("mongoose");

const url = process.env.MONGODB_URL;

const connectDB = async () => {
	try {
		await mongoose.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true, // Important to avoid connection issues
			serverSelectionTimeoutMS: 5000, // Adjust timeout for better error handling
		});

		console.log("Connected to MongoDB Atlas with Mongoose!");
	} catch (error) {
		console.error(
			"Error connecting to MongoDB Atlas with Mongoose:",
			error
		);
	}
};

module.exports = connectDB;
