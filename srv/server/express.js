'use strict';

const bodyParser = require('body-parser')
const express = require('express')

module.exports = function (app) {
	const hanaReviewsService = require('./hana-reviews-service')
	app.reviewsService = new hanaReviewsService()

	const xsenv = require("@sap/xsenv");
	xsenv.loadEnv();
	const HDBConn = require("@sap/hdbext");
	var hanaOptions = xsenv.getServices({
		hana: {
			tag: "hana"
		}
	});
	hanaOptions.hana.pooling = true;
	app.use(bodyParser.json())

	app.use(express.static('../app/webapp'));
	app.use(
		HDBConn.middleware(hanaOptions.hana)
	);
};