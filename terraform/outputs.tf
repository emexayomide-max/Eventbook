
# ============================================================
# VPC OUTPUT
# ============================================================

output "vpc_id" {
  description = "ID of the EventBook VPC"
  value       = aws_vpc.eventbook_vpc.id
}


# ============================================================
# PUBLIC SUBNET OUTPUTS
# ============================================================

output "public_subnet_1_id" {
  description = "ID of the EventBook first public subnet"
  value       = aws_subnet.eventbook_public_subnet_1.id
}

output "public_subnet_2_id" {
  description = "ID of the EventBook second public subnet"
  value       = aws_subnet.eventbook_public_subnet_2.id
}


# ============================================================
# PRIVATE SUBNET OUTPUTS
# ============================================================

output "private_subnet_1_id" {
  description = "ID of the EventBook first private subnet"
  value       = aws_subnet.eventbook_private_subnet_1.id
}

output "private_subnet_2_id" {
  description = "ID of the EventBook second private subnet"
  value       = aws_subnet.eventbook_private_subnet_2.id
}


# ============================================================
# NAT GATEWAY OUTPUT
# ============================================================

output "nat_gateway_id" {
  description = "ID of the EventBook NAT Gateway"
  value       = aws_nat_gateway.eventbook_nat.id
}


# ============================================================
# EC2 OUTPUTS
# ============================================================

output "security_group_id" {
  description = "ID of the EventBook EC2 security group"
  value       = aws_security_group.eventbook_security_group.id
}

output "ec2_instance_id" {
  description = "ID of the EventBook EC2 instance"
  value       = aws_instance.eventbook_server.id
}

output "ec2_public_ip" {
  description = "Public IP address of the EventBook EC2 instance"
  value       = aws_instance.eventbook_server.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS name of the EventBook EC2 instance"
  value       = aws_instance.eventbook_server.public_dns
}

