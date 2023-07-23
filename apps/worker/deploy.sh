#!/bin/sh
if [ -z "${SHA}" ]; then
    export SHA=$(git rev-parse HEAD)
fi

docker build -t thomaslaich/hashsum-worker:latest -t thomaslaich/hashsum-worker:$SHA -f ./Dockerfile .
docker push thomaslaich/hashsum-worker:latest
docker push thomaslaich/hashsum-worker:$SHA
