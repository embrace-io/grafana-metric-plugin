# Embrace Metric Grafana Plugin

## Development Process

1. Clone the repo
2. Run `yarn install`
3. Start container with `podman-compose up`
4. Run `yarn dev` to start the dev server
5. Run `yarn server` to serve up the plugin on localhost:3000

## Submission Process

1. Update package.json with upcoming version number

2. Create new release: <https://github.com/embrace-io/grafana-metric-plugin/releases> with the same version number
   - When the build finishes there will be .zip and md5.txt artifacts attached to the release

3. On [Plugins](https://grafana.com/orgs/embraceio/plugins) page, click "Submit plugin updade" and provide the following for the submission update:
   - Plugin URL: `https://github.com/embrace-io/grafana-metric-plugin/releases/download/<version>/embraceio-metric-app-<version>.zip` (copy link address from Release page)
   - MD5: `https://github.com/embrace-io/grafana-metric-plugin/releases/download/<version>/md5.txt`
   - Source code: <https://github.com/embrace-io/grafana-metric-plugin>
