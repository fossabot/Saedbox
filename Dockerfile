FROM xataz/node

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install

EXPOSE 9000
CMD ["npm","start"]
