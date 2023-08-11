kubectl apply -f k8s

echo "finished deploying"

kubectl set image deployments/api-deployment api=thomaslaich/hashsum-api:$SHA
kubectl set image deployments/worker-deployment worker=thomaslaich/hashsum-worker:$SHA

# docker exec thomaslaich/hashsum-api:$SHA ls 