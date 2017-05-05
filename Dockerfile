FROM xataz/node

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN export BUILD_DEPS="python \
                       build-base" \
           && apk add -U ${BUILD_DEPS} \
           && npm install \
           && apk del ${BUILD_DEPS} \
           && rm -rf /tmp/* \
               /var/cache/apk/* \
               /root/.npm \
               /root/.node-gyp \
               /usr/lib/node_modules/npm/man \
               /usr/lib/node_modules/npm/doc \
               /usr/lib/node_modules/npm/html \
               /usr/share/man


EXPOSE 9000
CMD ["npm","start"]
