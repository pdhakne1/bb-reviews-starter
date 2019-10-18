FROM node:10.16.3-slim


WORKDIR /usr/src/app
COPY . .

EXPOSE 4004

# --- Sync db changes
WORKDIR /usr/src/app/db
RUN npm config set @sap:registry https://npm.sap.com
RUN npm install --prefix /usr/src/app/db
RUN npm install --prefix /usr/src/app

# 1. Apply default-env.json from mount point to root, /db and /srv folders
# 2. Sync db changes
# 3. Run server under root level
CMD cp /data/default-env.json /usr/src/app/default-env.json && \
    cp /data/default-env.json /usr/src/app/db/default-env.json && \
    cp /data/default-env.json /usr/src/app/srv/default-env.json && \
    npm start --prefix /usr/src/app/db && \
    npm start --prefix /usr/src/app
