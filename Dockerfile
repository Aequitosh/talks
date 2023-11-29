ARG NODE_VERSION=21-alpine
FROM node:${NODE_VERSION}

# Add Tini
# See: https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#handling-kernel-signals
ARG TINI_VERSION=v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

ENV WORK_DIR=/home/node
WORKDIR ${WORK_DIR}

# Add app and install JS dependencies via latest npm
ENV CACHE_DIR=/tmp/npm-cache
COPY ./package.json ./package-lock.json ./tsconfig.json ./vite.config.ts ./
COPY ./src ./src
COPY ./public ./public
RUN npm install --cache "${CACHE_DIR}" \
    && rm -rf "${CACHE_DIR}" \
    && chmod 700 "${WORK_DIR}" \
    && chown -R node:node "${WORK_DIR}"

EXPOSE 9000

CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0", "--port", "9000"]

# this user is added by the node image
USER node

