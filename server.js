const app = require("./app");
const connectDB = require("./src/config/db.config");
const PORT = process.env.PORT || 3000;

connectDB()
	.then(
		app.listen(PORT, () => {
			console.log(`Server is listening on port: ${PORT}`);
		})
	)
	.catch((err) => console.log(err));
