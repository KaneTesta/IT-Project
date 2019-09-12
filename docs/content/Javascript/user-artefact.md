# user.js & artefact.js

Manage all the http requests for the application. The requests each are associated with a function from a controller because they define what request needs to be made in each call.

For example, in artefacts.js we see:

```javascript
router.post('/share/add', artefactController.addViewer);
```

This means we will make a post request to add a viewer to an artefact whenever addViewer is called.

#Vendors
* [Express] https://kanetesta.github.io/IT-Project/content/Javascript/express.html