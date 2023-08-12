if [ -z "${SHA}" ]; then
    export SHA=$(git rev-parse HEAD)
fi

kubectl apply -f k8s

echo "finished deploying"

kubectl set image deployments/api-deployment api=thomaslaich/hashsum-api:$SHA
kubectl set image deployments/worker-deployment worker=thomaslaich/hashsum-worker:$SHA
