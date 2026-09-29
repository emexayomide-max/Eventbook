
# ============================================================
# VPC
# ============================================================

resource "aws_vpc" "eventbook_vpc" {
  cidr_block = var.vpc_cidr

  tags = {
    Name        = "eventbook-vpc"
    Project     = "EventBook"
    Environment = "development"
  }
}


# ============================================================
# PUBLIC SUBNETS
# ============================================================

resource "aws_subnet" "eventbook_public_subnet_1" {
  vpc_id                  = aws_vpc.eventbook_vpc.id
  cidr_block              = var.public_subnet_cidr
  availability_zone       = var.availability_zone
  map_public_ip_on_launch = true

  tags = {
    Name        = "eventbook-public-subnet-1"
    Project     = "EventBook"
    Environment = "development"
  }
}

resource "aws_subnet" "eventbook_public_subnet_2" {
  vpc_id                  = aws_vpc.eventbook_vpc.id
  cidr_block              = var.public_subnet_2_cidr
  availability_zone       = var.availability_zone_2
  map_public_ip_on_launch = true

  tags = {
    Name        = "eventbook-public-subnet-2"
    Project     = "EventBook"
    Environment = "development"
  }
}


# ============================================================
# PRIVATE SUBNETS
# ============================================================

resource "aws_subnet" "eventbook_private_subnet_1" {
  vpc_id            = aws_vpc.eventbook_vpc.id
  cidr_block        = var.private_subnet_1_cidr
  availability_zone = var.availability_zone

  tags = {
    Name        = "eventbook-private-subnet-1"
    Project     = "EventBook"
    Environment = "development"

    "kubernetes.io/role/internal-elb" = "1"
  }
}

resource "aws_subnet" "eventbook_private_subnet_2" {
  vpc_id            = aws_vpc.eventbook_vpc.id
  cidr_block        = var.private_subnet_2_cidr
  availability_zone = var.availability_zone_2

  tags = {
    Name        = "eventbook-private-subnet-2"
    Project     = "EventBook"
    Environment = "development"

    "kubernetes.io/role/internal-elb" = "1"
  }
}


# ============================================================
# INTERNET GATEWAY
# ============================================================

resource "aws_internet_gateway" "eventbook_igw" {
  vpc_id = aws_vpc.eventbook_vpc.id

  tags = {
    Name        = "eventbook-igw"
    Project     = "EventBook"
    Environment = "development"
  }
}


# ============================================================
# PUBLIC ROUTE TABLE
# ============================================================

resource "aws_route_table" "eventbook_public_route_table" {
  vpc_id = aws_vpc.eventbook_vpc.id

  tags = {
    Name        = "eventbook-public-route-table"
    Project     = "EventBook"
    Environment = "development"
  }
}

resource "aws_route" "eventbook_internet_route" {
  route_table_id         = aws_route_table.eventbook_public_route_table.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.eventbook_igw.id
}


# ============================================================
# PUBLIC ROUTE TABLE ASSOCIATIONS
# ============================================================

resource "aws_route_table_association" "eventbook_public_subnet_association" {
  subnet_id      = aws_subnet.eventbook_public_subnet_1.id
  route_table_id = aws_route_table.eventbook_public_route_table.id
}

resource "aws_route_table_association" "eventbook_public_subnet_2_association" {
  subnet_id      = aws_subnet.eventbook_public_subnet_2.id
  route_table_id = aws_route_table.eventbook_public_route_table.id
}


# ============================================================
# NAT GATEWAY
# ============================================================

resource "aws_eip" "eventbook_nat_eip" {
  domain = "vpc"

  tags = {
    Name        = "eventbook-nat-eip"
    Project     = "EventBook"
    Environment = "development"
  }
}

resource "aws_nat_gateway" "eventbook_nat" {
  allocation_id = aws_eip.eventbook_nat_eip.id
  subnet_id     = aws_subnet.eventbook_public_subnet_1.id

  depends_on = [
    aws_internet_gateway.eventbook_igw
  ]

  tags = {
    Name        = "eventbook-nat"
    Project     = "EventBook"
    Environment = "development"
  }
}


# ============================================================
# PRIVATE ROUTE TABLE
# ============================================================

resource "aws_route_table" "eventbook_private_route_table" {
  vpc_id = aws_vpc.eventbook_vpc.id

  tags = {
    Name        = "eventbook-private-route-table"
    Project     = "EventBook"
    Environment = "development"
  }
}

resource "aws_route" "eventbook_private_internet_route" {
  route_table_id         = aws_route_table.eventbook_private_route_table.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.eventbook_nat.id
}


# ============================================================
# PRIVATE ROUTE TABLE ASSOCIATIONS
# ============================================================

resource "aws_route_table_association" "eventbook_private_subnet_1_association" {
  subnet_id      = aws_subnet.eventbook_private_subnet_1.id
  route_table_id = aws_route_table.eventbook_private_route_table.id
}

resource "aws_route_table_association" "eventbook_private_subnet_2_association" {
  subnet_id      = aws_subnet.eventbook_private_subnet_2.id
  route_table_id = aws_route_table.eventbook_private_route_table.id
}


# ============================================================
# EC2 SECURITY GROUP
# ============================================================

resource "aws_security_group" "eventbook_security_group" {
  name        = "eventbook-security-group"
  description = "Security group for EventBook EC2 instance"
  vpc_id      = aws_vpc.eventbook_vpc.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.admin_ip]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Backend API"
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "eventbook-security-group"
    Project     = "EventBook"
    Environment = "development"
  }
}


# ============================================================
# EXISTING EC2 INSTANCE
# ============================================================

resource "aws_instance" "eventbook_server" {
  ami                         = var.ami_id
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.eventbook_public_subnet_1.id
  vpc_security_group_ids      = [aws_security_group.eventbook_security_group.id]
  key_name                    = var.key_name
  associate_public_ip_address = false

  tags = {
    Name        = "eventbook-server"
    Project     = "EventBook"
    Environment = "development"
  }
}
