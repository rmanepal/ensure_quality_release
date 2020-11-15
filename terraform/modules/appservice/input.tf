# Resource Group/Location
variable "location" {
  default = "eastus"
}

variable "application_type" {
  default = "webapp/api"
  }

variable "resource_type" {
  default = "SystemAssigned"
}
variable "resource_group" {
  default = "azuredevopsresource"
}

# Tags
variable "tags" {
  default = "maps"
}