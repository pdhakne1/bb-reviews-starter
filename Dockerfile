FROM node:10.16.3-slim


WORKDIR /usr/src/app
COPY . .

# --- Apply default-env.json from mount point to root, /db and /srv folders
CMD cp /data/default-env.json /usr/src/app/default-env.json
CMD cp /data/default-env.json /usr/src/app/db/default-env.json
CMD cp /data/default-env.json /usr/src/app/srv/default-env.json

# --- Sync db changes
WORKDIR /usr/src/app/db
RUN npm config set @sap:registry https://npm.sap.com
RUN npm install
CMD npm start

# --- Run app server
WORKDIR /usr/src/app


EXPOSE 4004
CMD npm start