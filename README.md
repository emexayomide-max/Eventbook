# EventBook — End-to-End DevOps Project

![AWS](https://img.shields.io/badge/AWS-EKS-orange)
![Terraform](https://img.shields.io/badge/IaC-Terraform-purple)
![Docker](https://img.shields.io/badge/Container-Docker-blue)
![Kubernetes](https://img.shields.io/badge/Orchestration-Kubernetes-326CE5)
![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-black)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)
![Trivy](https://img.shields.io/badge/Security-Trivy-blue)
![HTTPS](https://img.shields.io/badge/HTTPS-Let's%20Encrypt-green)

## Overview

**EventBook** is a full-stack event management application developed and deployed as an end-to-end DevOps project.

The application allows users to:

* Register and authenticate
* Log in securely
* Create events
* View available events
* View event details
* Book events
* View their bookings
* View events they have created
* Manage authenticated user sessions

The project demonstrates the complete DevOps lifecycle, from local application development and containerization through infrastructure provisioning, Kubernetes deployment, security hardening, CI/CD automation, DNS, HTTPS, persistent storage, reliability testing, and resource monitoring.

The application is deployed to **Amazon EKS** and is accessible through:

**https://www.eventbook.name.ng**

---

# Table of Contents

* [Project Goals](#project-goals)
* [Architecture](#architecture)
* [Technology Stack](#technology-stack)
* [Application Architecture](#application-architecture)
* [Repository Structure](#repository-structure)
* [Application Features](#application-features)
* [Local Development](#local-development)
* [Docker Containerization](#docker-containerization)
* [Docker Security](#docker-security)
* [Docker Compose](#docker-compose)
* [AWS Infrastructure](#aws-infrastructure)
* [Terraform](#terraform)
* [Amazon EKS](#amazon-eks)
* [Kubernetes Architecture](#kubernetes-architecture)
* [Kubernetes Deployments](#kubernetes-deployments)
* [PostgreSQL Persistent Storage](#postgresql-persistent-storage)
* [Kubernetes Secrets](#kubernetes-secrets)
* [Kubernetes Security](#kubernetes-security)
* [Health Checks](#health-checks)
* [Resource Management](#resource-management)
* [Rolling Updates](#rolling-updates)
* [Self-Healing](#self-healing)
* [Ingress](#ingress)
* [DNS](#dns)
* [HTTPS and TLS](#https-and-tls)
* [Amazon ECR](#amazon-ecr)
* [CI/CD Pipeline](#cicd-pipeline)
* [Security Scanning](#security-scanning)
* [GitHub OIDC](#github-oidc)
* [Monitoring and Observability](#monitoring-and-observability)
* [Reliability Testing](#reliability-testing)
* [Database Validation](#database-validation)
* [Environment Variables](#environment-variables)
* [Security Practices](#security-practices)
* [Deployment Workflow](#deployment-workflow)
* [Useful Kubernetes Commands](#useful-kubernetes-commands)
* [Lessons Learned](#lessons-learned)
* [Future Improvements](#future-improvements)
* [Project Outcome](#project-outcome)

---

# Project Goals

The main objective of this project was to build a production-style DevOps workflow around a real full-stack application.

The project focuses on:

* Containerization
* Infrastructure as Code
* Cloud infrastructure
* Kubernetes
* CI/CD automation
* Security
* Persistent storage
* Networking
* HTTPS
* DNS
* Reliability
* Monitoring
* Operational troubleshooting

The project was designed to demonstrate practical knowledge rather than simply deploying an application manually.

---

# Architecture

The high-level architecture is:


                         Internet
                            │
                            ▼
                    eventbook.name.ng
                            │
                            ▼
                    AWS Load Balancer
                            │
                            ▼
                NGINX Ingress Controller
                            │
             ┌──────────────┴──────────────┐
             │                             │
             ▼                             ▼
      Frontend Service              Backend Service
             │                             │
             ▼                             ▼
       Frontend Pods                  Backend Pods
                                             │
                                             ▼
                                      PostgreSQL Service
                                             │
                                             ▼
                                      PostgreSQL Pod
                                             │
                                             ▼
                                      Kubernetes PVC
                                             │
                                             ▼
                                         AWS EBS


The infrastructure is hosted on AWS.

Terraform provisions the AWS infrastructure, while Kubernetes manifests manage the application workloads inside Amazon EKS.

GitHub Actions automates the build, security scanning, container image publishing, and EKS deployment process.

---

# Technology Stack

## Frontend

* React
* Vite
* JavaScript
* HTML
* CSS
* NGINX

## Backend

* Node.js
* Express
* PostgreSQL driver (`pg`)
*  Web Tokens
* bcrypt
* CORS

## Database

* PostgreSQL 16

## Containerization

* Docker
* Docker Compose
* Multi-stage Docker builds
* Alpine-based images

## Cloud

* AWS
* Amazon EKS
* Amazon EC2
* Amazon EBS
* Amazon ECR
* AWS IAM
* AWS VPC
* NAT Gateway
* Internet Gateway

## Infrastructure as Code

* Terraform

## Kubernetes

* Amazon EKS
* Deployments
* Services
* Ingress
* Secrets
* PersistentVolumeClaims
* StorageClass
* Resource requests and limits
* Liveness probes
* Readiness probes
* Security cons
* PodDisruptionBudgets
* Rolling updates

## CI/CD

* GitHub Actions
* GitHub OIDC
* Amazon ECR
* Kubernetes
* Automated deployment verification

## Security

* Trivy
* Non-root containers
* Kubernetes security cons
* Secrets
* IAM
* GitHub OIDC
* HTTPS/TLS
* Let's Encrypt
* cert-manager

## Monitoring

* Kubernetes Metrics Server
* Kubernetes Metrics API
* `kubectl top`
* Kubernetes container logs
* Prometheus
* Grafana

---

# Application Architecture

EventBook consists of three primary application components.

## Frontend

The frontend is a React application built using Vite.

The production frontend is compiled into static assets and served using NGINX.

The frontend communicates with the backend through the `/api/` path.

## Backend

The backend is a Node.js/Express API.

It provides:

* Authentication
* User registration
* Login
* JWT authentication
* Event management
* Event creation
* Event updates
* Event retrieval
* Event bookings
* User profile information
* Booking management
* Health checks
* Database connectivity checks

## PostgreSQL

PostgreSQL stores:

* Users
* Events
* Bookings

The database is deployed inside Kubernetes and uses persistent AWS EBS storage through a Kubernetes PersistentVolumeClaim.

---

# Repository Structure


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
│   ├── package.
│   ├── package-lock.
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
│   ├── package.
│   ├── package-lock.
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
│   │   └── secret.yaml
│   │
│   ├── frontend/
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   │
│   ├── postgres/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   ├── pvc.yaml
│   │   └── secret.yaml
│   │
│   ├── pdb/
│   │
│   └── network-policies/
│       ├── backend-policy.yaml
│       ├── frontend-policy.yaml
│       └── postgres-policy.yaml
│
└── terraform/
    ├── provider.tf
    ├── variables.tf
    ├── main.tf
    ├── terraform.tfvars
    ├── terraform.tfvars.example
    ├── outputs.tf
    └── eks.tf


---

# Application Features

## Authentication

Users can:

* Register
* Log in
* Receive a JWT token
* Access protected routes
* View their profile
* Log out

Passwords are hashed using bcrypt before being stored.

## Events

Authenticated users can create events containing:

* Event title
* Description
* Location
* Event date
* Capacity

Users can view available events and individual event details.

## Bookings

Authenticated users can book events.

The database enforces a unique user/event combination to prevent duplicate bookings.

---

# Local Development

## Prerequisites

The following tools are required:

* Node.js
* npm
* Git
* Docker
* Docker Compose
* PostgreSQL client
* Terraform
* AWS CLI
* kubectl
* Helm

## Clone the Repository


git clone https://github.com/emexayomide-max/Eventbook.git
cd Eventbook


## Install Backend Dependencies


cd backend
npm install


## Install Frontend Dependencies


cd ../frontend
npm install


## Run the Application

The backend can be started with:


cd backend
npm start


The frontend can be started with:


cd frontend
npm run dev


---

# Database

The PostgreSQL schema contains three main tables:


users
events
bookings


Relationships:


users
  │
  ├──────────────┐
  │              │
  ▼              ▼
events        bookings
                │
                ▼
              events


The database schema includes foreign keys and constraints to maintain data integrity.

---

# Docker Containerization

The application is containerized using Docker.

The backend uses a multi-stage Docker build.

The frontend uses a multi-stage build where:

1. Node.js builds the React application.
2. NGINX serves the generated production files.

---

# Backend Dockerfile

The backend Docker image uses:

dockerfile
FROM node:24-alpine


The image uses a dependency stage to install production dependencies before copying the application into the production image.

The final container runs as the non-root `node` user.

The production image also removes unnecessary npm and Corepack components to reduce the attack surface and eliminate vulnerabilities identified during image scanning.

---

# Frontend Dockerfile

The frontend uses:


Node.js build stage
        │
        ▼
React production build
        │
        ▼
NGINX production image


The production container runs NGINX as a non-root user.

NGINX listens on port `8080`.

---

# Docker Security

Security improvements implemented include:

* Multi-stage builds
* Alpine-based images
* Production-only backend dependencies
* Non-root containers
* Removal of unnecessary npm/Corepack components
* NGINX running without root privileges
* Reduced production image contents
* Trivy vulnerability scanning

The goal was to minimize unnecessary packages and reduce the attack surface of the production containers.

---

# Docker Compose

Docker Compose is used for local development.

The local stack contains:


postgres
backend
frontend


The services communicate through the Docker Compose network.

PostgreSQL uses a named Docker volume:


postgres_data


This allows database data to survive PostgreSQL container recreation.

---

# AWS Infrastructure

The application is deployed to AWS using Terraform.

The AWS infrastructure includes:

* Custom VPC
* Public subnets
* Private subnets
* Internet Gateway
* NAT Gateway
* Route tables
* Security groups
* Amazon EKS
* Managed node group
* Amazon EBS
* Amazon ECR
* IAM roles

AWS region:


us-east-1


---

# VPC Architecture

The project uses separate public and private subnets.


VPC
│
├── Public Subnet 1
│
├── Public Subnet 2
│
├── Private Subnet 1
│
└── Private Subnet 2


The EKS worker nodes are deployed in private subnets.

Public-facing traffic is handled through the Kubernetes ingress/load-balancing layer.

A NAT Gateway provides outbound internet access for private resources when required.

---

# Terraform

Terraform is used to provision the AWS infrastructure as Code.

The Terraform configuration manages:

* AWS provider
* VPC
* Subnets
* Route tables
* Internet Gateway
* NAT Gateway
* Security groups
* IAM roles
* EKS cluster
* EKS managed node group
* EBS CSI permissions
* EKS Pod Identity
* Cluster outputs

Typical Terraform workflow:


terraform init
terraform fmt
terraform validate
terraform plan
terraform apply


Infrastructure changes are reviewed using `terraform plan` before being applied.

---

# Amazon EKS

The Kubernetes cluster is:


eventbook-eks


Kubernetes version:


1.33


The managed node group uses:


Instance type: t3.small
Desired nodes: 2
Minimum nodes: 2
Maximum nodes: 3


The worker nodes run Amazon Linux 2023.

---

# Kubernetes Namespace

The application is deployed into:


eventbook


This provides isolation between EventBook workloads and other Kubernetes system components.

---

# Kubernetes Architecture

The Kubernetes workloads are:


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


---

# Kubernetes Deployments

## Frontend

The frontend runs multiple replicas to provide availability during Pod restarts and rolling updates.


2 frontend replicas


## Backend

The backend also runs multiple replicas:


2 backend replicas


This allows Kubernetes to perform rolling updates without taking the entire backend offline.

## PostgreSQL

PostgreSQL runs as a Kubernetes Deployment with persistent storage attached through a PersistentVolumeClaim.

---

# Kubernetes Services

The application uses ClusterIP Services for internal communication.


frontend
backend
postgres


The frontend communicates with the backend through the Kubernetes service.

The backend communicates with PostgreSQL through the PostgreSQL service.

---

# PostgreSQL Persistent Storage

PostgreSQL uses a Kubernetes PersistentVolumeClaim:


postgres-pvc


Storage:


5Gi


Access mode:


ReadWriteOnce


StorageClass:


gp2


The AWS EBS CSI driver provisions the underlying EBS volume.

The PostgreSQL container uses:


PGDATA=/var/lib/postgresql/data/pgdata


This avoids PostgreSQL initialization issues caused by the `lost+found` directory that can exist at the root of a newly mounted filesystem.

---

# Database Persistence Test

A PostgreSQL Pod was deliberately deleted to test Kubernetes self-healing and persistent storage.

Kubernetes recreated the PostgreSQL Pod.

Existing database records remained available after the replacement Pod started.

This verified that:


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


---

# Kubernetes Secrets

Sensitive configuration is stored using Kubernetes Secrets rather than being hardcoded directly into application manifests.

Sensitive values include:

* PostgreSQL password
* JWT secret
* Database credentials

Secret manifests containing actual credentials are not committed to the repository.

Template/example configuration is used where appropriate.

---

# Kubernetes Security

Security cons are configured for application workloads.

Containers are configured to run without unnecessary root privileges.

The project applies:

* Non-root containers
* `allowPrivilegeEscalation: false`
* Reduced Linux capabilities
* Read-only filesystem configuration where appropriate
* Resource limits
* Kubernetes Secrets
* IAM-based AWS access
* HTTPS/TLS

---

# Health Checks

The backend exposes:


GET /api/health


Example response:


{
  "status": "healthy",
  "service": "eventbook-backend"
}


This endpoint is used by Kubernetes liveness and readiness probes.

## Liveness Probe

The liveness probe determines whether the container is still functioning.

If the container becomes unhealthy, Kubernetes can restart it.

## Readiness Probe

The readiness probe determines whether the Pod should receive traffic.

This prevents Kubernetes from sending requests to a Pod that is not ready to serve the application.

---

# Resource Management

CPU and memory requests and limits are configured for the workloads.

## Backend


CPU request:    100m
CPU limit:      500m
Memory request: 128Mi
Memory limit:   512Mi


## Frontend


CPU request:    50m
CPU limit:      300m
Memory request: 64Mi
Memory limit:   256Mi


## PostgreSQL


CPU request:    100m
CPU limit:      500m
Memory request: 256Mi
Memory limit:   512Mi


Requests allow Kubernetes to make informed scheduling decisions.

Limits prevent individual containers from consuming unlimited resources.

---

# Rolling Updates

The frontend and backend deployments use rolling update strategies.

A deployment can be updated without immediately terminating all existing Pods.

Example:


kubectl rollout restart deployment/backend -n eventbook


The rollout can then be monitored using:


kubectl rollout status deployment/backend -n eventbook


Successful rolling updates were tested on both frontend and backend workloads.

---

# Self-Healing

Kubernetes self-healing was tested by deliberately deleting application Pods.

For example:


kubectl delete pod <pod-name> -n eventbook


Kubernetes automatically created replacement Pods.

This was tested with:

* Backend
* PostgreSQL

The replacement Pods became Ready and the application continued functioning.

---

# PodDisruptionBudgets

PodDisruptionBudgets are configured for highly available application workloads.

The purpose is to limit the number of application replicas that can be voluntarily disrupted at the same time.

This provides additional protection during maintenance operations and node disruptions.

---

# Ingress

The project uses the NGINX Ingress Controller.

Ingress routes external HTTP/HTTPS traffic into the Kubernetes services.

The architecture is:


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


---

# DNS

The production domain is:


eventbook.name.ng


The production application is currently served through:


www.eventbook.name.ng


The `www` DNS record points to the AWS load-balancing endpoint used by the NGINX Ingress Controller.

---

# HTTPS and TLS

HTTPS is implemented using:

* cert-manager
* Let's Encrypt
* NGINX Ingress

The certificate is managed by cert-manager.

The Kubernetes Ingress references the TLS secret:


eventbook-tls


HTTPS is available at:


https://www.eventbook.name.ng


HTTP requests are handled by the ingress layer and HTTPS is used for secure production access.

---

# cert-manager

cert-manager automates TLS certificate management.

The project uses a Let's Encrypt ClusterIssuer:


letsencrypt-prod


The ACME HTTP-01 challenge is handled through the NGINX Ingress Controller.

The certificate was successfully issued and verified.

---

# Amazon ECR

Container images are stored in Amazon Elastic Container Registry.

Repositories:


eventbook-backend
eventbook-frontend


Images are tagged using Git commit SHA values.

Example:


eventbook-backend:<git-sha>
eventbook-frontend:<git-sha>


Using immutable Git SHA tags provides traceability between source code and deployed containers.

---

# CI/CD Pipeline

GitHub Actions automates the application delivery process.

The pipeline performs:


Git Push
   │
   ▼
GitHub Actions
   │
   ├── Install dependencies
   ├── Run frontend build
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
   └── Verify deployed images


---

# CI Pipeline

The build and validation stage performs:

* Repository checkout
* Node.js setup
* Backend dependency installation
* Frontend dependency installation
* Frontend production build
* Terraform formatting
* Terraform initialization
* Terraform validation
* Docker image builds
* Trivy vulnerability scans

---

# Continuous Deployment

When changes are pushed to the `main` branch:

1. GitHub Actions authenticates to AWS.
2. Docker images are built.
3. Images are pushed to Amazon ECR.
4. Kubernetes deployment images are updated.
5. Kubernetes performs rolling updates.
6. GitHub Actions waits for successful rollouts.
7. The deployed image SHA is verified.

---

# GitHub OIDC

GitHub Actions uses OpenID Connect to authenticate with AWS.

Long-lived AWS access keys are not stored inside GitHub Actions.

Instead:


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

---

# Security Scanning

Trivy is used to scan container images for vulnerabilities.

The CI pipeline scans for:

* HIGH vulnerabilities
* CRITICAL vulnerabilities

The Docker images were hardened based on scan results.

Unnecessary packages such as npm/Corepack components were removed from the production backend image where appropriate.

The frontend production image also applies Alpine package upgrades to address vulnerable system packages.

---

# Monitoring and Observability

The project includes Kubernetes-native monitoring and observability.

## Metrics Server

Metrics Server was installed into the EKS cluster.

The Metrics API was verified:


v1beta1.metrics.k8s.io
AVAILABLE: True


This enables commands such as:


kubectl top nodes


and:


kubectl top pods -n eventbook


---

# Resource Monitoring

Current Kubernetes monitoring provides CPU and memory visibility for:

* EKS nodes
* Backend Pods
* Frontend Pods
* PostgreSQL
* Kubernetes system components

Example:


kubectl top nodes
kubectl top pods -n eventbook
kubectl top pods -n kube-system


This provides a lightweight operational view of cluster resource consumption.

---

# Application Logging

Kubernetes container logs can be inspected using:


kubectl logs deployment/backend -n eventbook


and:


kubectl logs deployment/postgres -n eventbook


Backend logging confirms application startup and runtime status.

PostgreSQL logs confirm:

* Database startup
* Database readiness
* Database connections
* Checkpoints
* Persistent database initialization behavior

---

# Prometheus and Grafana Monitoring

The monitoring architecture is designed to be extended with Prometheus and Grafana.

Prometheus provides metrics collection and storage, while Grafana provides dashboards and visualization.

The intended monitoring architecture is:


Kubernetes
    │
    ├── Node Metrics
    ├── Pod Metrics
    ├── Container Metrics
    └── Application Metrics
             │
             ▼
         Prometheus
             │
             ▼
          Grafana
             │
             ├── Node Dashboard
             ├── Pod Dashboard
             ├── Application Dashboard
             ├── CPU Dashboard
             ├── Memory Dashboard
             └── Availability Dashboard


The current cluster already has Metrics Server and Kubernetes-native observability in place, providing the foundation for a full Prometheus/Grafana monitoring stack.

---

# Reliability Testing

The project was tested against several failure scenarios.

## Backend Pod Failure

A backend Pod was deliberately deleted.

Expected behavior:


Backend Pod deleted
       │
       ▼
Deployment detects missing replica
       │
       ▼
Replacement Pod created
       │
       ▼
Readiness probe passes
       │
       ▼
Backend available again


The test passed successfully.

---

# Frontend Rolling Update Test

The frontend Deployment was restarted using:


kubectl rollout restart deployment/frontend -n eventbook


The rollout completed successfully.

The frontend continued running with multiple replicas.

---

# Backend Rolling Update Test

The backend Deployment was restarted using:


kubectl rollout restart deployment/backend -n eventbook


The rollout completed successfully.

The new Pods became Ready while Kubernetes terminated the old Pods.

---

# PostgreSQL Failure Test

The PostgreSQL Pod was deliberately deleted.

Kubernetes recreated the Pod.

The existing database records remained available after the replacement Pod started.

This verified:

* Kubernetes self-healing
* PostgreSQL persistent storage
* EBS-backed persistence
* Database data durability across Pod recreation

---

# Database Validation

The application database was tested through the backend API and directly through PostgreSQL.

The database successfully stored:

* Users
* Events
* Bookings

Database constraints prevent invalid relationships and duplicate user/event bookings.

---

# Network Security

Kubernetes NetworkPolicy manifests were created for:

* Backend
* Frontend
* PostgreSQL

The intended communication model is:


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


The manifests document the desired network segmentation between application tiers.

The current EKS VPC CNI configuration does not have network-policy enforcement enabled, so these policies are treated as configuration for the intended security model rather than claiming active enforcement.

This distinction is documented deliberately to ensure the deployment documentation accurately reflects the running infrastructure.

---

# Environment Variables

Sensitive environment variables are not committed to Git.

Examples are provided through:


backend/.env.example


The production Kubernetes configuration uses Kubernetes Secrets.

Typical backend configuration includes:


PORT
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
JWT_SECRET


---

# Security Practices

The project applies security practices across multiple layers.

## Application

* Password hashing using bcrypt
* JWT authentication
* Protected API routes
* Input validation through application logic
* Database constraints

## Docker

* Multi-stage builds
* Minimal Alpine images
* Non-root containers
* Production dependencies only
* Vulnerability scanning
* Reduced image attack surface

## Kubernetes

* Non-root security cons
* Resource limits
* Resource requests
* Liveness probes
* Readiness probes
* Secrets
* PodDisruptionBudgets
* NetworkPolicy configuration

## AWS

* IAM roles
* EKS Pod Identity
* GitHub OIDC
* Private worker subnets
* ECR
* EBS CSI
* Security groups

## Network

* NGINX Ingress
* HTTPS
* TLS certificates
* Let's Encrypt
* Custom domain

---

# AWS IAM and EKS Pod Identity

AWS permissions are managed using IAM roles rather than hardcoded AWS credentials.

The EKS node role provides required permissions for:

* EKS worker nodes
* ECR image pulls
* VPC networking

The EBS CSI driver uses an IAM role through EKS Pod Identity.

This allows the CSI driver to manage EBS volumes without embedding AWS credentials inside containers.

---

# Deployment Workflow

The complete deployment workflow is:


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


---

# Deployment Verification

After deployment, Kubernetes rollouts are verified using:


kubectl rollout status deployment/backend -n eventbook


and:


kubectl rollout status deployment/frontend -n eventbook


The deployed image can be verified using:


kubectl get deployment backend \
  -n eventbook \
  -o path='{.spec.template.spec.containers[0].image}'


and:


kubectl get deployment frontend \
  -n eventbook \
  -o path='{.spec.template.spec.containers[0].image}'


---

# Useful Kubernetes Commands

## Check all EventBook resources


kubectl get all -n eventbook


## Check Pods


kubectl get pods -n eventbook


## Check Services


kubectl get svc -n eventbook


## Check Deployments


kubectl get deployments -n eventbook


## Check Ingress


kubectl get ingress -n eventbook


## Check PVC


kubectl get pvc -n eventbook


## Check Pod resource usage


kubectl top pods -n eventbook


## Check node resource usage


kubectl top nodes


## View logs


kubectl logs deployment/backend -n eventbook


## Describe a Pod


kubectl describe pod <pod-name> -n eventbook


## Check rollout


kubectl rollout status deployment/backend -n eventbook


## Restart a deployment


kubectl rollout restart deployment/backend -n eventbook


## Roll back a deployment


kubectl rollout undo deployment/backend -n eventbook


---

# Useful Terraform Commands

Initialize Terraform:


terraform init


Format configuration:


terraform fmt


Validate configuration:


terraform validate


Review infrastructure changes:


terraform plan


Apply infrastructure:


terraform apply


View Terraform outputs:


terraform output


---

# Troubleshooting Approach

The project uses a layered troubleshooting approach.

## 1. Application

Check application logs:


kubectl logs deployment/backend -n eventbook


## 2. Pod

Check Pod state:


kubectl get pods -n eventbook


## 3. Deployment

Check rollout:


kubectl rollout status deployment/backend -n eventbook


## 4. Service

Check service configuration:


kubectl get svc -n eventbook

## 5. Ingress

Check ingress:


kubectl get ingress -n eventbook

## 6. DNS

Verify the domain resolves to the expected endpoint.

## 7. TLS

Verify HTTPS:


curl -I https://www.eventbook.name.ng


## 8. Infrastructure

Use Terraform and AWS CLI to inspect AWS infrastructure.

This layered approach helps isolate whether an issue is caused by the application, container, Kubernetes workload, service networking, ingress, DNS, or AWS infrastructure.

---

# Production URL

The deployed application is available at:

*https://www.eventbook.name.ng*

The backend health endpoint is available through:


https://www.eventbook.name.ng/api/health


Expected response:

{
  "status": "healthy",
  "service": "eventbook-backend"
}


---

# CI/CD Security Model

The GitHub Actions deployment does not depend on permanent AWS access keys.

The workflow uses:

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


# Lessons Learned

This project provided practical experience with several important DevOps concepts.

## Infrastructure as Code

Terraform makes infrastructure reproducible and allows infrastructure changes to be reviewed before application.

## Kubernetes

Kubernetes provides:

* Scheduling
* Service discovery
* Self-healing
* Rolling deployments
* Health checks
* Resource management
* Persistent storage

## Container Security

Running production containers as root unnecessarily increases risk.

Using non-root users and smaller production images reduces the container attack surface.

## CI/CD

Automating image creation, security scanning, publishing, deployment, and rollout verification reduces manual deployment errors.

## Immutable Image Tags

Using Git commit SHA tags provides a direct relationship between:


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

* A running container
* A healthy application
* A Pod that is ready to receive traffic

## Observability

Metrics and logs are essential for operating applications in production.

Metrics Server provides the foundation for monitoring Kubernetes resource consumption, while application logs provide visibility into runtime behavior.

---

# Future Improvements

The project architecture can be extended further with:

* Prometheus
* Grafana
* Alertmanager
* Application-level metrics
* Centralized logging
* Distributed tracing
* More comprehensive NetworkPolicy enforcement
* Automated database backups
* PostgreSQL high availability
* Horizontal Pod Autoscaling
* Cluster Autoscaling
* AWS WAF
* CloudFront
* Route 53 DNS management
* Automated disaster recovery
* Performance testing
* Load testing
* Cost optimization
* Blue/green or canary deployments

---

# Project Outcome

EventBook demonstrates an end-to-end DevOps implementation around a real full-stack application.

The project covers:


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
        ├── Security Cons
        └── Ingress
        │
        ▼
DNS + HTTPS
        │
        ▼
GitHub Actions
        │
        ▼
ECR
        │
        ▼
Automated EKS Deployment
        │
        ▼
Reliability Testing
        │
        ▼
Metrics + Logs


The application has been successfully containerized, secured, provisioned on AWS using Terraform, deployed to Amazon EKS, exposed through an HTTPS-enabled custom domain, automated through GitHub Actions, and tested for Kubernetes self-healing, rolling updates, and persistent database storage.

The project demonstrates practical DevOps experience across **development, containerization, infrastructure as code, cloud infrastructure, Kubernetes, security, CI/CD, networking, TLS, storage, reliability, and observability**.
