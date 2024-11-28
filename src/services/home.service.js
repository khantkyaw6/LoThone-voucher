class HomeService {
	getHome() {
		return {
			success: true,
			statusCode: 200,
			message: "Welcome from todo application api",
		};
	}
}
module.exports = HomeService;
