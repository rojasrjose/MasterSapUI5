sap.ui.define([
    "sap/ui/core/UIComponent",
    "SAPUI5/invoices/model/Models",
    "sap/ui/model/resource/ResourceModel",
    "./controller/HelloDialog",
    "sap/ui/Device"
],
    /**
         * 
         * @param {typeof sap.ui.core.UIComponent} UIComponent    
         * @param {typeof sap.ui.model.resource.ResourceModel} ResourceModel   
         * @param {typeof sap.ui.Device} Device         
         */
    function (UIComponent, Models, ResourceModel, HelloDialog, Device) {
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
                //var i18nModel = new ResourceModel({ bundleName: "SAPUI5.invoices.i18n.i18n" });
                //this.setModel(i18nModel, "i18n");

                //set the device model
                this.setModel(Models.createDeviceModel(), "device");

                this._helloDialog = new HelloDialog(this.getRootControl());

                //create the view based on the url/hast
                this.getRouter().initialize();
            },

            exit: function () {
                this._helloDialog.destroy();
                delete this._helloDialog;
            },
            
            openHelloDialog: function () {
                this._helloDialog.open();
            },

            getContentDensityClass: function () {
                if (!Device.support.touch){
                    this._sContentDensityClass = "sapUiSizeCompact";
                }else{
                    this._sContentDensityClass = "sapUiSizeCozy";
                }
                return this._sContentDensityClass;
            }
        });
    }
);