#!/bin/zsh

release_version=$1

if [ -z "$release_version" ]; then
  echo "Usage: $0 <release_version>"
  exit 1
fi


source .env

zip_folder="zip"
zip_filename="${zip_folder}/embraceio-metric-app-${release_version}.zip"

# Build the project
yarn install --pure-lockfile
yarn build
# Remove the previous artifact from the run
rm -rf embraceio-metric-app/
# Sign the plugin
npx @grafana/sign-plugin
# Rename the build to the name of the plugin
mv dist/ embraceio-metric-app/
# Create zip artifact
mkdir -p $zip_folder
zip $zip_filename embraceio-metric-app -r
MD5_HASH=$(md5 $zip_filename | awk '{print $4}')

# Verify the artifact
plugincheck2 -config config/default.yaml $zip_filename

echo -e "\n\n"
echo "Success 🎉🎉🎉"
echo "Please provide the following for the plugin submission update"
echo "Plugin URL:  https://github.com/embrace-io/grafana-metric-plugin/blob/main/${zip_filename}?raw=true"
echo "MD5:         $MD5_HASH"
echo "Source Code: https://github.com/embrace-io/grafana-metric-plugin"
