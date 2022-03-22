// @ts-nocheck
/* eslint-disable no-undef */
/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
    "use strict";

    sap.ui.require([
        "SAPUI5/invoices/test/unit/AllTests"        
    ], function (AllTests) {
        QUnit.start();
    })
});