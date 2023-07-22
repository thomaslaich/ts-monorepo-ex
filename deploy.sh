docker build -t thomaslaich/hashsum-api:latest -t thomaslaich/hashsum-api:$SHA -f ./server/Dockerfile ./server
docker build -t thomaslaich/hashsum-worker:latest -t thomaslaich/hashsum-worker:$SHA -f ./worker/Dockerfile ./worker

docker push thomaslaich/hashsum-api:latest
docker push thomaslaich/hashsum-worker:latest

docker push thomaslaich/hashsum-api:$SHA
docker push thomaslaich/hashsum-worker:$SHA

kubectl apply -f k8s

kubectl set image deployments/api-deployment server=thomaslaich/hashsum-api:$SHA
# kubectl set image deployments/worker-job worker=thomaslaich/hashsum-worker:$SHA
