import json
import base64
import requests
from flask import Flask, request
from authlib.integrations.requests_client import OAuth2Session
from authlib.oauth2.rfc7523 import PrivateKeyJWT
import jwt


app = Flask(__name__)

# OIDC Provider details
ISSUER = "http://localhost:8088"  # The OIDC issuer URL
CLIENT_ID = "IIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1VwgO"  # Your client ID
REDIRECT_URI = "http://localhost:5000/userprofile"  # Callback URL for OIDC
TOKEN_URL = f"{ISSUER}/v1/esignet/oauth/v2/token"
USERINFO_URL = f"{ISSUER}/v1/esignet/oidc/userinfo"
SCOPES = "openid profile"

# provide private key in JWK format
private_key_jwk = "YOUR_PRIVATE_KEY"


## Utility methods
## converting JWK to PEM format
def jwk_to_pem(jwk):
    return (
        jwt.algorithms.RSAAlgorithm.from_jwk(jwk)
        .private_bytes(
            encoding=jwt.algorithms.Encoding.PEM,
            format=jwt.algorithms.PrivateFormat.TraditionalOpenSSL,
            encryption_algorithm=jwt.algorithms.NoEncryption(),
        )
        .decode("utf-8")
    )

## Base64URL decode utility function
def base64url_decode(input_str):
    # Add padding if necessary
    padding_needed = 4 - (len(input_str) % 4)
    if padding_needed and padding_needed != 4:
        input_str += "=" * padding_needed

    # Decode the Base64URL-encoded string
    return base64.urlsafe_b64decode(input_str).decode("utf-8")


## Handles token exchange and fetches user_info from the OIDC Provider
## This endpoint is called after the user authorizes the application
## we have name the endpoint as /delegate/fetchUserInfo,
## but you can name it anything you like.
@app.route("/delegate/fetchUserInfo")
def callback():
    # Retrieve the authorization code from the callback URL
    code = request.args.get("code")

    private_key_pem = jwk_to_pem(private_key_jwk)

    client = OAuth2Session(
        CLIENT_ID,
        private_key_pem,
        token_endpoint_auth_method="private_key_jwt",
        redirect_uri=REDIRECT_URI,
        grant_type="authorization_code",
        response_type="code",
    )

    client.register_client_auth_method(PrivateKeyJWT(TOKEN_URL))

    token_response = client.fetch_token(TOKEN_URL, code=code)
    access_token = token_response["access_token"]
    print(f"token_response {access_token}")

    # Fetch user info
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(USERINFO_URL, headers=headers)
    parts = response.text.split(".")
    user_info = json.loads(base64url_decode(parts[1]))
    return user_info


if __name__ == "__main__":
    # Run Flask app
    app.run(host="0.0.0.0", port=8888)
