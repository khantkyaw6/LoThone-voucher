const serviceAsyncWrapper = (serviceFunction) => {
	return async (...param) => {
		try {
			return await serviceFunction(...param);
		} catch (error) {
			throw error;
		}
	};
};

module.exports = serviceAsyncWrapper;
