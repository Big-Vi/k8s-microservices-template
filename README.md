docker build -t <hub-user>/<repo-name>:<tag>
docker tag <existing-image> <hub-user>/<repo-name>:<tag>
docker push <hub-user>/<repo-name>:<tag>

kubectl apply -f store-pod.yml
kubectl get pods
kubectl get services
