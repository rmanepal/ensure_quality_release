# #!/usr/bin/env python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
from datetime import datetime

log_index = 100
items_added_to_cart = []
items_removed_from_cart = []

def info(msg):
    global log_index
    log_index = log_index + 1
    print('{}, {}, {}, {}'.format(datetime.now(), log_index , 'INFO', msg))


def debug(msg):
    global log_index
    log_index = log_index + 1
    print('{}, {}, {}, {}'.format(datetime.now(), ++log_index, 'DEBUG', msg))


USERNAME = 'standard_user'
PASSWORD = 'secret_sauce'

INVENTORY_ITEM = 'inventory_item'

# Start the browser and login with standard_user
def login (user, password):
    info ('Starting the browser...')
    chrome_options = ChromeOptions()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome("/home/azureuser/chromedriver", options=chrome_options)
    info ('Browser started successfully. Navigating to the demo page to login.')
    driver.get('https://www.saucedemo.com/')

    info("login as user: {}".format(user))
    driver.find_element_by_css_selector("input[id='user-name']").send_keys("standard_user")
    driver.find_element_by_css_selector("input[id='password']").send_keys('secret_sauce')
    driver.find_element_by_css_selector("input[id='login-button']").click()

    info(" logged in successfully")
    return driver

# add items to cart
def add_all_elements_to_cart(element_name, driver):
    info(" get All elements by name: {}".format(element_name))
    elements = driver.find_elements_by_class_name(element_name)

    info(" Total number of items need to be added to cart:{}".format(len(elements)))

    for e in elements:
        debug(str(' adding items: {}').format(str(e.text).split('\n')[0]))
        items_added_to_cart.append(str(e.text).split('\n')[0])
        item = e.find_element_by_css_selector("div[class='pricebar']")
        add_to_cart_button = item.find_element_by_css_selector("button[class='btn_primary btn_inventory']")
        add_to_cart_button.click()
        debug(' items added to the cart are {}:'.format(items_added_to_cart))

    info(" All items are added to cart: {}".format(len(elements)))

# remove items from cart
def remove_all_elements_from_cart(element_name, driver):

    info(" remove all elements from cart: {}".format(element_name))
    elements = driver.find_elements_by_class_name(element_name)

    info(" Total number of items to be remove from cart:{}".format(len(elements)))

    for e in elements:
        debug(str(' removing items: {}').format(str(e.text).split('\n')[0]))
        items_removed_from_cart.append(str(e.text).split('\n')[0])
        item = e.find_element_by_css_selector("div[class='pricebar']")
        add_to_cart_button = item.find_element_by_css_selector("button[class='btn_secondary btn_inventory']")
        add_to_cart_button.click()
        debug(' items removed from the cart are {}:'.format(items_removed_from_cart))
    
    info(" All items are removed from cart: {}".format(len(elements)))

info(" login test")
driver_login = login(USERNAME, PASSWORD)
info("login successful")

info(" go through invetory items")
info('-------------------- ADD ITEMS TO CART START---------------------------')
add_all_elements_to_cart(element_name=INVENTORY_ITEM, driver=driver_login)
info('-------------------- ADD ITEMS TO CART DONE---------------------------')
info('-------------------- REMOVE ITEMS TO CART START---------------------------')
remove_all_elements_from_cart(element_name=INVENTORY_ITEM, driver=driver_login)
info('-------------------- REMOVE ITEMS TO CART DONE---------------------------')
