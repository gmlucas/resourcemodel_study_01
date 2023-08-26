sap.ui.define([
    "sap/ui/model/resource/ResourceModel"
], function (ResourceModel) {
    "use strict";

    var DeepResourceModel = ResourceModel.extend("com.sample.DeepTranslation.ResourceModel", {
        constructor: function (oData) {
            oData.DeepResourceModel = this;
            ResourceModel.apply(this, arguments);
        }
    });

    const KEYREF = new RegExp(/\(\(\((.*?)\)\)\)/, 'g');

    DeepResourceModel.getText = function (sKey, aArgs, bIgnoreKeyFallback) {
        let sTemplate = this.bundle.inheritedGetText(sKey, aArgs, bIgnoreKeyFallback);
        let sTranslated = sTemplate;
        for (const captureGroup of sTemplate.matchAll(KEYREF)) {
            let sub = this.bundle.getText(captureGroup[1], [], bIgnoreKeyFallback)
            sTranslated = sTranslated.replace(captureGroup[0], sub);
        }
        return sTranslated
    };

    ResourceModel.inheritedLoadResourceBundle = ResourceModel.loadResourceBundle;

    ResourceModel.loadResourceBundle = async function (oData, bAsync) {
        let oRB = ResourceModel.inheritedLoadResourceBundle(oData, bAsync);
        if (bAsync) {
            oRB = await oRB;
        }
        if (oData.DeepResourceModel && oRB && !oRB.inheritedGetText) {
            oRB.inheritedGetText = oRB.getText;
            oRB.getText = DeepResourceModel
                .getText.bind({
                    DeepResourceModel: oData.DeepResourceModel,
                    bundle: oRB
                });
        }
        return oRB;
    }

    return DeepResourceModel;
});