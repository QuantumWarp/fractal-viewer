FROM mhart/alpine-node:16 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install --only=prod
COPY . /app/
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/fractal-viewer /usr/share/nginx/html/
