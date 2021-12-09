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
          
            getGroupName : function(sControlId){
                //Se toma el control de un elemento en el DOM
                let oControl = Element.registry.get(sControlId);

                if(oControl){
                    let sFormSubtitle = oControl.getParent().getParent().getTitle().getText(); //Para el texto del label usar getText()
                    let sFormTitle = oControl.getParent().getParent().getParent().getTitle();

                    return sFormTitle + ", " + sFormSubtitle;
                }
            },

            isPositionable : function(sControlId){
                return sControlId ? true : false
            },

            //Capitulo 20 
            mpIconFormatter: function(){
                let sIcon
                let aMessage = this._MessageManager.getMessageModel().loadData
                
                aMessage.forEach(function(sMessage){
                    switch (sMessage.type){
                        case "Error":
                            sIcon = "sap-icon://message-error"
                            break;
                        case "Warning":
                            sIcon = sIcon !== "sap-icon://message-error" ? "sap-icon://message-warning" : sIcon
                            break;
                        
                        case "Success":
                            sIcon = sIcon !== "sap-icon://message-error" && sIcon !== "sap-icon://message-warning" ? "sap-icon://message-succcess" : sIcon
                            break;
                        
                        default:
                            sIcon = !sIcon ? "sap-icon://message-information" : sIcon
                            break;
                    }

                })

            }

		});
	}
);
