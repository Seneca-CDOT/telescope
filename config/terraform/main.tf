// Ressources providers
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
    http = {
      source  = "hashicorp/http"
      version = "2.1.0"
    }
  }

  required_version = ">= 0.14.9"
}

// Configure AWS provider
provider "aws" {
  region     = var.region
  access_key = var.access_key
  secret_key = var.secret_key
  token      = var.access_token
}

// Get IP with amazonaws checkip
data "http" "my_checkip" {
  url = "https://checkip.amazonaws.com/"
}

// Declare a local variable and change our my_checkip into ipv4
locals {
  my_public_ipv4 = "${chomp(data.http.my_checkip.body)}/32"
}

// Configure aws_instance (see https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance)
resource "aws_instance" "app_server" {
  ami                  = "ami-0c02fb55956c7d316"
  instance_type        = "t2.large"
  key_name             = var.ssh_public_key_name
  iam_instance_profile = "LabInstanceProfile"
  user_data            = file("../../tools/aws-userdata.sh")
  tags = {
    Name = "Telescope EC2"
  }
  root_block_device {
    volume_size = 20
  }
  vpc_security_group_ids = [aws_security_group.telescope_sg.id]
}

// Configure aws_eip (see https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eip)
resource "aws_eip" "telescope_eip" {
  vpc = true
}

// Configure aws_eip_association (see https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eip_association)
resource "aws_eip_association" "telescope_eip_assoc" {
  instance_id   = aws_instance.app_server.id
  allocation_id = aws_eip.telescope_eip.id
}

// Configure aws_security_group (see https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group)
resource "aws_security_group" "telescope_sg" {
  egress = [{
    cidr_blocks      = ["0.0.0.0/0"]
    description      = ""
    from_port        = 0
    ipv6_cidr_blocks = []
    prefix_list_ids  = []
    protocol         = "-1"
    security_groups  = []
    self             = false
    to_port          = 0
  }]

  ingress = [{
    cidr_blocks      = [local.my_public_ipv4]
    description      = "SSH port"
    from_port        = 22
    ipv6_cidr_blocks = []
    prefix_list_ids  = []
    protocol         = "tcp"
    security_groups  = []
    self             = false
    to_port          = 22
    }, {
    cidr_blocks      = [local.my_public_ipv4]
    description      = "Open port 8000"
    from_port        = 8000
    ipv6_cidr_blocks = []
    prefix_list_ids  = []
    protocol         = "tcp"
    security_groups  = []
    self             = false
    to_port          = 8000
  }]
}

// Configure aws_key_pair (see https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/key_pair)
resource "aws_key_pair" "deployer" {
  key_name   = var.ssh_public_key_name
  public_key = var.ssh_public_key
}
