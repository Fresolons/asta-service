FROM node:22
WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .

COPY mycert.key /etc/nginx/mycert.key
COPY mycert.crt /etc/nginx/mycert.crt

EXPOSE 3000
CMD ["npm", "start"]