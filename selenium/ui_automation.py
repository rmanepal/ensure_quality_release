# #!/usr/bin/env python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By

USERNAME = 'standard_user'
PASSWORD = 'secret_sauce'

INVENTORY_ITEM = 'inventory_item'

# Start the browser and login with standard_user
def login (user, password):
    print ('Starting the browser...')
    chrome_options = ChromeOptions()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome("/home/azureuser/chromedriver", options=chrome_options)
    print ('Browser started successfully. Navigating to the demo page to login.')
    driver.get('https://www.saucedemo.com/')

    print("login as user: {}".format(user))
    driver.find_element_by_css_selector("input[id='user-name']").send_keys("standard_user")
    driver.find_element_by_css_selector("input[id='password']").send_keys('secret_sauce')
    driver.find_element_by_css_selector("input[id='login-button']").click()

    print(" logged in successfully")
    return driver

# add items to cart
def add_all_elements_to_cart(element_name, driver):
    print(" get All elements by name: {}".format(element_name))
    elements = driver.find_elements_by_class_name(element_name)

    print(" Total number of items:{}".format(len(elements)))

    for e in elements:
        print(e.text)
        item = e.find_element_by_css_selector("div[class='pricebar']")
        add_to_cart_button = item.find_element_by_css_selector("button[class='btn_primary btn_inventory']")
        add_to_cart_button.click()

    print(" All items are added to cart: {}".format(len(elements)))

# remove items from cart
def remove_all_elements_from_cart(element_name, driver):

    print(" remove all elements from cart: {}".format(element_name))
    elements = driver.find_elements_by_class_name(element_name)

    print(" Total number of items:{}".format(len(elements)))

    for e in elements:
        print(e.text)
        item = e.find_element_by_css_selector("div[class='pricebar']")
        add_to_cart_button = item.find_element_by_css_selector("button[class='btn_secondary btn_inventory']")
        add_to_cart_button.click()
    
        print(" All items are removed from cart: {}".format(len(elements)))

print(" login test")
driver_login = login(USERNAME, PASSWORD)
print("login successful")

print(" go through invetory items")
add_all_elements_to_cart(element_name=INVENTORY_ITEM, driver=driver_login)
remove_all_elements_from_cart(element_name=INVENTORY_ITEM, driver=driver_login)
