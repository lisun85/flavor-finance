#!/bin/bash

export PYTHONPATH=/google/google_appengine/lib/:/google/google_appengine/lib/webapp2-2.5.2:/google/google_appengine/lib/webob-1.2.3

production_app=flavor-finance

echo "Building Server"
yarn build
echo "Building Client"
cd client
yarn build
cd ..
echo "Deploying to Production"
echo "gcloud -q app deploy --project $production_app  --stop-previous-version"
gcloud -q app deploy --project $production_app  --stop-previous-version
# echo "gcloud -q app deploy cron.yaml --project $production_app "
# gcloud -q app deploy cron.yaml --project $production_app
