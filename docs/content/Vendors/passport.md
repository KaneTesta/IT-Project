---
title: passport.js
category: Vendors
author:
---

## What it does

Passport is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application. We used passport to authenticate our user logins with Google accounts. Passport.js works by handling a GET request to a specified URL, in our case /auth/google, and redirecting the user to the Google login page along with a callback URL. The user then selects their account and the Google login page sends the user's data to the server using the callback URL.Once the server receives the user's data, it checks to see if the user already exists in the database. If the user doesn't exist, a new database entry is created using the user's information. If the user does already exist, then the server checks if any of the user's information has changed (such as name or profile picture), and updates the database if needed. Passport.js uses sessions of configurable duration. The currently logged in user can be accessed with `req.session.passport.user`, which is how user-specific API functions work such as creating a new page or item.

Passport.js allowed us to easily implement user log ins, as it provides an existing framework for interacting with Google's OAuth login flow and therefore saves time compared to us implementing it ourselves.

## Where we used it

* App.js
* [oAuth2.js](https://kanetesta.github.io/IT-Project/content/Javascript/oAuth2.html)
