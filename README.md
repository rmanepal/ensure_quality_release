

# Overview 

Project - CI/CD project covers the following.

	Iaas - Bring up the following using terraform 
	
	        1. Linux VM 
			2. App Service 
			3. Others supporting infrastructure (Network, Network security group, resource groups)
	
	
	Web App: Provided fakerestapi app deployed as package.
	        
			1. created zip file from the provided folder 
			2. Deploy into the AppService from package
	
	
	Seleinum tests: Automate UI tests using selenium 
	
	        Website url: https://www.saucedemo.com/
			
			1. Login 
			2. Add all items to cart
			3. Remove all items from cart
	
	Postman tests: Automate rest api calls 
			
			Website url: http://dummy.restapiexample.com
			
			1. GET request
			2. POST request
	
	JMeter tests: Performance tests 
	
			Website url: (app service) webapp-api-appservice.azurewebsites.net
			
			1. Endurance tests 
			2. Stress tests 

			10 users, covering 48 tests 
	
	terraform: deploy the infrastructure
	
			1. Create backend storage and resource group   
			2. Create resource group for deployment 
			3. Create Linux VM, App Service, network, nsg
			4. Linux VM:
				1. Copy rsa keys 
				2. Able to ssh to azure VM using from local machine 
				3. register agent script with PAT
			
	
Architecture of the project:

![Optional Text](./resources/arch.png)


Instrcutions to run:

	Terraform deploy

		Using Azure release pipeline, deploy the terraform.
			
			1. update inputs in terraform/environments/test/terraform.tfvars
			2. Run release pipeline.

		![Optional Text](./resources/terraform_deploy.png)


			It shall create app services in azure

		![Optional Text](./resources/azure_app_resources.png)

		![Optional Text](./resources/myLinuxVM.png)
		
		![Optional Text](./resouces/ssh_to_linux_vm.png)
		
		Also updates the envionment in azure pipelines with myLinuxVM
		
		![Optional Text](./resources/environment.png)
		
		
	
	Azure Pipeline: azure-pipelines-4.yaml
	
		Build:
			1. run postman tests and updates the tests Runs
			
		![Optional Text](./resources/postman_test_runs.png)
		
			2. Double click one of the tests runs
			
		![Optional Text](./resouces/postman_test_summary.png)
		
		
		Deploy:
		
			1. deploy the webapp into app service 
			
		![Optional Text](./resouces/fake_rest_api.png)
		
			2. run Jmeter integration tests 
			
		![Optional Text](./resouces/all_tests_ran.png)
		
			3. run Seleinum tests on linux VM 
		
		![Optional Text}(./resouces/selenium_tests.png)
	
	
		Succesfull build and deployement
		
		![Optional Text](./resouces/build_and_deploy.png)
		
	
	Others:
	
		Jmeter Performance tests:
		
		![Optional Text](./resouces/jmeter_tests_html.png)
		
		Log analytics
		
		![Optional Text](./resources/log_analytics.png)
		
		
		
	
			


