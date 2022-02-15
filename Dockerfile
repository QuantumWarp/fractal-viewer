FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/fractal-viewer /usr/share/nginx/html/
