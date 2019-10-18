'use strict';

module.exports = function (app) {
	const rateLimit = require("express-rate-limit");
		
	const maxRequestLimiter = rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minutes
        max: 1000 // limit each IP to 1000 requests per windowMs
	});
	//  apply to all sleep requests
	app.use("/api/", maxRequestLimiter);
};