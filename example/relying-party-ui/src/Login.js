import React, { useEffect } from "react";

export default function Login() {

    useEffect(() => {
        /**
         * This function initializes the Sign In with eSignet button.
         * It configures the OIDC parameters and button appearance.
         * Make sure to replace the OIDC parameters with your actual values.
         * Ensure that the SignInWithEsignetButton script is loaded in your HTML.
         * refer to the eSignet documentation for more details.
         */
        const renderButton = () => {
            /**
             * This code initializes the SignInWithEsignetButton with the required OIDC configuration.
             * The configuration includes parameters like acr_values, authorizeUri, client_id, redirect_uri, etc.
             * You can customize the button appearance using the buttonConfig object.
             * Make sure to replace the values with your actual OIDC configuration.
             * @param {Object} oidcConfig - The OIDC configuration object.
             * @param {Object} buttonConfig - The button configuration object.
             * @param {HTMLElement} signInElement - The HTML element where the button will be rendered.
             */
            window.SignInWithEsignetButton?.init({
                oidcConfig: {
                    acr_values: 'mosip:idp:acr:generated-code',
                    authorizeUri: 'http://localhost:3000/authorize',
                    claims_locales: 'fra',
                    client_id: 'IIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1VwgO',
                    display: 'page',
                    nonce: 'ere973eieljznge2311',
                    prompt: 'consent',
                    redirect_uri: 'http://localhost:5000/userprofile',
                    scope: 'openid profile',
                    state: 'eree2311',
                    ui_locales: 'en'
                },
                buttonConfig: {
                    labelText: 'Sign in with eSignet',
                    shape: 'soft_edges',
                    theme: 'filled_orange',
                    type: 'standard'
                },
                signInElement: document.getElementById('sign-in-with-esignet'),
            })
        }
        renderButton();
    })
    return <div>
        <div id="sign-in-with-esignet" style={{ width: '100%' }}></div>
    </div>
}