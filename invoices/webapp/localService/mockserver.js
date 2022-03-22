//@ts-nocheck
sap.ui.define([
    "sap/ui/core/util/MockServer",    
    "sap/ui/model/json/JSONModel",
    "sap/base/util/UriParameters",
    "sap/base/Log"
],
    /**
     * @param{ typeof sap.ui.core.util.MocKServer} MocKServer
     * @param{ typeof sap.ui.model.json.JSONModel} JSONModel
     * @param{ typeof sap.base.util.UriParameters} UriParameters
     * @param{ typeof sap.base.Log } Log
     */

    function (MockServer, JSONModel, UriParameters, Log) {
        'use strict';

        var oMockServer,
            _sAppPath = "SAPUI5/invoices/",
            _sJsonFilesPath = _sAppPath + "localService/mockdata";

        var oMockServerInterface = {

            /** 
             * Initializes the mock server asynchronously
             * @protected
             * @param {object} oOptionsParameter
             * @returns{Promise} a promise that is resolved when mockserver has been started
            */
            init: function (oOptionsParameter) {

                var oOptions = oOptionsParameter || {};

                return new Promise(function (fnResolve, fnReject) {
                    var sManifestUrl = sap.ui.require.toUrl(_sAppPath + "manifest.json"),
                        oManifestModel = new JSONModel(sManifestUrl);

                    oManifestModel.attachRequestCompleted(function () {
                        var oUriParameters = new UriParameters(window.location.href);

                        //parse manifest  for local  metadata URI
                        var sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesPath);
                        var oMainDataSource = oManifestModel.getProperty("/sap.app/dataSources/mainService");
                        var sMetadataUrl = sap.ui.require.toUrl(_sAppPath + oMainDataSource.settings.localUri);

                        //ensure there is a trailing slash
                        var sMockServerUrl = oMainDataSource.uri && new URI(oMainDataSource.uri).absoluteTo(sap.ui.require.toUrl(_sAppPath)).toString();

                        //create a mock server instance  or stop the existing one to reinitialize
                        if (!oMockServer) {
                            oMockServer = new MockServer({
                                rootUri : sMockServerUrl
                            });
                        } else {
                            oMockServer.stop();
                        }

                        //configure mock server with the given option or a default delay of 0.5s
                        MockServer.config({
                            autoRespond: true,
                            autoRespondAfter: (oOptions.delay || oUriParameters.get("serverDelay") || 500)
                        });

                        //Simulate all requests using mock data 
                        oMockServer.simulate(sMetadataUrl, {
                            sMockdataBaseUrl : sJsonFilesUrl,
                            bGenerateMissingMockData: true
                        });

                        var aRequests = oMockServer.getRequests();

                        //Compose an erro response  for each request
                        var fnResponse = function (iErrCode, sMessage, aRequests) {
                            aRequests.response = function (oXhr) {
                                oXhr.respond(iErrCode, { "Content-Type" : "text/plain;charset=utf-8" }, sMessage);
                            };
                        };

                        //simulate metadata errors
                        if (oOptions.metadataError || oUriParameters.get("metadataError")) {
                            aRequests.forEach(function (aEntry) {
                                if (aEntry.path.toString().indexof("$metadata") > -1) {
                                    fnResponse(500, "metadata Error", aEntry);
                                }
                            });
                        };

                        //Simulate request errors
                        var sErrorParam = oOptions.errorType || oUriParameters.get("errorType");
                        var iErrorCode = sErrorParam === "badRequest" ? 400 : 500;

                        if (sErrorParam) {
                            aRequests.forEach(function (aEntry) {
                                fnResponse(iErrorCode, sErrorParame, aEntry);
                            });
                        };

                        //set Requests and start the server
                        oMockServer.setRequests(aRequests);
                        oMockServer.start();

                        Log.info("Running the app with mock data");
                        fnResolve();
                    });

                    oManifestModel.attachRequestFailed(function () {
                        var sError = "Failed to load the aplication manifest";

                        Log.error(sError);
                        fnReject(new Error(sError));
                    });
                });
            }
        };
        return oMockServerInterface;
    });