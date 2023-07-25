#!/bin/sh
if [ -z "${SHA}" ]; then
    export SHA=$(git rev-parse HEAD)
fi

docker build -t thomaslaich/hashsum-api:latest -t thomaslaich/hashsum-api:$SHA -f ./Dockerfile ../..
docker push thomaslaich/hashsum-api:latest
docker push thomaslaich/hashsum-api:$SHA
