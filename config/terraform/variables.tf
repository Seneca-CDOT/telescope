# List of variable required
# Can either be prompt or passed from a .tfvar file
variable "access_key" {
  type        = string
  sensitive   = true
  description = "AWS Access Key"

}

variable "secret_key" {
  type        = string
  sensitive   = true
  description = "AWS Secret Key"
}

variable "access_token" {
  type        = string
  sensitive   = true
  description = "AWS Access Token"
}

variable "ssh_public_key" {
  type        = string
  sensitive   = true
  description = "SSH key"
}

variable "ssh_public_key_name" {
  default     = "telescope-key"
  type        = string
  description = "SSH key name"
}

variable "region" {
  default     = "us-east-1"
  type        = string
  description = "AWS Region"
}
