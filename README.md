# DockerHub
```
docker build -t <hub-user>/<repo-name>:<tag>
docker tag <existing-image> <hub-user>/<repo-name>:<tag>
docker push <hub-user>/<repo-name>:<tag>
```

# Kubernetes
    ```
    kubectl apply -f store-pod.yml
    kubectl apply -f <directory-name>
    kubectl get pods
    kubectl get services
    kubectl apply 
    kubectl get all

    kubectl delete pod <pod-name>
    kubectl delete all --all

    kubectl logs <pod-name>
    kubectl config get-contexts
    kubectl config use-contexts <context-name>
    ```

## Secret imperative command
    ```
    kubectl create secret generic <secret-name> --from-literal <key>=<value>
    kubectl get secrets
    kubectl get secrets -o yaml
    echo <secret> | base64 -d
    ```

# AWS EKS

## Install eksctl
    ```
    brew tap weaveworks/tap
    brew install weaveworks/tap/eksctl
    eksctl version
    ```

## Creat cluster using eksctl 
    ```
    eksctl create cluster --node-type t2.medium
    ```
