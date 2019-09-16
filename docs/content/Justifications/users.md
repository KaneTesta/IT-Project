---
title: Users
category: Justifications
author: Joel Launder
---

The two main options for registering new users are either logging in with an existing account from another service (i.e. Google, Facebook, Twitter, etc...), or making users create a new account within our website in order to use the app. We wanted it to be as easy as possible for new users to access our application, so we decided to allow users to log in with an existing account from another service. Specifically, we chose to use Google because the clients already have their own Google/Gmail accounts.

## Passport.js

Passport.js allowed us to easily implement this, as it provides an existing framework for interacting with Google's OAuth login flow and therefore saves time compared to us implementing it ourselves. Passport.js works by handling a GET request to a specified URL, in our case /auth/google, and redirecting the user to the Google login page along with a callback URL. The user then selects their account and the Google login page sends the user's data to the server using the callback URL.

Once the server receives the user's data, it checks to see if the user already exists in the database. If the user doesn't exist, a new database entry is created using the user's information. If the user does already exist, then the server checks if any of the user's information has changed (such as name or profile picture), and updates the database if needed.

Passport.js uses sessions of configurable duration. The currently logged in user can be accessed with `req.session.passport.user`, which is how user-specific API functions work such as creating a new page or item.
