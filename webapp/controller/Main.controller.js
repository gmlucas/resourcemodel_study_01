sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        // sample application for the blog-post at:
        // https://blogs.sap.com/2023/08/23/enhance-i18n-resource-models-with-recursive-key-references-within-translated-texts-part-1/

        return Controller.extend("com.sample.resourcemodelstudy.controller.Main", {
            onInit: function () {
            },

            onAfterRendering: function() {
                let foxControl = this.getView().byId("computedfox");
                let oRB = this.getView().getModel("i19n").getResourceBundle();
                let sText = oRB.getText("parametricfox",[77]);
                foxControl.setText( sText );
            }
    
        });
    });
