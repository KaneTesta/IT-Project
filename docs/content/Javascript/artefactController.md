#artefactController.js


The artefact controller file is a file containing multiple functions surrounding the management of a user's artefacts. This includes the creation, editing and removal of artefacts, and the functionality to share artefacts with other users. This is an important script as it addresses the core requirements ([Requirements] https://kanetesta.github.io/IT-Project/content/Requirements/requirements-analysis.html) wanting to be seen by our client. 

Key functions/variables are:

```javascript

// Artefact object
// Inputs:
// Name - Name of the object to be displayed on dashboard
// Description - Description of the object 
// Tags - Categories that we want to identify our object with
// Owner - user ID of the owner of the artefact

const artefact = new Artefact({
    name: req.body.name,
    description: req.body.description,
    tags: req.body.tags,
    owner: req.user.id,
});
```

```javascript
//Check if a user is the owner of the artefact, based on their session (login) information. If they aren't the owner of an artefact, don't let them make changes
const checkOwner
```

```javascript
// Get artefact if user is the owner
exports.getArtefact
```

```javascript
// Create and save an artefact object to the user that is logged in's GCS
exports.createArtefact = [
```

```javascript
//Edit's an artefact if it belongs to the user in the session
exports.editArtefact = [
```

```javascript
//Deletes artefact if owned by user
exports.deleteArtefact = [
```

```javascript
// Allows specified user to gain viewing access to an artefact
exports.addViewer
```

```javascript
// Disallows specified user to gain viewing access to an artefact
exports.removeViewer
```


#Vendors
* [Express-Validator] (https://kanetesta.github.io/IT-Project/content/Vendors/ExpressValidator.md)
