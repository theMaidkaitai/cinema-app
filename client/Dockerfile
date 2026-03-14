FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g typescript
COPY package*.json ./
RUN NODE_ENV=development npm i
COPY . .
RUN npm run build


FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/hmtl
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off"]