#!/bin/zsh

release_version=$1

if [ -z "$release_version" ]; then
  echo "Usage: $0 <release_version>"
  exit 1
fi

zip_folder="zip"
zip_filename="${zip_folder}/embrace-io-metric-app-${release_version}.zip"

yarn install --pure-lockfile
yarn build
mv dist/ embraceio-metric-app/
mkdir -p $zip_folder
zip $zip_filename embraceio-metric-app -r
MD5_HASH=$(md5 $zip_filename | awk '{print $4}')

echo -e "\n\n"
echo "Success 🎉🎉🎉"
echo "Please provide the following for the plugin submission update"
echo "Plugin URL:  https://github.com/embrace-io/grafana-metric-plugin/tree/master/${zip_filename}"
echo "MD5:         $MD5_HASH"
echo "Source Code: https://github.com/embrace-io/grafana-metric-plugin"
