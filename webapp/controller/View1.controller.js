sap.ui.define([
	'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel'
    ],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
	 */
	function (Controller, JSONModel) {
		"use strict";

		return Controller.extend("logaligroup.front.controller.View1", {
			onInit: function () {

                const oModel = new JSONModel();
                oModel.loadData("./localSevice/mockdata/CustomerModel.json");

                this.oView = this.getView();
                this.oView.setModel(oModel);


			}
		});
	}
);
