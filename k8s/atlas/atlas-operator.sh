#!/bin/bash

while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    --org_id)
    org_id="$2"
    shift # past argument
    shift # past value
    ;;
    --atlas_public_key)
    atlas_public_key="$2"
    shift # past argument
    shift # past value
    ;;
    --atlas_private_key)
    atlas_private_key="$2"
    shift # past argument
    shift # past value
    ;;
    --mongo_pw)
    mongo_pw="$2"
    shift # past argument
    shift # past value
    ;;
    *)
    echo "Unknown option: $key"
    exit 1
    ;;
esac
done

# echo "ORG_ID  = ${org_id}"

# # Install Atlas Operator
kubectl apply -f https://raw.githubusercontent.com/mongodb/mongodb-atlas-kubernetes/main/deploy/all-in-one.yaml

kubectl create secret generic mongodb-atlas-operator-api-key \
    --from-literal="orgId=$org_id" \
    --from-literal="publicApiKey=$atlas_public_key" \
    --from-literal="privateApiKey=$atlas_private_key" \
    -n mongodb-atlas-system

kubectl label secret mongodb-atlas-operator-api-key atlas.mongodb.com/type=credentials -n mongodb-atlas-system

# # User Password
kubectl create secret generic atlaspassword --from-literal="password=${mongo_pw}"
kubectl label secret atlaspassword atlas.mongodb.com/type=credentials

# Create Project, Deployment and User
kubectl apply -f ./k8s/atlas

kubectl get atlasprojects
kubectl get atlasdeployments
