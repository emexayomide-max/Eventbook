
# ------------------------------------------------------------
# EKS Cluster IAM Role
# ------------------------------------------------------------

resource "aws_iam_role" "eventbook_eks_cluster_role" {
  name = "EventBook-EKS-Cluster-Role"

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
    Project     = "EventBook"
    Environment = "development"
  }
}

resource "aws_iam_role_policy_attachment" "eventbook_eks_cluster_policy" {
  role       = aws_iam_role.eventbook_eks_cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}


# ------------------------------------------------------------
# EKS Node Group IAM Role
# ------------------------------------------------------------

resource "aws_iam_role" "eventbook_eks_node_role" {
  name = "EventBook-EKS-Node-Role"

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
    Project     = "EventBook"
    Environment = "development"
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

resource "aws_iam_role_policy_attachment" "eventbook_eks_ecr_read_only_policy" {
  role       = aws_iam_role.eventbook_eks_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}


# ------------------------------------------------------------
# EKS Cluster
# ------------------------------------------------------------

resource "aws_eks_cluster" "eventbook_eks" {
  name     = "eventbook-eks"
  role_arn = aws_iam_role.eventbook_eks_cluster_role.arn

  version = "1.33"

  vpc_config {
    subnet_ids = [
      aws_subnet.eventbook_private_subnet_1.id,
      aws_subnet.eventbook_private_subnet_2.id,
      aws_subnet.eventbook_public_subnet_1.id,
      aws_subnet.eventbook_public_subnet_2.id
    ]

    endpoint_private_access = true
    endpoint_public_access  = true
  }

  depends_on = [
    aws_iam_role_policy_attachment.eventbook_eks_cluster_policy
  ]

  tags = {
    Name        = "eventbook-eks"
    Project     = "EventBook"
    Environment = "development"
  }
}


# ------------------------------------------------------------
# EKS Managed Node Group
# ------------------------------------------------------------

resource "aws_eks_node_group" "eventbook_nodes" {
  cluster_name    = aws_eks_cluster.eventbook_eks.name
  node_group_name = "eventbook-node-group"
  node_role_arn   = aws_iam_role.eventbook_eks_node_role.arn

  subnet_ids = [
    aws_subnet.eventbook_private_subnet_1.id,
    aws_subnet.eventbook_private_subnet_2.id
  ]

  instance_types = ["t3.small"]

  capacity_type = "ON_DEMAND"

  scaling_config {
    desired_size = 2
    min_size     = 2
    max_size     = 3
  }

  update_config {
    max_unavailable = 1
  }

  depends_on = [
    aws_iam_role_policy_attachment.eventbook_eks_worker_node_policy,
    aws_iam_role_policy_attachment.eventbook_eks_cni_policy,
    aws_iam_role_policy_attachment.eventbook_eks_ecr_read_only_policy
  ]

  tags = {
    Name        = "eventbook-eks-node"
    Project     = "EventBook"
    Environment = "development"
  }
}

resource "aws_iam_role_policy" "eventbook_eks_pod_identity_agent" {
  name = "EventBook-EKS-Pod-Identity-Agent"
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

resource "aws_iam_role" "eventbook_ebs_csi_role" {
  name = "EventBook-EBS-CSI-Role"

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
    Name        = "EventBook-EBS-CSI-Role"
    Project     = "EventBook"
    Environment = "development"
  }
}

resource "aws_iam_role_policy_attachment" "eventbook_ebs_csi_policy" {
  role       = aws_iam_role.eventbook_ebs_csi_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEBSCSIDriverPolicyV2"
}

resource "aws_eks_pod_identity_association" "eventbook_ebs_csi" {
  cluster_name    = aws_eks_cluster.eventbook_eks.name
  namespace       = "kube-system"
  service_account = "ebs-csi-controller-sa"
  role_arn        = aws_iam_role.eventbook_ebs_csi_role.arn
}