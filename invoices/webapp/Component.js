sap.ui.define([
    "sap/ui/core/UIComponent",
    "SAPUI5/invoices/model/Models",
    "sap/ui/model/resource/ResourceModel",
    "./controller/HelloDialog"
],
    /**
         * 
         * @param {typeof sap.ui.core.UIComponent} UIComponent    
         * @param {typeof sap.ui.model.resource.ResourceModel} ResourceModel         
         */
    function (UIComponent, Models, ResourceModel, HelloDialog) {
        "use strict";

        return UIComponent.extend("SAPUI5.invoices.Component", {
            
            metadata: {
                manifest: "json"               
             },

            init: function () {

                UIComponent.prototype.init.apply(this, arguments);

                //Set data model on the view
                this.setModel(Models.createRecipient());

                //set i18n on the view
                var i18nModel = new ResourceModel({ bundleName: "SAPUI5.invoices.i18n.i18n" });
                this.setModel(i18nModel, "i18n");

                this._helloDialog = new HelloDialog(this.getRootControl());
            },

            exit: function () {
                this._helloDialog.destroy();
                delete this._helloDialog;
            },
            
            openHelloDialog: function () {
                this._helloDialog.open();
            }
        });
    }
);