# List of value to be outputed after infrastructure creation
output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.app_server.id
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance associated to EIP"
  value       = aws_eip.telescope_eip.public_ip
}

output "instance_dns_ip" {
  description = "Public DNS of the EC2 instance associated to EIP"
  value       = aws_eip.telescope_eip.public_dns
}
