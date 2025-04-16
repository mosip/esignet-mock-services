# ---------- Build Stage ----------
FROM node:20.15.0 AS build

WORKDIR /app
    
# Copy and install dependencies
COPY package*.json ./
RUN npm install
    
COPY . .
RUN npm run build
    
# ---------- Nginx Serve Stage ----------
FROM nginx:stable
    
ARG SOURCE
ARG COMMIT_HASH
ARG COMMIT_ID
ARG BUILD_TIME
    
LABEL source=${SOURCE}
LABEL commit_hash=${COMMIT_HASH}
LABEL commit_id=${COMMIT_ID}
LABEL build_time=${BUILD_TIME}
    
ENV nginx_dir=/usr/share/nginx
ENV work_dir=${nginx_dir}/html
    
# Copy built Vite app (note: output is in "dist", not "build")
COPY --from=build /app/dist ${work_dir}
    
# Add dynamic env config generation script
ADD configure_start.sh /configure_start.sh
RUN chmod +x /configure_start.sh
    
# Add nginx config
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
    
EXPOSE 8080
    
ENTRYPOINT [ "/configure_start.sh" ]
CMD ["nginx", "-g", "daemon off;"]
    