#!/bin/bash

# Build and push QR Generator Docker image

API_URL=${1:-https://qrgen.makemyqrcode.com}

echo "Building image with API_URL: $API_URL"

docker build --build-arg API_URL=$API_URL -t bgtuser/qr-pro-generator:latest .
docker push bgtuser/qr-pro-generator:latest

echo "Done!"
