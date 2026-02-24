FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs && rm -rf /var/lib/apt/lists/*

ARG API_URL=http://localhost:5000

COPY Backend/ ./Backend/
COPY Frontend/QRGen/QRGen-frontend/ ./Frontend/

RUN cd Backend && pip install flask flask-cors qrcode[pil] pillow

RUN cd Frontend && npm install && VITE_API_URL=$API_URL npm run build

EXPOSE 5000 3000

CMD ["sh", "-c", "cd Backend && python app.py & cd Frontend && npx serve -s dist -l 3000"]
