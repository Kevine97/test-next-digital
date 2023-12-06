FROM node:18.19.0-alpine as BUILDER

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --forzen-lockfile

COPY . .

RUN yarn build; \ 
  yarn install --production --forzen-lockfile

#----------------------------------------------#

FROM node:18.19.0-alpine as PRODUCTION

ENV NODE_ENV production
ENV PORT 3907

WORKDIR /app

COPY --from=BUILDER /app/package.json /app/yarn.lock ./
COPY --from=BUILDER /app/dist ./dist
COPY --from=BUILDER /app/node_modules ./node_modules

EXPOSE ${PORT}

CMD ["node", "dist/main.js"]