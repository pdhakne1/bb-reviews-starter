sap.ui.define([
	"sap/demo/bulletinboard/controller/BaseController",
	"sap/m/MessageToast"
], function (BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("sap.demo.bulletinboard.controller.Reviews", {

		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("main").attachPatternMatched(this._onRevieweeMatched, this);
		},

		_onRevieweeMatched: function (oEvent) {
			this.reviewee_email = oEvent.getParameter("arguments").reviewee_email;

			var oNewModel = new sap.ui.model.json.JSONModel();
			oNewModel.attachRequestCompleted(function () {
				this.getView().setModel(oNewModel);
				this.getView().byId("reviewList").setHeaderText("Reviews for " + this.reviewee_email);
			}, this);
			oNewModel.attachRequestFailed(function () {
				MessageToast.show("Failed to load reviews.");
			});
			oNewModel.loadData(this.getMainServiceURL() + '/reviews/' + this.reviewee_email);
		},

		onCreateReview: function () {
			this.getRouter().navTo("createReview", {'reviewee_email': this.reviewee_email});
		}
	})
});
