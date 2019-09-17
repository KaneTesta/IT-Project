---
title: Embedded JavaScript
category: Vendors
author:
---

Embedded JavaScript is used to generate HTML pages as it allows our server to easily serve dynamic webpages to users using a simple template. For example: the dashboard page has a simple template for individual artefacts, and EJS allows to easily create the HTML required to display a grid of the current user's artefacts.

```javascript
<% for (let i = 0; i < artefacts.owner.length; ++i) { %>
    <%- include('artefact', { artefact: artefacts.owner[i] }); %>
<% }; %>
```

> Only a few lines of code are used to generate the grid of the user's owned artefacts on the dashboard, simplifying our front-end development process.

We chose EJS over other more powerful frameworks such as React or Angular since we don't need the extra functionality that those frameworks provide, and therefore those frameworks would only give increased overhead on both server resources and development time.

## Where we used it

EJS is used in all our front-end templates and elements, which can be found in the `views/` folder.
