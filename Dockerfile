FROM node:20-alpine AS compile-stage

COPY . /tmp/app
WORKDIR /tmp/app
RUN npm ci --cache /cache/.npm && \
    (npm run build || mkdir -p .next) && \
    rm -rf ./.next/cache
VOLUME [ "/cache" ]

FROM node:20-alpine

ARG P_USER_NAME=app
ARG P_UID=21001
ENV NODE_ENV=production HOME=/app

# Create a new user to our new container and avoid the root userx
RUN addgroup --gid ${P_UID} ${P_USER_NAME} && \
    adduser --disabled-password --uid ${P_UID} ${P_USER_NAME} -G ${P_USER_NAME} && \
    mkdir -p ${HOME} && \
    chown -R ${P_UID}:${P_UID} ${HOME}

WORKDIR ${HOME}
USER ${P_UID}

COPY --chown="21001:21001" package*.json ./
COPY --from=compile-stage --chown="21001:21001" /cache/.npm /cache/.npm

RUN npm ci --omit=dev --cache /cache/.npm && \
    rm -rf package-lock.json /cache/.npm

COPY --chown="21001:21001" public ./public
COPY --from=compile-stage --chown="21001:21001" /tmp/app/.next ./.next
COPY --chown="21001:21001" next.config.mjs ./

CMD npm start
