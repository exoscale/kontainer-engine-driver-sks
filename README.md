# Rancher Kontainer Engine Driver SKS

This is the Kontainer-Engine Exoscale Driver.
It is used in conjunction with the [UI Cluster Driver SKS](./ui)

### Packaging and distributing

## Building

`make build`

Will output driver binaries into the `bin` directory, these can be imported
directly into Rancher and used as cluster drivers.
They must be distributed via URLs that your Rancher instance can establish a connection to and download
the driver binaries.
For example, this driver is distributed via a GitHub
release and can be downloaded from one of those URLs directly.

## Running

Go to the `Cluster Drivers` management screen in Rancher and click
`Add Cluster Driver`.
Enter the URL of your driver, a UI URL (see the UI
[UI Cluster Driver SKS](./ui) for details), and a
checksum (optional), and click `Create`. Rancher will automatically download
and install your driver. It will then become available to use on the
`Add Cluster` screen.

## Testing

This project contains a simple integration test suite to ensure the driver is working as
expected against the Exoscale API.

```bash
export EXOSCALE_API_KEY=EXO....
export EXOSCALE_API_SECRET=xxxx...
```

Run the following command to run the integration test suite:

```bash
go test -race -cover -timeout 15m ./...
```
