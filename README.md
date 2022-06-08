# pumba-frontend

This is the user interface for PUMBA written in Javascript.
It works together with [pumba-backend](https://github.com/UNIL-PAF/pumba-backend).

## Development setup

You have to have `node` installed.

Install libraries with yarn (or npm if you prefer):
`yarn install`

Adapt the configuration file:
`src/config.js`

Start the development server:
`yarn run start`


## Deploy the frontend

Create the final code and copy it on your server (e.g. with Apache server running):
`yarn build`
e.g. `scp -r build/* pumba@pumba.your-server.org:/home/pumba/pumba-web/htdocs/`
