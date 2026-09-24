output "vpc_id" {
  description = "ID of the EventBook VPC"
  value       = aws_vpc.eventbook_vpc.id
}

output "public_subnet_id" {
  description = "ID of the EventBook public subnet"
  value       = aws_subnet.eventbook_public_subnet.id
}

output "security_group_id" {
  description = "ID of the EventBook security group"
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

