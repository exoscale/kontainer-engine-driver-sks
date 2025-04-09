# UI Cluster Driver SKS

Rancher Cluster Driver UI for the [Exoscale Scalable Kubernetes Service](https://community.exoscale.com/community/sks/overview/)

## Ready to use

This project is deployed under this Repository Github pages:
[exoscale.github.io/kontainer-engine-driver-sks/component.js](https://exoscale.github.io/kontainer-engine-driver-sks/component.js)

It serves the necessary files

You can use this ui link directly to the Exoscale cluster driver setup.
Do not forget to whitelist `*.github.io` in the rancher UI Cluster Driver setup.

## Development

This package contains a small web-server that will serve up the custom driver UI at `http://localhost:3000/component.js`.  You can run this while developing and point the Rancher settings there.

* `npm install`
* `npm start`
* The compiled files are viewable at <http://localhost:3000>.

## Building

For other users to see your driver, you need to build it and host the output on a server accessible from their browsers.

* `npm install`
* `npm run build -- --name=exoscale`
* Copy the contents of the `dist` directory onto a webserver.
  * If your Rancher is configured to use HA or SSL, the server must also be available via HTTPS.
