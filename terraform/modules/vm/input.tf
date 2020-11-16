
# Azure GUIDS
variable "subscription_id" {
     default = "ef797a3b-ebc6-4c45-a0f0-817c4447b0ef"
}
variable "client_id" {
     default = "8da73fa4-60ba-484f-b3bc-e0761a8a6480"
}
variable "client_secret" {
     default = "pW)l_biJ:dD2'~5PS,T~GB8dY{zc!ine"
}
variable "tenant_id" {
     default = "550891b3-ec22-47bc-9c7e-0c2627b81592"
}

# Resource Group/Location
variable "location" {
     default = "eastus"
}
variable "resource_group" {
     default =  "azuredevopsresource1"
}
variable "application_type" {
     default = "webapp-api"
}

# Network
variable virtual_network_name {
     default = "azuredevopsnetwork"
}
variable address_prefix_test {
     default = ["10.5.1.0/24"]
}
variable address_space {
     default = ["10.5.0.0/16"]
}
