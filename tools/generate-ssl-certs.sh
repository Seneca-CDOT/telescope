#!/usr/bin/env bash

set -e

mkdir certs
openssl req -x509       \
  -newkey rsa:4096      \
  -keyout certs/key.pem \
  -out certs/cert.pem   \
  -nodes                \
  -subj '/CN=localhost' \
  -days 365
