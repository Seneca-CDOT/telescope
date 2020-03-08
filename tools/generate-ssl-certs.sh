#!/usr/bin/env bash


set -e

# Step 1) Generates local SSL pem files:
#
#   1. a new 4096-bit private key (privkey.pem)
#   2. a self-signed public cert (cert.pem) for localhost good for 1024 days.
#      The Distinguished Name (DN) fields are pre-set as follows:
#
#      Country Name (2 letter code) [CA]:CA
#      State or Province Name (full name) [Some-State]:Ontario
#      Locality Name (eg, city) []:Toronto
#      Organization Name (eg, company) [Internet Widgits Pty Ltd]:CDOT
#      Common Name (e.g. server FQDN or YOUR name) []:localhost
#
# NOTE: these are not suitable for use in
# production. For good docs on what is happening here, see:
# https://www.digitalocean.com/community/tutorials/openssl-essentials-working-with-ssl-certificates-private-keys-and-csrs
openssl req                                              \
  -x509                                                  \
  -newkey rsa:4096                                       \
  -nodes                                                 \
  -subj "/C=CA/ST=Ontario/L=Toronto/O=CDOT/CN=localhost" \
  -days 1024                                             \
  -keyout privkey.pem                                    \
  -out cert.pem

# Step 2) IDP Public Cert - https://github.com/bergie/passport-saml/blob/master/test/static/acme_tools_com.cert
echo -e '-----BEGIN CERTIFICATE-----\nMIICrjCCAZYCCQDWybyUsLVkXzANBgkqhkiG9w0BAQsFADAZMRcwFQYDVQQDFA5h\nY21lX3Rvb2xzLmNvbTAeFw0xNTA4MTgwODQ3MzZaFw0yNTA4MTcwODQ3MzZaMBkx\nFzAVBgNVBAMUDmFjbWVfdG9vbHMuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A\nMIIBCgKCAQEAlyT+OzEymhaZFNfx4+HFxZbBP3egvcUgPvGa7wWCV7vyuCauLBqw\nO1FQqzaRDxkEihkHqmUz63D25v2QixLxXyqaFQ8TxDFKwYATtSL7x5G2Gww56H0L\n1XGgYdNW1akPx90P+USmVn1Wb//7AwU+TV+u4jIgKZyTaIFWdFlwBhlp4OBEHCyY\nwngFgMyVoCBsSmwb4if7Mi5T746J9ZMQpC+ts+kfzley59Nz55pa5fRLwu4qxFUv\n2oRdXAf2ZLuxB7DPQbRH82/ewZZ8N4BUGiQyAwOsHgp0sb9JJ8uEM/qhyS1dXXxj\no+kxsI5HXhxp4P5R9VADuOquaLIo8ptIrQIDAQABMA0GCSqGSIb3DQEBCwUAA4IB\nAQBW/Y7leJnV76+6bzeqqi+buTLyWc1mASi5LVH68mdailg2WmGfKlSMLGzFkNtg\n8fJnfaRZ/GtxmSxhpQRHn63ZlyzqVrFcJa0qzPG21PXPHG/ny8pN+BV8fk74CIb/\n+YN7NvDUrV7jlsPxNT2rQk8G2fM7jsTMYvtz0MBkrZZsUzTv4rZkF/v44J/ACDir\nKJiE+TYArm70yQPweX6RvYHNZLSzgg4o+hoyBXo5BGQetAjmcIhC6ZOwN3iVhGjp\n0YpWM0pkqStPy3sIR0//LZbskWWlSRb0fX1c4632Xb+zikfec4DniYV6CxkB2U+p\nlHpOX1rt1R+UiTEIhTSXPNt/\n-----END CERTIFICATE-----' > idp_cert.pem
