#!/bin/sh
if [ -z "${SHA}" ]; then
    export SHA=$(git rev-parse HEAD)
fi

docker build -t thomaslaich/hashsum-webapp:latest -t thomaslaich/hashsum-webapp:$SHA -f ./Dockerfile ../..
docker push thomaslaich/hashsum-webapp:latest
docker push thomaslaich/hashsum-webapp:$SHA
