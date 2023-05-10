
#!/bin/bash

while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    --aws_access_key_id)
    aws_access_key_id="$2"
    shift # past argument
    shift # past value
    ;;
    --aws_secret_access_key)
    aws_secret_access_key="$2"
    shift # past argument
    shift # past value
    ;;
    --from_email)
    from_email="$2"
    shift # past argument
    shift # past value
    ;;
    *)
    echo "Unknown option: $key"
    exit 1
    ;;
esac
done


kubectl apply -f "https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml"

# Before/After creating below secret, setup AWS SES service for sending email.
kubectl create secret generic store-notifications-secret --from-literal=AWS_ACCESS_KEY_ID=${aws_access_key_id} --from-literal=AWS_SECRET_ACCESS_KEY=${aws_secret_access_key} --from-literal=FROM_EMAIL=${from_email}

# Create RabbitMQ resources
kubectl apply -f ./k8s/rabbitmq
