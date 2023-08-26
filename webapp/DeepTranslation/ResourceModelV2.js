sap.ui.define([
    "sap/ui/model/resource/ResourceModel"
], function (ResourceModel) {
    "use strict";

    /**
     * Although the blog post provided a different solution, in future implementation
     * we will use this resource-model takevoer technique because in corner cases it
     * provides a better response. (eg.: when the locale changes on the fly.)
     */
    var DeepResourceModel = ResourceModel.extend("com.sample.DeepTranslation.ResourceModelV2", {
        
        constructor: function (oData) {
            ResourceModel.apply(this, arguments);
        },

        getProperty: function( sPath ) {
            //
            // explanation: in special cases the underlying resource bundel will be re-created by
            // the framework. As we need the getText method to be taken over, this place seems a
            // not-so-painful way to ensure we always have the hook ready.
            //
			this.injectGetText();
			return ResourceModel.prototype.getProperty.call( this, sPath );
		},

		injectGetText: function() {
			let oRB = this.getResourceBundle();
			if ( oRB && !oRB.inheritedGetText ) {
				oRB.inheritedGetText = oRB.getText;
				oRB.getText = DeepResourceModel.getText.bind({ DeepResourceModel: this, bundle: oRB });
			}
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

    return DeepResourceModel;
});