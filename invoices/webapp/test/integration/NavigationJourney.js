//@ts-nocheck
sap.ui.define([
    "SAPUI5/invoices/localService/mockserver",
    "sap/ui/test/opaQunit",
    "./pages/HelloPanel"
],
    /** 
     * @param {typeof sap.ui.test.opaQunit} opaQunit
     */
    function (mockserver, opaQunit) {
        'use strict';

        QUnit.module("Navigation");

        opaQunit("Should open the Hello Dialog", function(Given, When, Then){

            //Initialize the mock server
            mockserver.init();
                
            //Arrangements
            Given.iStartMyUIComponent({
                componentConfig: {
                    name: "SAPUI5.invoices"
                }
            });

            //Actions            
            When.onTheAppPage.iSayHelloDialogButton();

            //Assertions            
            Then.onTheAppPage.iSeeTheHelloDialog();

            //Cleanup
            Then.iTeardownMyApp();

        });
    });