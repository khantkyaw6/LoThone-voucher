const HomeService = require("../services/home.service");

class HomeController {
	constructor() {
		this.homeService = new HomeService();
		this.getHome = this.getHome.bind(this);
	}

	getHome(req, res) {
		res.status(200).json(this.homeService.getHome());
	}
}

module.exports = new HomeController();
