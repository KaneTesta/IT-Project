#user.js

Contains the schema for our applications users. For each user, an index is created based on the name and email so that a user can be found in a search query (Important for linking artefacts to non-owners). The schema is as follows:

```javascript
const userSchema = mongoose.Schema({
	user_id: {
		type: String,
		index: true,
		unique: true,
		require: [true, 'A user needs an id'],
	},
	display_name: String,
	display_picture: String,
	email: String,
});
```
User.js also contains functions that render the dashboard for each unique user, collecting artefacts that are owned & shared with them.


Important Variables/Functions:

```javascript
// Gets owned and viewable artefacts for a given user
userSchema.statics.getArtefacts = function getArtefacts(userId, done) 

// Gets visible artefact data visible for a given viewer
userSchema.statics.getArtefact = function getArtefact(userId, artefactId, done)

// Create index on name and email for searching
userSchema.index
```


#Vendors
* [async] https://kanetesta.github.io/IT-Project/content/Vendors/async.html
* [mongoose] https://kanetesta.github.io/IT-Project/content/Vendors/mongoose.html