sap.ui.define([
	'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/Core',
    'sap/m/MessagePopover',
    'sap/ui/core/Element',
    'sap/m/MessageItem'
    ],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.core.Core} Core
     * @param {typeof sap.m.MessagePopover } MessagePopover
     * @param {typeof sap.ui.core.Element } Element
     * @param {typeof sap.m.MessageItem} MessageItem
	 */
	function (Controller, JSONModel, Core, MessagePopover, Element, MessageItem) {
		"use strict";

		return Controller.extend("logaligroup.front.controller.View1", {
			onInit: function () {

                const oModel = new JSONModel();
                //Se levanta el modelo local desde la ruta
                oModel.loadData("./localService/mockdata/CustomerModel.json");

                //Se instancia el objeto con la vista
                this.oView = this.getView();

                this._MessageManager = Core.getMessageManager();

                //Clear old messages
                this._MessageManager.removeAllMessages();

                //El modelo principal con la data no tiene un nombre de referencia, queda como default
                this.oView.setModel(oModel);

                this._MessageManager.registerObject(this.oView.byId("formCointainerPersonal"), true);
                //Se asigna el modelo del message manager a la vista, que tendra la info de los mensajes, iconos, text, etc.
                //Se indica un nombre message para identificar el modelo
                this.oView.setModel(this._MessageManager.getMessageManger, "message");

                this.createMessagePopover();
			},
            createMessagePopover: function(){

                // Para mantener el contexto de this 
                let that = this;

                this.oMP = new MessagePopover({
                    activeTitlePress: function(oEvent){
                        let oItem = oEvent.getParameter("item")
                        let oPage = that.getView().byId("employeePage")
                        let oMessage = oItem.getBindingContext("message").getObject()
                        let oControl = Element.registry.get(oMessage.getControlId())

                        if(oControl){
                            oPage.scrollToElement(oControl.getDomRef(), 200,[0,-100])
                            setTimeout(function(){
                                oControl.focus()
                            }, 300)
                        }
                    },
                    items:{
                        path : "message>/",
                        template : new MessageItem({
                            title: "{message>message}",
                            subtitle : "{message>additionalText}",
                            groupName : {parts : [{ path : 'message>controlIds'}],
                                                    formatter : this.getGroupName},
                            activeTitle : {parts : [{ path : 'message>controlIds'}],
                                                      formatter : this.isPositionable},
                            type : "{message>type}",
                            description : "{message>message}"
                        })
                    },
                    groupItems: true
                })

                //Se agrega la dependencia del boton al popup
                this.getView().byId("messagePopover").addDependent(this.oMP)

            },
            // Capitulo 18 message popover gropup name / active tititle
            getGroupName : function(){},
            isPositionable : function(){}
		});
	}
);
