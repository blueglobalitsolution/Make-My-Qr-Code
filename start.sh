#!/bin/bash
cd "$(dirname "$0")/Backend"
source "$(dirname "$0")/QR/bin/activate"
python app.py &
cd "$(dirname "$0")/Frontend/QRGen/QRGen-frontend"
npm install
npm run dev -- --port 3000
