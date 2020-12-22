# Lock Book: Password generator and keeper.

With Lock Book you have the power to:

- Generate unlimited 16 digit secure and unique passwords.
- Save your newly generated/old passwords in a personalized space. (Key holder)
- Safe access to your secured passwords. Even in public spaces. (Credentials are hidden from prying eyes, surveillance cameras)


## Description of main functionalities:

### Password generation

At the home page of the web site, any user(including anonymous ones) can generate secure 16 digit passwords. Password is visible in a password-box. Every password generated is unique in itself and contains a mix of Upper and lower case alphabets, digits and allowed special characters. Backend algorithm ensures that each password generated must contain at least one lower-case alphabet , uppercase alphabet, digit and a special character.

Two buttons are provided below the password-box for additional functionality.

- Regenerate button: 
[Access: login-not-required]

	Used to regenerate a new password. Javascript Fetch API makes a GET request to server to get the new password.

- Save button: 
[Access: login-required]

	Used to save the current shown password or save a custom password of your liking. This functionality is only available to registered users who are logged into their account. When a user click on the save button a bootstrap modal pops-up where user can enter his details, it is important to note that password column would be auto-filled with current password shown in password-box. It's upto user if he wants to use any other password.


### Password manager
[Access: login-required]

A password manager functionality is implemented under the name of key-holder. Key holder is a place where your passwords and corresponding details you provided will be stored. Each key is displayed using a bootstrap-card. Header of card contains the website name, delete button and show/hide button. Body contains credentials namely e-mail, username and password.

Key holder is designed as such that no credential is visible when it is accessed, user have to click on show/hide button to make credentials visible. Another important feature of key-holder is that you can always copy your credentials, using a copy button, without making them visible, thus it adds a layer of protection from potential prying eyes or cameras in public.

A delete button is given on each card to delete the credentials for that website. You will be prompt to a confirmation pop-up, if you confirm a final delete request is sent using javascript fetch API to delete that key.


### User Login/Register
[Access: login-not-required]

Login and sign-up functionalities are implemented using separate view functions. Bootstrap CSS is used for responsive design. Credential checking is done on server only and if there is any error occurred then a pop-up will greet you with potential error message.



## Installation:
It is suggested that after cloning the project you should first install the python dependencies provided through requirements.txt then,

Run the migration for the project. While at the directory containing manage.py use this set of commands to migrate.

<kbd>python manage.py makemigrations lock_book</kbd>

<kbd>python manage.py migrate</kbd>

This will create a new SQLite3 database and setup the database tables for you to checkout the functionalities.

After that to run the project, start the local server by running the command (Use only one of these):

<kbd>python manage.py runserver</kbd>  (access the website from the host computer only.) 

OR

<kbd>python manage.py runserver 0.0.0.0:8000</kbd> (to access the website from any computer on your network)


## Directory structure and file description

Directory Structure.
```

MY_SITE
|
|--> manage.py
|--> README.md
|--> requirements.txt
|--> db.sqlite3
|
|--> lock_book
|            |--> admin.py
|            |--> apps.py
|            |--> models.py
|            |--> passwd_generator.py
|            |--> tests.py
|            |--> urls.py
|            |--> views.py
|            |
|            |--> templates
|            |            |--> lock_book
|            |                         |--> index.html
|            |                         |--> key_holder.html
|            |                         |--> layout.html
|            |                         |--> login.html
|            |                         |--> register.html
|            |
|            |--> static
|                      |--> lock_book
|                                   |--> css
|                                   |      |--> index.css
|                                   |      |--> login.css
|                                   |      |--> register.css
|                                   |
|                                   |--> images
|                                   |         |--> lock_red.ico
|                                   |         |--> lock_red.jpg
|                                   |
|                                   |--> js
|                                         |--> index.js
|                                         |--> key_holder.js           
|
|--> MY_SITE
           |--> asgi.py
           |--> settings.py
           |--> urls.py
           |--> wsgi.py

```



### Backend files (Significant Ones):

#### passwd_generator.py
This file contains the password generating function that generate 16 digit valid secure and random password. This function uses random function 
as a dependency.

#### views.py
This file contains 2 types of view functions:

- That loads the html pages.
- Those that are used for database queries and handle API requests.

#### models.py
This file contains the user and other ORMs for database mapping.

- Modified user manager class to accept email as unique identifier instead of username when creating a new user using create_user method in views.py.
- Contains a CustomUserManager class that inherits from BaseUserManager class. Class modifies 2 methods methods, one for creating normal user and other for creating superuser.
- Contains two models
	- Custom user model
	- Key model


### HTML Pages
HTML 5 is used for designing the skeleton of this webapp. Pages on this site inherit from layout.html.

Following CSS libs are used for generating the frontend:
- Bootstrap 4.0 (Used for responsive design)
- fontawesome 5.0 (Used for high quality site icons)

Following Javascript libs are imported:
- Jquery (For handling bootstrap events.)

#### layout.html
Layout is the basic of every page on this site. It consists of header and a footer. With links embedded in it.

#### index.html
This page displays the random password. Have the regenerate functionality and save button. Buttons are linked to javascript code to handle 
regenerate and save functions.

Also contains 3 Bootstrap modals to warn/guide user for proper handling. Models are triggered using javascript code.

#### key_holder.html
This page displays all the keys user has saved. Some of the notable features of this page are:

- Copy to clipboard - User can copy their passwords to clipboard without even seeing them.

- Delete a saved key - Ability to delete certain key.

- Hide/unhide a key-card details - User can show or hide the credentials for a website by clicking on a button. Default hidden.

#### login.html

- Handles login and form verification.
- No backend API, uses form POST method to send the data to server for verification. Logs the user in if credentials are found correct.

#### register.html

- Handles new user signups and verification.
- No API, uses form POST method to send the data to server for verification. Creates the new user if all the fields are provided correctly.


### JS
The frontend events of this project is mostly handled using vanilla JS. Two separate javascript files are created for handling the dynamics for two pages namely index.js and key-holder.js.

#### index.js
This javascript file is used to handle the dynamics of index.html page. Appropriate event-listeners are attached to functioning elements to execute the required functions. Fetch API calls are made to retrieve/ send data to server. Appropriate responses are triggered to notify user for success or failure of an event.

#### key-holder.js
This javascript file is used to handle the dynamics of key-holder.html page. Appropriate event-listeners are attached to functioning elements to execute the required functions. Fetch API calls are made to retrieve/ send data to server. Appropriate responses are triggered to notify user for success or failure of an event.
