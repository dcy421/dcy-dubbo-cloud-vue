FROM node AS base
MAINTAINER dcy "xxx@qq.com"
WORKDIR /app
COPY . /app/
RUN npm config set registry http://registry.npm.taobao.org/
RUN npm install  && npm run build
# docker 多阶段构建
FROM nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=base /app/dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
