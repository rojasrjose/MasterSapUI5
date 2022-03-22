// @ts-nocheck
/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
    "use strict";

    sap.ui.require([
        "SAPUI5/invoices/test/integration/NavigationJourney"
    ], function () {
        QUnit.start();
    });
});