# syntax=docker/dockerfile:1.6-labs

ARG NODE_VERSION=20.11.1

FROM node:${NODE_VERSION}-alpine as base

LABEL maintainer="Kélsio Mateus <kelsiomt@gmail.com>" \
  version="1.0.1" \
  description="🔰🦸" \
  license="MIT" 

ARG WAIT_VERSION=2.12.1

RUN <<EOF
set -ex
apk update
apk upgrade
apk add --no-cache openssl
rm -rf /var/cache/apk/*
EOF

RUN <<EOF
npm install -g pm2
npm cache clean --force
EOF

ENV NODE_ENV=production \
  FORCE_COLOR=1

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/${WAIT_VERSION}/wait /wait
RUN chmod +x /wait

WORKDIR /app


FROM base as builder

COPY --link package*.json ./

RUN <<EOF
npm ci --omit=optional
npm cache clean --force
EOF

COPY --link . .

RUN <<EOF
npm run prisma:generate
npm run build
npm prune --omit=dev
EOF


FROM base as runtime

ARG PORT=5000
ENV PORT $PORT
EXPOSE $PORT
VOLUME ["/app/logs"]

RUN mkdir logs

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app

COPY --link <<EOF process.json
{ "apps": [{ "exec_mode": "cluster", "instances": "max", "name": "wilaya-music", "script": "./index.js" }] }
EOF

# HEALTHCHECK --interval=30s --timeout=60s --start-period=10s --retries=3 CMD node ./healthcheck.js

CMD /wait && pm2-runtime ./process.json
