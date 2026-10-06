variable "aws_region" {
  description = "AWS region where EventBook infrastructure will be deployed"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "CIDR block for the EventBook VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for the first public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "public_subnet_2_cidr" {
  description = "CIDR block for the second public subnet"
  type        = string
  default     = "10.0.2.0/24"
}

variable "private_subnet_1_cidr" {
  description = "CIDR block for the first private subnet"
  type        = string
  default     = "10.0.10.0/24"
}

variable "private_subnet_2_cidr" {
  description = "CIDR block for the second private subnet"
  type        = string
  default     = "10.0.11.0/24"
}

variable "availability_zone" {
  description = "First Availability Zone"
  type        = string
  default     = "us-east-1a"
}

variable "availability_zone_2" {
  description = "Second Availability Zone"
  type        = string
  default     = "us-east-1b"
}

variable "admin_ip" {
  description = "Public IP address allowed to access SSH"
  type        = string
}

variable "ami_id" {
  description = "AMI ID for the EC2 instance"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Existing EC2 key pair name"
  type        = string
}

variable "project_name" {
  description = "Project name used for AWS resource naming and tagging"
  type        = string
  default     = "EventBook"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "development"
}

variable "eks_cluster_role_name" {
  description = "IAM role name for the EKS control plane"
  type        = string
  default     = "EventBook-EKS-Cluster-Role"
}

variable "eks_node_role_name" {
  description = "IAM role name for EKS worker nodes"
  type        = string
  default     = "EventBook-EKS-Node-Role"
}

variable "eks_cluster_name" {
  description = "Name of the EventBook EKS cluster"
  type        = string
  default     = "eventbook-eks"
}

variable "eks_version" {
  description = "Kubernetes version for the EKS cluster"
  type        = string
  default     = "1.33"
}

variable "eks_node_group_name" {
  description = "Name of the EKS managed node group"
  type        = string
  default     = "eventbook-node-group"
}

variable "eks_instance_types" {
  description = "EC2 instance types used by the EKS node group"
  type        = list(string)
  default     = ["t3.small"]
}

variable "eks_capacity_type" {
  description = "EKS node group capacity type"
  type        = string
  default     = "ON_DEMAND"
}

variable "eks_desired_size" {
  description = "Desired number of EKS worker nodes"
  type        = number
  default     = 2
}

variable "eks_min_size" {
  description = "Minimum number of EKS worker nodes"
  type        = number
  default     = 2
}

variable "eks_max_size" {
  description = "Maximum number of EKS worker nodes"
  type        = number
  default     = 3
}

variable "eks_max_unavailable" {
  description = "Maximum number of unavailable nodes during an update"
  type        = number
  default     = 1
}

variable "eks_endpoint_private_access" {
  description = "Enable private access to the EKS API endpoint"
  type        = bool
  default     = true
}

variable "eks_endpoint_public_access" {
  description = "Enable public access to the EKS API endpoint"
  type        = bool
  default     = true
}