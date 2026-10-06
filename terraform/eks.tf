# ------------------------------------------------------------
# EKS Cluster IAM Role
# ------------------------------------------------------------

resource "aws_iam_role" "eventbook_eks_cluster_role" {
  name = var.eks_cluster_role_name

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "eventbook_eks_cluster_policy" {
  role       = aws_iam_role.eventbook_eks_cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

# ------------------------------------------------------------
# EKS Node IAM Role
# ------------------------------------------------------------

resource "aws_iam_role" "eventbook_eks_node_role" {
  name = var.eks_node_role_name

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "eventbook_eks_worker_node_policy" {
  role       = aws_iam_role.eventbook_eks_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
}

resource "aws_iam_role_policy_attachment" "eventbook_eks_cni_policy" {
  role       = aws_iam_role.eventbook_eks_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
}

resource "aws_iam_role_policy_attachment" "eventbook_eks_ecr_policy" {
  role       = aws_iam_role.eventbook_eks_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

# ------------------------------------------------------------
# EKS Cluster
# ------------------------------------------------------------

resource "aws_eks_cluster" "eventbook_eks" {
  name     = var.eks_cluster_name
  role_arn = aws_iam_role.eventbook_eks_cluster_role.arn
  version  = var.eks_version

  vpc_config {
    subnet_ids = [
      aws_subnet.eventbook_public_subnet_1.id,
      aws_subnet.eventbook_public_subnet_2.id
    ]

    endpoint_private_access = var.eks_endpoint_private_access
    endpoint_public_access  = var.eks_endpoint_public_access
  }

  depends_on = [
    aws_iam_role_policy_attachment.eventbook_eks_cluster_policy
  ]

  tags = {
    Name        = var.eks_cluster_name
    Project     = var.project_name
    Environment = var.environment
  }
}

# ------------------------------------------------------------
# EKS Managed Node Group
# ------------------------------------------------------------

resource "aws_eks_node_group" "eventbook_nodes" {
  cluster_name    = aws_eks_cluster.eventbook_eks.name
  node_group_name = var.eks_node_group_name
  node_role_arn   = aws_iam_role.eventbook_eks_node_role.arn

  subnet_ids = [
    aws_subnet.eventbook_public_subnet_1.id,
    aws_subnet.eventbook_public_subnet_2.id
  ]

  instance_types = var.eks_instance_types
  capacity_type  = var.eks_capacity_type

  scaling_config {
    desired_size = var.eks_desired_size
    min_size     = var.eks_min_size
    max_size     = var.eks_max_size
  }

  update_config {
    max_unavailable = var.eks_max_unavailable
  }

  depends_on = [
    aws_iam_role_policy_attachment.eventbook_eks_worker_node_policy,
    aws_iam_role_policy_attachment.eventbook_eks_cni_policy,
    aws_iam_role_policy_attachment.eventbook_eks_ecr_policy
  ]

  tags = {
    Name        = var.eks_node_group_name
    Project     = var.project_name
    Environment = var.environment
  }
}

# ------------------------------------------------------------
# EKS Pod Identity Agent IAM Policy
# ------------------------------------------------------------

resource "aws_iam_role_policy" "eventbook_eks_pod_identity_agent" {
  name = "${var.project_name}-EKS-Pod-Identity-Agent"
  role = aws_iam_role.eventbook_eks_node_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "eks-auth:AssumeRoleForPodIdentity"
        ]
        Resource = "*"
      }
    ]
  })
}

# ------------------------------------------------------------
# EBS CSI Driver IAM Role
# ------------------------------------------------------------

resource "aws_iam_role" "eventbook_ebs_csi_role" {
  name = "${var.project_name}-EBS-CSI-Role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "pods.eks.amazonaws.com"
        }
        Action = [
          "sts:AssumeRole",
          "sts:TagSession"
        ]
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-EBS-CSI-Role"
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "eventbook_ebs_csi_policy" {
  role       = aws_iam_role.eventbook_ebs_csi_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
}