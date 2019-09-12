---
title: userController.js
category: Javascript
author:
---


#userController.js

Script that is used to support the Dashboard/User landing page. It's functions are called to get data about a user's artefacts to be rendered on the dashboard. It also provides the functionality to search for users that have accounts with the website so that an owner of an artefact can alter it's visibility so that other users can see it.  This closely relates to the requirement that includes a relationship between users and their artefacts.

Key variables/functions:

```javascript
//Get all of the artefacts that are owned by a user
exports.getUserDashboard

//Search for users in the user database so we can alter the visibility of an artefact to include them
exports.searchUsers

// Get all users in database
exports.getAllUsers
```