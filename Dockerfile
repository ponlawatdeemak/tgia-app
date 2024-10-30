FROM node:20-alpine AS builder

COPY . /tmp/app
# COPY ./src /tmp/app/src
# COPY next.config.mjs /tmp/app/
# COPY package-lock.json /tmp/app/
# COPY package.json /tmp/app/
# COPY postcss.config.mjs /tmp/app/
# COPY tailwind.config.ts /tmp/app/
# COPY tsconfig.json /tmp/app/

WORKDIR /tmp/app
RUN npm ci --cache /cache/.npm && \
    (npm run build || mkdir -p .next) && \
    rm -rf ./.next/cache
VOLUME [ "/cache" ]

FROM node:20-alpine AS runner

# ARG P_USER_NAME=app
# ARG P_UID=21001
ENV NODE_ENV=production HOME=/app

# # Create a new user to our new container and avoid the root userx
# RUN addgroup --gid ${P_UID} ${P_USER_NAME} && \
#     adduser --disabled-password --uid ${P_UID} ${P_USER_NAME} -G ${P_USER_NAME} && \
#     mkdir -p ${HOME} && \
#     chown -R ${P_UID}:${P_UID} ${HOME}

WORKDIR ${HOME}
# USER ${P_UID}

COPY --chown=root:node --chmod=755 --from=builder /tmp/app/package.json ./
COPY --chown=root:node --chmod=755 --from=builder /tmp/app/package-lock.json ./
COPY --chown=root:node --chmod=755 --from=builder /cache/.npm /cache/.npm

RUN npm ci --omit=dev --cache /cache/.npm && \
    rm -rf package-lock.json /cache/.npm

COPY --chown=root:node --chmod=755 --from=builder  /tmp/app/public ./public
COPY --chown=root:node --chmod=755 --from=builder  /tmp/app/.next ./.next
COPY --chown=root:node --chmod=755 --from=builder  /tmp/app/next.config.mjs ./
 
USER root

USER node
EXPOSE 3000

CMD ["npm", "start"]


 
# Test
# FROM node:20-alpine AS compile-stage

# COPY . /tmp/app
# # COPY ./src /tmp/app/src
# # COPY next.config.mjs /tmp/app/
# # COPY package-lock.json /tmp/app/
# # COPY package.json /tmp/app/
# # COPY postcss.config.mjs /tmp/app/
# # COPY tailwind.config.ts /tmp/app/
# # COPY tsconfig.json /tmp/app/

# WORKDIR /tmp/app
# RUN npm ci --cache /cache/.npm && \
#     (npm run build || mkdir -p .next) && \
#     rm -rf ./.next/cache
# VOLUME [ "/cache" ]

# FROM node:20-alpine

# ARG P_USER_NAME=app
# ARG P_UID=21001
# ENV NODE_ENV=production HOME=/app

# # Create a new user to our new container and avoid the root userx
# RUN addgroup --gid ${P_UID} ${P_USER_NAME} && \
#     adduser --disabled-password --uid ${P_UID} ${P_USER_NAME} -G ${P_USER_NAME} && \
#     mkdir -p ${HOME} && \
#     chown -R ${P_UID}:${P_UID} ${HOME}

# WORKDIR ${HOME}
# USER ${P_UID}

# COPY --chown=${P_UID}:${P_UID} --chmod=755 package.json ./
# COPY --chown=${P_UID}:${P_UID} --chmod=755 package-lock.json ./
# COPY --from=compile-stage --chown=${P_UID}:${P_UID} --chmod=755 /cache/.npm /cache/.npm

# RUN npm ci --omit=dev --cache /cache/.npm && \
#     rm -rf package-lock.json /cache/.npm

# COPY --chown=${P_UID}:${P_UID} --chmod=755 public ./public
# COPY --from=compile-stage --chown=${P_UID}:${P_UID} --chmod=755 /tmp/app/.next ./.next
# COPY --chown=${P_UID}:${P_UID} --chmod=755 next.config.mjs ./
 
# USER ${P_UID}

# EXPOSE 3000

# CMD ["npm", "start"]
