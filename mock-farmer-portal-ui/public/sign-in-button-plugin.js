/******************************************************************************
Mon Aug 07 2023 06:19:21 GMT+0000 (Coordinated Universal Time)
sign-in-with-esignet v0.9.0
A vanilla javascript component for rendering “Sign in with..” button on mosip client’s web page for oidc integration.
Copyright 2023
MPL-2.0 license 
******************************************************************************/
var SignInWithEsignetButton = (function (exports) {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    var img = "data:image/png;base64,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";

    var validResponseTypes = ["code"];
    var validDisplays = ["page", "popup", "touch", "wap"];
    var validPrompt = ["none", "login", "consent", "select_account"];
    var defaultThemes = {
        outline: "outline",
        filledOrange: "filled_orange",
        filledBlack: "filled_black",
        custom: "custom",
    };
    var defaultShapes = {
        sharpEdges: "sharp_edges",
        softEdges: "soft_edges",
        roundedEdges: "rounded_edges",
    };
    var buttonTypes = {
        standard: "standard",
        icon: "icon",
    };
    var defaultButtonLabel = "Sign in with e-Signet";

    function styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var css_248z = "/* Theme specific css */\n.SignInWithEsignet-module_standardOutline__la5Rh {\n  border: 2px solid #d8d8d8;\n  background: #ffffff 0% 0% no-repeat padding-box;\n  color: black;\n  font: normal normal 600 14px/17px arial;\n}\n\n.SignInWithEsignet-module_filledOrange__0uQsC {\n  border: 2px solid #eb6f2d;\n  background: #eb6f2d 0% 0% no-repeat padding-box;\n  color: white;\n  font: normal normal 600 14px/17px arial;\n}\n\n.SignInWithEsignet-module_filledBlack__fo-0k {\n  border: 2px solid #333333;\n  background: #333333 0% 0% no-repeat padding-box;\n  color: white;\n  font: normal normal 600 14px/17px arial;\n}\n\n/* Common css */\n.SignInWithEsignet-module_sharpRectBox__jYEvo {\n  width: 400px;\n  height: 48px;\n  display: flex;\n  align-items: center;\n  padding-left: 2px;\n  padding-right: 2px;\n}\n\n.SignInWithEsignet-module_softRectBox__hXT5v {\n  width: 400px;\n  height: 48px;\n  display: flex;\n  align-items: center;\n  border-radius: 8px;\n  padding-left: 2px;\n  padding-right: 2px;\n}\n\n.SignInWithEsignet-module_roundedRectBox__Gxr6n {\n  width: 400px;\n  height: 48px;\n  display: flex;\n  align-items: center;\n  border-radius: 46px;\n  padding-left: 3px;\n  padding-right: 3px;\n}\n\n.SignInWithEsignet-module_sharpRectIcon__ux3fm {\n  display: inline-block;\n}\n\n.SignInWithEsignet-module_softRectIcon__3TVEe {\n  display: inline-block;\n  border-radius: 8px;\n}\n\n.SignInWithEsignet-module_roundedRectIcon__dfq2Q {\n  display: inline-block;\n  border-radius: 46px;\n}\n\n.SignInWithEsignet-module_sharpLogoBox__DYo-n {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 44px;\n  height: 44px;\n  background: #ffffff 0% 0% no-repeat padding-box;\n}\n\n.SignInWithEsignet-module_softLogoBox__jj7aZ {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 44px;\n  height: 44px;\n  background: #ffffff 0% 0% no-repeat padding-box;\n  border-radius: 6px;\n}\n\n.SignInWithEsignet-module_roundedLogoBox__KiQM1 {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 38px;\n  height: 38px;\n  background: #ffffff 0% 0% no-repeat padding-box;\n  border-radius: 36px;\n}\n\n.SignInWithEsignet-module_sharpLogo__wyaBH {\n  width: 38px;\n  height: 38px;\n  object-fit: contain;\n}\n\n.SignInWithEsignet-module_softLogo__Gk5mu {\n  width: 38px;\n  height: 38px;\n  object-fit: contain;\n}\n\n.SignInWithEsignet-module_roundedLogo__cwx4t {\n  width: 28px;\n  height: 28px;\n  object-fit: contain;\n}\n\n.SignInWithEsignet-module_textbox__k2CkO {\n  text-align: left;\n  padding-left: 16px;\n  padding-right: 16px;\n  letter-spacing: 0px;\n}\n";
    var styles = {"standardOutline":"SignInWithEsignet-module_standardOutline__la5Rh","filledOrange":"SignInWithEsignet-module_filledOrange__0uQsC","filledBlack":"SignInWithEsignet-module_filledBlack__fo-0k","sharpRectBox":"SignInWithEsignet-module_sharpRectBox__jYEvo","softRectBox":"SignInWithEsignet-module_softRectBox__hXT5v","roundedRectBox":"SignInWithEsignet-module_roundedRectBox__Gxr6n","sharpRectIcon":"SignInWithEsignet-module_sharpRectIcon__ux3fm","softRectIcon":"SignInWithEsignet-module_softRectIcon__3TVEe","roundedRectIcon":"SignInWithEsignet-module_roundedRectIcon__dfq2Q","sharpLogoBox":"SignInWithEsignet-module_sharpLogoBox__DYo-n","softLogoBox":"SignInWithEsignet-module_softLogoBox__jj7aZ","roundedLogoBox":"SignInWithEsignet-module_roundedLogoBox__KiQM1","sharpLogo":"SignInWithEsignet-module_sharpLogo__wyaBH","softLogo":"SignInWithEsignet-module_softLogo__Gk5mu","roundedLogo":"SignInWithEsignet-module_roundedLogo__cwx4t","textbox":"SignInWithEsignet-module_textbox__k2CkO"};
    styleInject(css_248z);

    var defaultResponseType = "code";
    /**
     * Validates oidc configuration for required params and valid values
     * @param oidcConfig oidc configuration prop
     * @returns Error object with error code and error msg.
     */
    function validateInput(oidcConfig) {
        //Required parameters
        if (!oidcConfig ||
            !oidcConfig.authorizeUri ||
            !oidcConfig.redirect_uri ||
            !oidcConfig.client_id ||
            !oidcConfig.scope) {
            return "Required parameter is missing";
        }
        //if the param is not null and has and an invalid value return error msg.
        if (oidcConfig.response_type &&
            !validResponseTypes.includes(oidcConfig.response_type)) {
            return "Invalid Response Type";
        }
        if (oidcConfig.display && !validDisplays.includes(oidcConfig.display)) {
            return "Invalid display value";
        }
        if (oidcConfig.prompt && !validPrompt.includes(oidcConfig.prompt)) {
            return "Invalid prompt value";
        }
        return "";
    }
    /**
     * Builds redirect URL to navigate to id provider's portal.
     * @param oidcConfig
     * @returns URL
     */
    function buildRedirectURL(oidcConfig) {
        var urlToNavigate = oidcConfig === null || oidcConfig === void 0 ? void 0 : oidcConfig.authorizeUri;
        if (oidcConfig === null || oidcConfig === void 0 ? void 0 : oidcConfig.nonce)
            urlToNavigate += "?nonce=" + oidcConfig.nonce;
        //Generating random state if not provided
        if (oidcConfig === null || oidcConfig === void 0 ? void 0 : oidcConfig.state) {
            urlToNavigate += "&state=" + oidcConfig.state;
        }
        else {
            var randomNum = window.crypto.getRandomValues(new Uint32Array(1));
            var randomState = randomNum[0].toString(36).substring(5);
            urlToNavigate += "&state=" + randomState;
        }
        if (oidcConfig === null || oidcConfig === void 0 ? void 0 : oidcConfig.client_id)
            urlToNavigate += "&client_id=" + oidcConfig.client_id;
        if (oidcConfig === null || oidcConfig === void 0 ? void 0 : oidcConfig.redirect_uri)
            urlToNavigate += "&redirect_uri=" + oidcConfig.redirect_uri;
        if (oidcConfig === null || oidcConfig === void 0 ? void 0 : oidcConfig.scope)
            urlToNavigate += "&scope=" + oidcConfig.scope;
        if (oidcConfig === null || oidcConfig === void 0 ? void 0 : oidcConfig.response_type) {
            urlToNavigate += "&response_type=" + oidcConfig.response_type;
        }
        else {
            urlToNavigate += "&response_type=" + defaultResponseType;
        }
        if (oidcConfig === null || oidcConfig === void 0 ? void 0 : oidcConfig.acr_values)
            urlToNavigate += "&acr_values=" + (oidcConfig === null || oidcConfig === void 0 ? void 0 : oidcConfig.acr_values);
        if (oidcConfig === null || oidcConfig === void 0 ? void 0 : oidcConfig.claims)
            urlToNavigate += "&claims=" + encodeURI(JSON.stringify(oidcConfig.claims));
        if (oidcConfig === null || oidcConfig === void 0 ? void 0 : oidcConfig.claims_locales)
            urlToNavigate += "&claims_locales=" + oidcConfig.claims_locales;
        if (oidcConfig === null || oidcConfig === void 0 ? void 0 : oidcConfig.display)
            urlToNavigate += "&display=" + oidcConfig.display;
        if (oidcConfig === null || oidcConfig === void 0 ? void 0 : oidcConfig.prompt)
            urlToNavigate += "&state=" + oidcConfig.prompt;
        if (oidcConfig === null || oidcConfig === void 0 ? void 0 : oidcConfig.max_age)
            urlToNavigate += "&max_age=" + oidcConfig.max_age;
        if (oidcConfig === null || oidcConfig === void 0 ? void 0 : oidcConfig.ui_locales)
            urlToNavigate += "&ui_locales=" + oidcConfig.ui_locales;
        return urlToNavigate;
    }
    /**
     * builds classes based on input shape, theme and button type.
     *
     * if theme is 'custom' then standard classes are applied and these clases
     *  are expected to be added by the button implementer.
     *
     * @param buttonConfig
     * @returns classes
     */
    function buildButtonClasses(buttonConfig) {
        var outerDivClasses = "";
        var logoDivClasses = "";
        var logoImgClasses = "";
        var labelSpanClasses = styles.textbox;
        if (buttonConfig.theme == defaultThemes.custom) {
            return {
                outerDivClasses: (outerDivClasses =
                    buttonConfig.type == buttonTypes.icon
                        ? "sign-in-outer-div-container-icon"
                        : "sign-in-outer-div-container-standard"),
                logoDivClasses: "sign-in-logo-div-container",
                logoImgClasses: "sign-in-logo-img",
                labelSpanClasses: "sign-in-label-span",
            };
        }
        //theme based styling
        switch (buttonConfig.theme) {
            case defaultThemes.outline:
                outerDivClasses = styles.standardOutline;
                break;
            case defaultThemes.filledOrange:
                outerDivClasses = styles.filledOrange;
                break;
            case defaultThemes.filledBlack:
                outerDivClasses = styles.filledBlack;
                break;
            default: //default theme outline
                outerDivClasses = styles.standardOutline;
        }
        //shaped based styling
        switch (buttonConfig.shape) {
            case defaultShapes.sharpEdges:
                //default button type is standard. Setting shape based on button type
                outerDivClasses +=
                    " " +
                        (buttonConfig.type == buttonTypes.icon
                            ? styles.sharpRectIcon
                            : styles.sharpRectBox);
                logoDivClasses = styles.sharpLogoBox;
                logoImgClasses = styles.sharpLogo;
                break;
            case defaultShapes.softEdges:
                outerDivClasses +=
                    " " +
                        (buttonConfig.type == buttonTypes.icon
                            ? styles.softRectIcon
                            : styles.softRectBox);
                logoDivClasses = styles.softLogoBox;
                logoImgClasses = styles.softLogo;
                break;
            case defaultShapes.roundedEdges:
                outerDivClasses +=
                    " " +
                        (buttonConfig.type == buttonTypes.icon
                            ? styles.roundedRectIcon
                            : styles.roundedRectBox);
                logoDivClasses = styles.roundedLogoBox;
                logoImgClasses = styles.roundedLogo;
                break;
            default: //default shaped SharpEdges
                outerDivClasses +=
                    " " +
                        (buttonConfig.type == buttonTypes.icon
                            ? styles.sharpRectIcon
                            : styles.sharpRectBox);
                logoDivClasses = styles.sharpLogoBox;
                logoImgClasses = styles.sharpLogo;
        }
        return {
            outerDivClasses: outerDivClasses,
            logoDivClasses: logoDivClasses,
            logoImgClasses: logoImgClasses,
            labelSpanClasses: labelSpanClasses,
        };
    }
    /**
     * builds style for the outer div by updating baseStyle by adding/overriding
     *  button config styling parameters.
     * @param baseStyle
     * @param buttonConfig
     * @returns style
     */
    function buildButtonStyles(baseStyle, buttonConfig) {
        if (buttonConfig === null || buttonConfig === void 0 ? void 0 : buttonConfig.width)
            baseStyle["width"] = buttonConfig.width;
        if (buttonConfig === null || buttonConfig === void 0 ? void 0 : buttonConfig.background)
            baseStyle["background"] = buttonConfig.background;
        if (buttonConfig === null || buttonConfig === void 0 ? void 0 : buttonConfig.textColor)
            baseStyle["color"] = buttonConfig.textColor;
        if (buttonConfig === null || buttonConfig === void 0 ? void 0 : buttonConfig.borderWidth)
            baseStyle["border-width"] = buttonConfig.borderWidth;
        if (buttonConfig === null || buttonConfig === void 0 ? void 0 : buttonConfig.borderColor)
            baseStyle["border-color"] = buttonConfig.borderColor;
        if (buttonConfig === null || buttonConfig === void 0 ? void 0 : buttonConfig.font)
            baseStyle["font"] = buttonConfig.font;
        if (buttonConfig === null || buttonConfig === void 0 ? void 0 : buttonConfig.fontFamily) {
            baseStyle["font-family"] = buttonConfig.fontFamily;
        }
        else {
            //default font-family
            baseStyle["font-family"] =
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen','Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',sans-serif";
        }
        return baseStyle;
    }
    /**
     * builds style based on button type and custom style.
     *
     * if theme is 'custom' then standard classes are applied and these clases
     *  are expected to be added by the button implementer.
     * @param baseStyle
     * @param buttonConfig
     * @returns
     */
    function buildButtonCustomStyles(baseStyle, buttonConfig) {
        if (!buttonConfig.customStyle) {
            return {};
        }
        var outerDiv = buttonConfig.type == buttonTypes.icon
            ? buttonConfig.customStyle.outerDivStyleIcon
            : buttonConfig.customStyle.outerDivStyleStandard;
        Object.assign(baseStyle, outerDiv);
        return {
            outerDivStyle: buildButtonStyles(baseStyle, buttonConfig),
            logoDivStyle: buttonConfig.customStyle.logoDivStyle,
            logoImgStyle: buttonConfig.customStyle.logoImgStyle,
            labelSpanStyle: buttonConfig.customStyle.labelSpanStyle,
        };
    }
    /**
     * style attrs applied on the element
     * @param element
     * @param attrs
     */
    var setStyleAttribute = function (element, attrs) {
        if (attrs !== undefined) {
            Object.keys(attrs).forEach(function (key) {
                element.style.setProperty(key, attrs[key]);
            });
        }
    };
    /**
     *
     * Builds button while adding styles and classes on individual element
     *
     * In case of buttonClasses, the button should render like this.
     * <span> --conditional
     *   {errorObj + ". Please report to site admin"}
     * </span>
     * <a href={urlToNavigate}>
     *   <div className={buttonClasses.outerDivClasses} style={buttonStyle}>
     *     <div className={buttonClasses.logoDivClasses}>
     *       <img className={buttonClasses.logoImgClasses} src={logoPath} />
     *     </div>
     *      <span className={buttonClasses.labelSpanClasses} >{buttonLabel}</span> --conditional
     *   </div>
     * </a>
     * @param buttonLabel
     * @param urlToNavigate
     * @param buttonCustomStyle
     * @param buttonClasses
     * @param buttonStyle
     * @param logoPath
     * @param errorMsg
     * @param type
     * @returns
     */
    var createButton = function (buttonLabel, urlToNavigate, buttonCustomStyle, buttonClasses, buttonStyle, logoPath, errorMsg, type) {
        var _a, _b, _c, _d;
        //Button
        var anchor = document.createElement("a");
        anchor.href = urlToNavigate;
        anchor.style.textDecoration = "none";
        var outerDiv = document.createElement("div");
        var logoDiv = document.createElement("div");
        var logoImg = document.createElement("img");
        logoImg.src = logoPath;
        var labelSpan = document.createElement("span");
        labelSpan.innerHTML = buttonLabel;
        if (buttonCustomStyle) {
            //apply custom style
            if (buttonCustomStyle.outerDivStyle)
                anchor.style.width = buttonCustomStyle.outerDivStyle["width"];
            setStyleAttribute(outerDiv, buttonCustomStyle.outerDivStyle);
            setStyleAttribute(logoDiv, buttonCustomStyle.logoDivStyle);
            setStyleAttribute(logoImg, buttonCustomStyle.logoImgStyle);
            setStyleAttribute(labelSpan, buttonCustomStyle.labelSpanStyle);
        }
        else if (buttonClasses) {
            //or apply classes
            if (buttonStyle)
                anchor.style.width = buttonStyle["width"];
            setStyleAttribute(outerDiv, buttonStyle);
            (_a = outerDiv.classList).add.apply(_a, buttonClasses.outerDivClasses.split(" "));
            (_b = logoDiv.classList).add.apply(_b, buttonClasses.logoDivClasses.split(" "));
            (_c = logoImg.classList).add.apply(_c, buttonClasses.logoImgClasses.split(" "));
            (_d = labelSpan.classList).add.apply(_d, buttonClasses.labelSpanClasses.split(" "));
        }
        logoDiv.appendChild(logoImg);
        outerDiv.appendChild(logoDiv);
        //Do not add label span for icon button
        if (type != buttonTypes.icon) {
            outerDiv.appendChild(labelSpan);
        }
        if (errorMsg) {
            //adding error span
            var errorSpan = document.createElement("span");
            errorSpan.style.color = "red";
            errorSpan.style.color = "14px";
            errorSpan.innerHTML = errorMsg + ". Please report to site admin";
            anchor.appendChild(errorSpan);
        }
        anchor.appendChild(outerDiv);
        return anchor;
    };
    var SignInWithEsignet = function (_a) {
        var _b, _c;
        var props = __rest(_a, []);
        var oidcConfig = props.oidcConfig, buttonConfig = props.buttonConfig, signInElement = props.signInElement, style = props.style;
        if (signInElement == null) {
            return signInElement;
        }
        //validate input
        var errorMsg = validateInput(oidcConfig);
        var urlToNavigate = "#";
        if (!errorMsg) {
            urlToNavigate = buildRedirectURL(oidcConfig);
        }
        if (!buttonConfig) {
            //default values
            buttonConfig = {
                type: buttonTypes.standard,
                theme: defaultThemes.outline,
                labelText: defaultButtonLabel,
                shape: defaultShapes.sharpEdges,
            };
        }
        var label = (_b = buttonConfig.labelText) !== null && _b !== void 0 ? _b : defaultButtonLabel;
        var logoPath = (_c = buttonConfig.logoPath) !== null && _c !== void 0 ? _c : img;
        var baseStyle = style || {};
        var buttonCustomStyle = null;
        var buttonClasses = null;
        var buttonStyle = {};
        // customStyle has precedence over buttonClasses
        if (buttonConfig.customStyle) {
            buttonCustomStyle = buildButtonCustomStyles(baseStyle, buttonConfig);
        }
        else {
            buttonClasses = buildButtonClasses(buttonConfig);
            buttonStyle = buildButtonStyles(baseStyle, buttonConfig);
        }
        var button = createButton(label, urlToNavigate, buttonCustomStyle, buttonClasses, buttonStyle, logoPath, errorMsg, buttonConfig.type);
        signInElement.innerHTML = "";
        signInElement.appendChild(button);
        return signInElement;
    };
    var init = function (_a) {
        var props = __rest(_a, []);
        return SignInWithEsignet(props);
    };

    exports.init = init;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
