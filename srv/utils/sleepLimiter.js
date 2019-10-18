'use strict';

module.exports = function (app) {
	const rateLimit = require("express-rate-limit");
		
	const sleepLimiter = rateLimit({
		windowMs: 1 * 60 * 1000, // 1 minutes
		max: 2 // limit each IP to 2 requests per windowMs
	});
	//  apply to all sleep requests
	app.use("/api/v1/sleep", sleepLimiter);
};