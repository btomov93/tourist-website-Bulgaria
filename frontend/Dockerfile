# build stage
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# production stage
FROM nginx:alpine

# clean config
RUN rm -rf /etc/nginx/conf.d/*

# create working nginx config
RUN printf 'server {\n\
  listen 80;\n\
  server_name localhost;\n\
  location / {\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
}' > /etc/nginx/conf.d/default.conf

# copy built app
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
