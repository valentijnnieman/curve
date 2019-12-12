FROM node:10

WORKDIR /curve

COPY package*.json ./

RUN npm install

COPY . .

RUN cd react-ui
RUN npm install
RUN npm build
RUN cd ../

EXPOSE 5000
