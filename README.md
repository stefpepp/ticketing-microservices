* Before using code, fix vulnerabilities that were reported by github
* ticketing
Educational repository to follow microservices course

* on linux for docker running on minikube 
eval $(minikube docker-env)

* to see kubernetes contexts
kubectl config get-contexts

* to change kubernetes context
kubectl config use-context CONTEXT_NAME

*to see kubectl contexts
 kubectl config view

* login to google cloud
gcloud auth login

* command for createing secret, that will be stored as ENV variable in the container in kubernates
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=***key****

* list all secretes in kubernates
kubectl get secrets

* on gcloud image should take value 
us.gcr.io/ticketing-dev-nestor/auth   - or for the last part, behind the forslash, service name
