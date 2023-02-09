FROM node:18

#assign a working directory
WORKDIR /blog/frontend

ENV PATH /blog/frontend/node_modules/.bin:$PATH

#install dependencies
COPY package.json /blog/frontend
COPY package-lock.json /blog/frontend
RUN npm install

#copy the project to the working directory
COPY .  /blog/frontend

#start app
CMD npm start
