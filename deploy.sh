kubectl apply -f k8s

echo "finished deploying"

kubectl set image deployments/api-deployment server=thomaslaich/hashsum-api:$SHA
kubectl set image deployments/worker-job worker=thomaslaich/hashsum-worker:$SHA
