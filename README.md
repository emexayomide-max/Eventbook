# EventBook — End-to-End DevOps Project


## Overview

**EventBook** is a full-stack event management application developed and deployed as an end-to-end DevOps project.

The application allows users to:

- Register and authenticate
- Log in securely
- Create events
- View available events
- View event details
- Book events
- View their bookings
- View events they have created
- Manage authenticated user sessions

The project demonstrates a complete DevOps lifecycle, from local application development and containerization through infrastructure provisioning, Kubernetes deployment, security hardening, CI/CD automation, DNS, HTTPS, persistent storage, reliability testing, and monitoring.

The application is deployed to **Amazon EKS** and is accessible through:

https://www.eventbook.name.ng



# Table of Contents

- [Project Goals]
- [Architecture]
- [Technology Stack]
- [Application Architecture]
- [Repository Structure]
- [Application Features]
- [Local Development]
- [Docker Containerization]
- [Docker Security]
- [Docker Compose]
- [AWS Infrastructure]
- [Terraform]
- [Amazon EKS]
- [Kubernetes Architecture]
- [Kubernetes Deployments]
- [PostgreSQL Persistent Storage]
- [Kubernetes Secrets]
- [Kubernetes Security]
- [Health Checks]
- [Resource Management]
- [Rolling Updates]
- [PodDisruptionBudgets]
- [Self-Healing]
- [Ingress]
- [DNS]
- [HTTPS and TLS]
- [CI/CD Pipeline]
- [Security Scanning]
- [GitHub OIDC]
- [Monitoring and Observability]
- [Prometheus and Grafana]
- [Alerting]
- [Reliability Testing]
- [Database Validation]
- [Network Security]
- [Environment Variables]
- [AWS IAM and EKS Pod Identity]
- [Deployment Workflow]
- [Useful Kubernetes Commands]
- [Troubleshooting Approach]
- [Lessons Learned]
- [Future Improvements]
- [Project Outcome]



# Project Goals

The main objective of this project was to build a production-style DevOps workflow around a real full-stack application.

The project focuses on:

- Containerization
- Infrastructure as Code
- Cloud infrastructure
- Kubernetes
- CI/CD automation
- Security
- Persistent storage
- Networking
- HTTPS
- DNS
- Reliability
- Monitoring
- Operational troubleshooting

The project was designed to demonstrate practical DevOps knowledge rather than simply deploying an application manually.



# Architecture

The high-level architecture is:

text
                         Internet
                            │
                            ▼
                  www.eventbook.name.ng
                            │
                            ▼
                    AWS Load Balancer
                            │
                            ▼
                 NGINX Ingress Controller
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
          Frontend Service       Backend Service
                 │                     │
                 ▼                     ▼
          Frontend Pods           Backend Pods
                                       │
                                       ▼
                                PostgreSQL Service
                                       │
                                       ▼
                                PostgreSQL Pod
                                       │
                                       ▼
                              PersistentVolumeClaim
                                       │
                                       ▼
                                  AWS EBS Volume


The infrastructure is hosted on AWS.

Terraform provisions the AWS infrastructure, while Kubernetes manifests manage the application workloads inside Amazon EKS.

GitHub Actions automates application validation, Docker image builds, security scanning, image publishing, and deployment to EKS.

Prometheus and Grafana provide cluster and application workload monitoring.



# Technology Stack

## Frontend

- React
- Vite
- JavaScript
- HTML
- CSS
- NGINX

## Backend

- Node.js
- Express
- PostgreSQL driver (`pg`)
- JSON Web Tokens (JWT)
- bcrypt
- CORS

## Database

- PostgreSQL 16

## Containerization

- Docker
- Docker Compose
- Multi-stage Docker builds
- Alpine-based production images

## Cloud

- AWS
- Amazon EKS
- Amazon EBS
- Amazon ECR
- AWS IAM
- AWS VPC
- NAT Gateway
- Internet Gateway

## Infrastructure as Code

- Terraform

## Kubernetes

- Amazon EKS
- Deployments
- Services
- Ingress
- Secrets
- PersistentVolumeClaims
- StorageClass
- Resource requests and limits
- Liveness probes
- Readiness probes
- Security contexts
- PodDisruptionBudgets
- Rolling updates
- NetworkPolicies

## CI/CD

- GitHub Actions
- GitHub OIDC
- Amazon ECR
- Kubernetes
- Automated deployment verification

## Security

- Trivy
- Non-root containers
- Kubernetes security contexts
- Kubernetes Secrets
- IAM
- GitHub OIDC
- HTTPS/TLS
- Let's Encrypt
- cert-manager

## Monitoring

- Kubernetes Metrics Server
- Kubernetes Metrics API
- Prometheus
- Grafana
- Alertmanager
- kube-state-metrics
- Node Exporter
- Kubernetes container metrics
- Kubernetes logs



# Application Architecture

EventBook consists of three primary application components.

## Frontend

The frontend is a React application built using Vite.

The production frontend is compiled into static assets and served using NGINX.

The frontend communicates with the backend through the `/api/` path.

## Backend

The backend is a Node.js/Express API.

It provides:

- Authentication
- User registration
- Login
- JWT authentication
- Event management
- Event creation
- Event updates
- Event retrieval
- Event bookings
- User profile information
- Booking management
- Health checks
- Database connectivity checks

## PostgreSQL

PostgreSQL stores:

- Users
- Events
- Bookings

The database is deployed inside Kubernetes and uses persistent AWS EBS storage through a Kubernetes PersistentVolumeClaim.



# Repository Structure

text
E-eventbooks/
│
├── .git/
├── .gitignore
├── README.md
│
├── backend/
│   ├── .env.example
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   ├── package-lock.json
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   └── database/
│       └── schema.sql
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── docker-compose.yml
│
├── k8s/
│   ├── namespace.yaml
│   ├── ingress.yaml
│   │
│   ├── backend/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── secret.example.yaml
│   │
│   ├── frontend/
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   │
│   ├── postgres/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   ├── pvc.yaml
│   │   └── secret.example.yaml
│   │
│   ├── pdb/
│   │   ├── backend-pdb.yaml
│   │   └── frontend-pdb.yaml
│   │
│   ├── network-policies/
│   │   ├── backend-policy.yaml
│   │   ├── frontend-policy.yaml
│   │   └── postgres-policy.yaml
│   │
│   └── cert-manager/
│       └── clusterissuer.yaml
│
└── terraform/
    ├── provider.tf
    ├── variables.tf
    ├── main.tf
    ├── terraform.tfvars
    ├── terraform.tfvars.example
    ├── outputs.tf
    └── eks.tf


Actual secret files containing credentials are excluded from version control.



# Application Features

## Authentication

Users can:

- Register
- Log in
- Receive a JWT token
- Access protected routes
- View their profile
- Log out

Passwords are hashed using bcrypt before being stored.

## Events

Authenticated users can create events containing:

- Event title
- Description
- Location
- Event date
- Capacity

Users can view available events and individual event details.

## Bookings

Authenticated users can book events.

The database enforces constraints to maintain data integrity and prevent duplicate user/event bookings.



# Local Development

## Prerequisites

The following tools are required:

- Node.js
- npm
- Git
- Docker
- Docker Compose
- PostgreSQL client
- Terraform
- AWS CLI
- kubectl
- Helm

## Clone the Repository

bash
git clone https://github.com/emexayomide-max/Eventbook.git
cd Eventbook


## Install Backend Dependencies

bash
cd backend
npm install


## Install Frontend Dependencies

bash
cd ../frontend
npm install


## Run the Application

Backend:

bash
cd backend
npm start


Frontend:

bash
cd frontend
npm run dev




# Database

The PostgreSQL schema contains three main tables:

text
users
events
bookings


Relationships:

text
users
 │
 ├──────────────┐
 │              │
 ▼              ▼
events       bookings
               │
               ▼
             events


The database schema includes foreign keys and constraints to maintain data integrity.



# Docker Containerization

The application is containerized using Docker.

The backend uses a multi-stage Docker build.

The frontend uses a multi-stage build where:

1. Node.js builds the React application.
2. NGINX serves the generated production files.



# Docker Security

Security improvements include:

- Multi-stage builds
- Alpine-based production images
- Production-only backend dependencies
- Non-root containers
- Removal of unnecessary npm/Corepack components
- NGINX running without root privileges
- Reduced production image contents
- Trivy vulnerability scanning
- Reduced container attack surface



# Docker Compose

Docker Compose is used for local development.

The local stack contains:

text
postgres
backend
frontend


The services communicate through the Docker Compose network.

PostgreSQL uses a named Docker volume:

text
postgres_data


This allows database data to survive PostgreSQL container recreation.



# AWS Infrastructure

The application is deployed to AWS using Terraform.

The AWS infrastructure includes:

- Custom VPC
- Public subnets
- Private subnets
- Internet Gateway
- NAT Gateway
- Route tables
- Security groups
- Amazon EKS
- Managed node group
- Amazon EBS
- Amazon ECR
- IAM roles

AWS region:

text
us-east-1




# VPC Architecture

The project uses separate public and private subnets.

text
VPC
│
├── Public Subnet 1
├── Public Subnet 2
├── Private Subnet 1
└── Private Subnet 2


The EKS worker nodes are deployed in private subnets.

Public-facing traffic is handled through the Kubernetes ingress/load-balancing layer.

A NAT Gateway provides outbound internet access for private resources when required.



# Terraform

Terraform is used to provision AWS infrastructure as code.

The Terraform configuration manages:

- AWS provider
- VPC
- Subnets
- Route tables
- Internet Gateway
- NAT Gateway
- Security groups
- IAM roles
- EKS cluster
- EKS managed node group
- EBS CSI permissions
- EKS Pod Identity
- Cluster outputs

Typical workflow:

bash
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply


Infrastructure changes are reviewed using `terraform plan` before being applied.



# Amazon EKS

The Kubernetes cluster is:

text
eventbook-eks


Kubernetes version:

text
1.33


The managed node group uses:

text
Instance type: t3.small
Minimum nodes: 2
Maximum nodes: 3
Desired nodes: 3


The worker nodes run Amazon Linux 2023.

The third node was added to provide sufficient pod capacity for the Kubernetes workloads and monitoring components while remaining within the configured maximum node count.



# Kubernetes Namespace

The application is deployed into:

text
eventbook


This provides logical isolation between EventBook workloads and other Kubernetes system components.

Monitoring components run separately in the:

text
monitoring


namespace.



# Kubernetes Architecture

The EventBook workloads are:

text
eventbook namespace
│
├── frontend Deployment
│   ├── frontend Pod
│   └── frontend Pod
│
├── backend Deployment
│   ├── backend Pod
│   └── backend Pod
│
├── postgres Deployment
│   └── postgres Pod
│
├── frontend Service
├── backend Service
├── postgres Service
│
├── postgres PVC
│
└── EventBook Ingress




# Kubernetes Deployments

## Frontend

The frontend runs two replicas to provide availability during Pod restarts and rolling updates.

text
2 frontend replicas


## Backend

The backend also runs two replicas:

text
2 backend replicas


This allows Kubernetes to perform rolling updates while maintaining application availability.

## PostgreSQL

PostgreSQL runs as a single-replica Deployment with persistent storage attached through a PersistentVolumeClaim.



# Kubernetes Services

The application uses ClusterIP Services for internal communication.

text
frontend
backend
postgres


The frontend communicates with the backend through the Kubernetes service.

The backend communicates with PostgreSQL through the PostgreSQL service.



# PostgreSQL Persistent Storage

PostgreSQL uses a Kubernetes PersistentVolumeClaim:

text
postgres-pvc


Storage:

text
5Gi


Access mode:

text
ReadWriteOnce


StorageClass:

text
gp2


The AWS EBS CSI driver provisions the underlying EBS volume.

The PostgreSQL container uses:

text
PGDATA=/var/lib/postgresql/data/pgdata


This avoids PostgreSQL initialization issues caused by the `lost+found` directory that can exist at the root of a newly mounted filesystem.



# Database Persistence Test

A PostgreSQL Pod was deliberately deleted to test Kubernetes self-healing and persistent storage.

Kubernetes recreated the PostgreSQL Pod.

Existing database records remained available after the replacement Pod started.

This verified:

text
Pod deletion
    │
    ▼
New PostgreSQL Pod
    │
    ▼
Same persistent EBS volume
    │
    ▼
Existing data preserved




# Kubernetes Secrets

Sensitive configuration is stored using Kubernetes Secrets rather than being hardcoded directly into application manifests.

Sensitive values include:

- PostgreSQL password
- JWT secret
- Database credentials

Secret files containing actual credentials are excluded from version control.

Example/template files are provided for repository documentation.

The backend retrieves sensitive values using Kubernetes `secretKeyRef`.



# Kubernetes Security

Application workloads use Kubernetes security contexts.

The backend and frontend containers are configured with:

- Non-root execution
- `allowPrivilegeEscalation: false`
- Dropped Linux capabilities
- `seccompProfile: RuntimeDefault`
- Resource requests and limits

PostgreSQL also uses:

- `allowPrivilegeEscalation: false`
- Dropped Linux capabilities
- `seccompProfile: RuntimeDefault`

These settings reduce the privileges available to application containers.



# Health Checks

The backend exposes:

text
GET /api/health


This endpoint is used by Kubernetes liveness and readiness probes.

## Liveness Probe

The liveness probe determines whether the container is functioning correctly.

If the container becomes unhealthy, Kubernetes can restart it.

## Readiness Probe

The readiness probe determines whether the Pod is ready to receive traffic.

This prevents Kubernetes from sending requests to a Pod that is not ready.

PostgreSQL uses `pg_isready` for its readiness and liveness checks.



# Resource Management

CPU and memory requests and limits are configured for the workloads.

## Backend

text
CPU request:       100m
CPU limit:         500m
Memory request:    128Mi
Memory limit:      512Mi


## Frontend

text
CPU request:       50m
CPU limit:         300m
Memory request:    64Mi
Memory limit:      256Mi


## PostgreSQL

text
CPU request:       100m
CPU limit:         500m
Memory request:    256Mi
Memory limit:      512Mi


Requests allow Kubernetes to make informed scheduling decisions.

Limits prevent individual containers from consuming unlimited resources.



# Rolling Updates

The frontend and backend Deployments use rolling update strategies.

Configuration includes:

text
maxUnavailable: 0
maxSurge: 1


This allows Kubernetes to create a replacement Pod before removing an existing healthy Pod.

Rollout status can be monitored using:

bash
kubectl rollout status deployment/backend -n eventbook
kubectl rollout status deployment/frontend -n eventbook


Rollbacks are available through:

bash
kubectl rollout undo deployment/backend -n eventbook




# PodDisruptionBudgets

PodDisruptionBudgets are configured for the frontend and backend workloads.

Their purpose is to limit the number of application replicas that can be voluntarily disrupted at the same time.

This provides additional protection during maintenance operations and planned node disruptions.



# Self-Healing

Kubernetes self-healing was tested by deliberately deleting application Pods.

For example:

bash
kubectl delete pod <pod-name> -n eventbook


Kubernetes automatically created replacement Pods.

This behavior was tested with application workloads and PostgreSQL.

The replacement Pods became Ready and the application continued functioning.



# Ingress

The project uses the NGINX Ingress Controller.

Ingress routes external HTTP/HTTPS traffic into Kubernetes services.

The architecture is:

text
Internet
   │
   ▼
AWS Load Balancer
   │
   ▼
NGINX Ingress Controller
   │
   ├── /      → frontend
   │
   └── /api/  → backend




# DNS

The production domain is:

text
eventbook.name.ng


The application is currently served through:

text
www.eventbook.name.ng


The `www` DNS record points to the AWS load-balancing endpoint used by the NGINX Ingress Controller.



# HTTPS and TLS

HTTPS is implemented using:

- cert-manager
- Let's Encrypt
- NGINX Ingress

The Kubernetes Ingress references the TLS secret:

text
eventbook-tls


HTTPS is available at:

text
https://www.eventbook.name.ng


HTTP traffic is redirected to HTTPS through the ingress configuration.



# cert-manager

cert-manager automates TLS certificate management.

The project uses the Let's Encrypt ClusterIssuer:

text
letsencrypt-prod


The ACME HTTP-01 challenge is handled through the NGINX Ingress Controller.

The production certificate was successfully issued and verified.



# Amazon ECR

Container images are stored in Amazon Elastic Container Registry.

Repositories:

text
eventbook-backend
eventbook-frontend


The CI/CD pipeline builds and publishes application images to ECR.

Image tags can be based on Git commit identifiers to provide traceability between source code and deployed containers.



# CI/CD Pipeline

GitHub Actions automates the application delivery process.

The pipeline performs:

text
Git Push
   │
   ▼
GitHub Actions
   │
   ├── Install dependencies
   ├── Build application
   ├── Terraform validation
   ├── Build Docker images
   ├── Trivy security scan
   │
   ▼
Amazon ECR
   │
   ▼
Amazon EKS
   │
   ├── Update backend image
   ├── Update frontend image
   ├── Wait for rollout
   └── Verify deployment




# GitHub OIDC

GitHub Actions uses OpenID Connect to authenticate with AWS.

Long-lived AWS access keys are not stored inside GitHub Actions.

Instead:

text
GitHub Actions
      │
      ▼
GitHub OIDC
      │
      ▼
AWS IAM Role
      │
      ▼
ECR / EKS


This reduces the risk associated with storing permanent AWS credentials in CI/CD systems.



# Security Scanning

Trivy is used to scan container images for vulnerabilities.

The CI pipeline scans for:

- HIGH vulnerabilities
- CRITICAL vulnerabilities

The Docker images were hardened based on scan results.

Unnecessary packages were removed from production images where appropriate to reduce the attack surface.



# Monitoring and Observability

The project includes multiple layers of Kubernetes observability.

## Metrics Server

Metrics Server provides Kubernetes resource metrics.

The Metrics API was verified and supports commands such as:

bash
kubectl top nodes
kubectl top pods -n eventbook


## Prometheus

Prometheus collects Kubernetes metrics from components including:

- Kubernetes workloads
- Nodes
- Pods
- Containers
- kube-state-metrics
- Node Exporter

## Grafana

Grafana provides dashboards for visualizing the collected metrics.

The Grafana interface is accessed securely through Kubernetes port forwarding rather than exposing Grafana through a public AWS Load Balancer.

## Alertmanager

Alertmanager is deployed as part of the Prometheus monitoring stack and provides alert management functionality.



# Prometheus and Grafana

The project uses the `kube-prometheus-stack`, which provides:

- Prometheus
- Grafana
- Alertmanager
- Prometheus Operator
- kube-state-metrics
- Node Exporter

The monitoring stack runs in the dedicated:

text
monitoring


namespace.

Grafana and Prometheus are accessed locally using Kubernetes port forwarding.

Example:

bash
kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80


Grafana:

text
http://localhost:3000


Prometheus:

bash
kubectl port-forward -n monitoring svc/monitoring-kube-prometheus-prometheus 9090:9090


Prometheus:

text
http://localhost:9090


No additional public LoadBalancer is required for monitoring.



# Grafana Dashboard

A dedicated EventBook Kubernetes monitoring dashboard was configured in Grafana.

The dashboard provides visibility into:

- Running EventBook Pods
- Total EventBook Pods
- CPU usage
- Memory usage
- PostgreSQL availability
- Backend available replicas
- Frontend available replicas

Example PromQL queries include:

promql
sum(kube_pod_status_phase{namespace="eventbook", phase="Running"})


promql
count(kube_pod_info{namespace="eventbook"})


promql
sum(rate(container_cpu_usage_seconds_total{
  namespace="eventbook",
  container!="",
  container!="POD"
}[5m]))


promql
sum(container_memory_working_set_bytes{
  namespace="eventbook",
  container!="",
  container!="POD"
})




# Alerting

Grafana alert rules were configured for important EventBook failure conditions.

Configured alerts include:

## Backend Down

Triggered when the available backend replica count falls below one.

promql
kube_deployment_status_replicas_available{
  namespace="eventbook",
  deployment="backend"
}


## Frontend Down

Triggered when the available frontend replica count falls below one.

promql
kube_deployment_status_replicas_available{
  namespace="eventbook",
  deployment="frontend"
}


## PostgreSQL Down

Triggered when the PostgreSQL Pod is no longer running.

promql
kube_pod_status_phase{
  namespace="eventbook",
  pod=~"postgres.*",
  phase="Running"
}


## High CPU

Triggered when EventBook workload CPU usage exceeds the configured threshold for the specified evaluation period.

These alerts provide basic operational visibility without requiring additional public infrastructure.



# Application Logging

Kubernetes container logs can be inspected using:

bash
kubectl logs deployment/backend -n eventbook


and:

bash
kubectl logs deployment/postgres -n eventbook


Logs provide visibility into:

- Application startup
- Application runtime behavior
- Database startup
- Database readiness
- Database connections
- PostgreSQL checkpoints
- Persistent database initialization



# Network Security

NetworkPolicy manifests were created for:

- Backend
- Frontend
- PostgreSQL

The intended communication model is:

text
Ingress
   │
   ▼
Frontend
   │
   ▼
Backend
   │
   ▼
PostgreSQL


The policies document the desired network segmentation between application tiers.

The current EKS VPC CNI configuration does not have Kubernetes NetworkPolicy enforcement enabled. Therefore, the manifests represent the intended security policy configuration rather than claiming that the policies are actively enforced by the current cluster networking implementation.

This distinction is documented deliberately to keep the project documentation accurate.



# Database Validation

The application database was tested through the backend API and directly through PostgreSQL.

The database successfully supports:

- Users
- Events
- Bookings

Database constraints maintain data integrity and prevent invalid relationships and duplicate bookings.

Backend-to-PostgreSQL connectivity was also validated through the application health/API flow.



# Environment Variables

Sensitive environment variables are not committed to Git.

Examples are provided through:

text
backend/.env.example


Production Kubernetes configuration uses Kubernetes Secrets.

Typical backend configuration includes:

text
PORT
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
JWT_SECRET


Actual Kubernetes Secret manifests containing credentials are excluded from source control.



# AWS IAM and EKS Pod Identity

AWS permissions are managed using IAM roles rather than hardcoded AWS credentials.

The EKS infrastructure uses IAM for:

- EKS worker nodes
- ECR image access
- AWS networking
- EBS CSI volume management

The EBS CSI driver uses an IAM role through EKS Pod Identity.

This allows the CSI driver to manage EBS volumes without embedding AWS credentials inside application containers.



# Deployment Workflow

The complete deployment workflow is:

text
Developer
   │
   ▼
GitHub Repository
   │
   ▼
GitHub Actions
   │
   ├── Test
   ├── Build
   ├── Terraform Validate
   ├── Docker Build
   ├── Trivy Scan
   │
   ▼
Amazon ECR
   │
   ▼
Amazon EKS
   │
   ├── Backend Deployment
   ├── Frontend Deployment
   └── PostgreSQL
   │
   ▼
NGINX Ingress
   │
   ▼
HTTPS
   │
   ▼
EventBook Users




# Deployment Verification

After deployment, Kubernetes rollouts can be verified using:

bash
kubectl rollout status deployment/backend -n eventbook


and:

bash
kubectl rollout status deployment/frontend -n eventbook


The deployed images can be checked using:

bash
kubectl get deployment backend \
  -n eventbook \
  -o path='{.spec.template.spec.containers[0].image}'


and:

bash
kubectl get deployment frontend \
  -n eventbook \
  -o path='{.spec.template.spec.containers[0].image}'




# Useful Kubernetes Commands

## Check all EventBook resources

bash
kubectl get all -n eventbook


## Check Pods

bash
kubectl get pods -n eventbook


## Check Services

bash
kubectl get svc -n eventbook


## Check Deployments

bash
kubectl get deployments -n eventbook


## Check Ingress

bash
kubectl get ingress -n eventbook


## Check PVC

bash
kubectl get pvc -n eventbook


## Check resource usage

bash
kubectl top pods -n eventbook


bash
kubectl top nodes


## View logs

bash
kubectl logs deployment/backend -n eventbook


## Describe a Pod

bash
kubectl describe pod <pod-name> -n eventbook


## Check rollout

bash
kubectl rollout status deployment/backend -n eventbook


## Restart a deployment

bash
kubectl rollout restart deployment/backend -n eventbook


## Roll back a deployment

bash
kubectl rollout undo deployment/backend -n eventbook




# Useful Terraform Commands

Initialize Terraform:

bash
terraform init


Format configuration:

bash
terraform fmt


Validate configuration:

bash
terraform validate


Review infrastructure changes:

bash
terraform plan


Apply infrastructure:

bash
terraform apply


View Terraform outputs:

bash
terraform output




# Troubleshooting Approach

The project uses a layered troubleshooting approach.

## 1. Application

Check application logs:

bash
kubectl logs deployment/backend -n eventbook


## 2. Pod

Check Pod state:

bash
kubectl get pods -n eventbook


## 3. Deployment

Check rollout:

bash
kubectl rollout status deployment/backend -n eventbook


## 4. Service

Check services:

bash
kubectl get svc -n eventbook


## 5. Ingress

Check ingress:

bash
kubectl get ingress -n eventbook


## 6. DNS

Verify that the domain resolves to the expected load-balancing endpoint.

## 7. TLS

Verify HTTPS:

bash
curl -I https://www.eventbook.name.ng


## 8. Infrastructure

Use Terraform and AWS CLI to inspect AWS infrastructure.

This layered approach helps isolate whether an issue is caused by the application, container, Kubernetes workload, service networking, ingress, DNS, TLS, or AWS infrastructure.



# Production URL

The deployed application is available at:

**https://www.eventbook.name.ng**

The backend health endpoint is available through:

**https://www.eventbook.name.ng/api/health**



# CI/CD Security Model

The GitHub Actions deployment does not depend on permanent AWS access keys.

The workflow uses:

text
GitHub
  │
  ▼
OIDC Identity Token
  │
  ▼
AWS IAM Role
  │
  ├── Amazon ECR
  └── Amazon EKS


This provides temporary AWS credentials to the GitHub Actions workflow.



# Infrastructure Security Model

The project follows the principle of limiting unnecessary exposure.

text
Internet
   │
   ▼
Ingress / Load Balancer
   │
   ▼
Frontend
   │
   ▼
Backend
   │
   ▼
PostgreSQL


PostgreSQL is not intentionally exposed directly to the public internet.

The database is accessed internally through the Kubernetes Service.

Grafana and Prometheus are also not exposed through public LoadBalancers. They are accessed through local Kubernetes port forwarding when required.



# Lessons Learned

## Infrastructure as Code

Terraform makes infrastructure reproducible and allows infrastructure changes to be reviewed before being applied.

## Kubernetes

Kubernetes provides:

- Scheduling
- Service discovery
- Self-healing
- Rolling deployments
- Health checks
- Resource management
- Persistent storage

## Container Security

Running production containers as root unnecessarily increases risk.

Using non-root users, reduced capabilities, minimal images, and security scanning reduces the container attack surface.

## CI/CD

Automating image creation, security scanning, publishing, deployment, and rollout verification reduces manual deployment errors.

## Immutable Image Strategy

Using Git commit identifiers for container image tags can provide traceability between:

text
Git commit
    │
    ▼
Docker image
    │
    ▼
ECR
    │
    ▼
Kubernetes deployment


## Persistent Storage

Kubernetes Pods are disposable.

Persistent data must therefore live outside the Pod lifecycle.

The PostgreSQL EBS volume demonstrated this principle during the Pod deletion test.

## Health Probes

Liveness and readiness probes allow Kubernetes to distinguish between:

- A running container
- A healthy application
- A Pod that is ready to receive traffic

## Observability

Metrics and logs are essential for operating applications in production.

Metrics Server provides lightweight Kubernetes resource metrics, while Prometheus and Grafana provide deeper monitoring and visualization.

Grafana alert rules provide visibility into application availability and resource conditions.

## Troubleshooting

The project provided practical experience troubleshooting:

- Kubernetes scheduling
- Pod capacity
- Persistent volumes
- EBS CSI
- Ingress
- DNS
- TLS certificates
- Helm deployments
- Prometheus/Grafana
- Kubernetes networking
- Application/database connectivity



# Future Improvements

The project architecture can be extended further with:

- Application-level Prometheus metrics
- Centralized logging
- Distributed tracing
- Stronger NetworkPolicy enforcement
- Automated database backups
- PostgreSQL high availability
- Horizontal Pod Autoscaling
- Cluster Autoscaling
- AWS WAF
- CloudFront
- Route 53 DNS management
- Automated disaster recovery
- Performance testing
- Load testing
- Further cost optimization
- Blue/green deployments
- Canary deployments



# Project Outcome

EventBook demonstrates an end-to-end DevOps implementation around a real full-stack application.

The project covers:

text
Application Development
        │
        ▼
Docker
        │
        ▼
Container Security
        │
        ▼
Terraform
        │
        ▼
AWS
        │
        ▼
Amazon EKS
        │
        ▼
Kubernetes
        │
        ├── Deployments
        ├── Services
        ├── Secrets
        ├── Probes
        ├── Resource Management
        ├── Persistent Storage
        ├── Security Contexts
        ├── PodDisruptionBudgets
        ├── NetworkPolicy Configuration
        └── Ingress
        │
        ▼
DNS + HTTPS
        │
        ▼
GitHub Actions
        │
        ▼
Amazon ECR
        │
        ▼
Automated EKS Deployment
        │
        ▼
Reliability Testing
        │
        ▼
Prometheus + Grafana
        │
        ▼
Alerting and Observability


The application has been successfully:

- Containerized with Docker
- Hardened for production
- Provisioned on AWS using Terraform
- Deployed to Amazon EKS
- Connected to persistent PostgreSQL storage using AWS EBS
- Exposed through an NGINX Ingress Controller
- Secured with HTTPS and Let's Encrypt
- Connected to a custom domain
- Automated through GitHub Actions
- Secured with GitHub OIDC
- Tested for Kubernetes self-healing
- Tested for rolling updates
- Tested for persistent database storage
- Monitored using Prometheus and Grafana
- Configured with operational alerts

The project demonstrates practical DevOps experience across **application development, containerization, infrastructure as code, AWS, Kubernetes, security, CI/CD, networking, TLS, persistent storage, reliability, monitoring, alerting, and operational troubleshooting**.

## Monitoring Dashboard

The EventBook Kubernetes environment is monitored using Prometheus and Grafana.


![EventBook Grafana Dashboard](docs/grafana-dashboard.png)
