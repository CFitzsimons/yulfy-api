FROM node:8-slim
MAINTAINER Yulfy

# Prepare app directory
RUN mkdir -p /usr/src/app

#Setup temp dir
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /usr/src/app/ && cd ..
ADD . /usr/src/app

# Move to working directory
WORKDIR /usr/src/app

# Expose the app port
EXPOSE 1337

CMD [ "npm", "start" ]