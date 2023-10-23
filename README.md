# Embrace Metric Grafana Plugin

## Development Process
1. Clone the repo
2. Run `yarn install`
3. Start Docker
4. Run `yarn dev` to start the dev server
5. Run `yarn server` to serve up the plugin on localhost:3000

## Submission Process 
1. Create a new release: https://github.com/embrace-io/grafana-metric-plugin/releases
2. When the build is finished, locate the artifact under the Releases page
3. On [Plugins](https://grafana.com/orgs/embraceio/plugins) page, click "Submit plugin updade" and provide the following for the submission update:
- Plugin URL: `https://github.com/embrace-io/grafana-metric-plugin/releases/download/<version>/embraceio-metric-app-<version>.zip` (copy link address from Release page)
- MD5: Hash can be obtained from md5.txt file on Releases page
- Source code: https://github.com/embrace-io/grafana-metric-plugin
