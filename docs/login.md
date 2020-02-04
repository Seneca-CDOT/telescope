# How To Get Login Working Locally

_Note: This process currently only works on Linux/macOS systems_

## Step-by-step Guide

1. Run the shell script, `tools/generate_ssl_certs.sh` located in the tools folder.

2. You will also need to create a `idp_key.pem` file in the certs folder that gets created with the following key:

`MIIDXTCCAkWgAwIBAgIJALmVVuDWu4NYMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwHhcNMTYxMjMxMTQzNDQ3WhcNNDgwNjI1MTQzNDQ3WjBFMQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzUCFozgNb1h1M0jzNRSCjhOBnR`

3. After creating the key, copy and paste the `env.example` file and create a file called ‘.env’. Ensure all related saml2 information is filled out.

_Note: The `env.example` file has examples commented on top of each variable_

4. Now that is all set-up, you will be able to load docker. To do so, type in the terminal `docker-compose up –build`. This will build the SAML2 server that is being used as a local service for testing purposes, and telescope (express). From there, you should be able to click on the login button at localhost:3000/ that will redirect you to the proper login page.

For more information, you can refer to [Documentation](/docs/CONTRIBUTING.md) and [Overview](/docs/overview.md)
