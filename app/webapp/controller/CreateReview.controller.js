sap.ui.define([
	"sap/demo/bulletinboard/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function(BaseController, JSONModel, MessageToast) {
	"use strict";

	return BaseController.extend("sap.demo.bulletinboard.controller.CreateReview", {

		onInit : function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("createReview").attachPatternMatched(this._onRevieweeMatched, this);

			this._oDetailsModel = new JSONModel({});
			this._initNewReviewModel();
			this.setModel(this._oDetailsModel, "reviewDetails");
		},
		
		onSampleFill : function () {
			this._oDetailsModel.setData({
			    reviewer_email: "john.doe@some.org",
			    rating: 4,
			    comment: "Good product"
			}, false);
		},
	
		onSave : function() {
			var reviewData = this._oDetailsModel.getData();
			reviewData.reviewee_email = this.reviewee_email;
			this._postReview(reviewData, this._onNewReviewCreated.bind(this));
		},

		_onRevieweeMatched: function (oEvent) {
			this.reviewee_email = oEvent.getParameter("arguments").reviewee_email;
			this.getView().byId("newReviewPage").setTitle("Create a new review for " + this.reviewee_email);
		},
		
		onNavBack : function() {
			this.getRouter().navTo("main", {'reviewee_email': this.reviewee_email}, true);
		},
		
		_postReview : function(oNewReview, fSuccess) {
			$.ajax({
				method : "POST",
				url: this.getMainServiceURL() + '/reviews',
				data : JSON.stringify(oNewReview),
				processData : false,
				contentType : "application/json"
			})
			.done(function(data, textStatus, oJqXHR) {fSuccess(oNewReview, textStatus, oJqXHR)})
			.fail( function(oJqXHR, sTextStatus, sErrorThrown) {
					MessageToast.show("Failed to create your new review.");
					jQuery.sap.log.error("Failed to create new review.", sErrorThrown);
	
			});
		},
		
		_initNewReviewModel : function () {
			this._oDetailsModel.setData({}, false);
		},

		_onNewReviewCreated : function(oNewReview, sTextStatus, oJqXHR) {
			MessageToast.show("Your new review has been created.");

			// Reset model for new reviews so that the data of the created instance
			// does not appear as initial data when creating another one.
			this._initNewReviewModel();
			
			// Go back to list of ads.
			this.getRouter().navTo("main", {'reviewee_email': oNewReview.reviewee_email});
		}
	})
});