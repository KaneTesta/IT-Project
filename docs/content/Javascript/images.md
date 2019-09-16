---
title: images.js
category: Javascript
author: 
---

# images.js

This file handles file management between a user and Google Cloud Storage.

The script works by creating a storage object containing a user's data, to be used in a Cloud Storage bucket. To see more about the deployment of the Google Cloud Client, see our documentation on the [GoogleCloudStorage] (https://kanetesta.github.io/IT-Project/content/Vendors/GoogleCloudStorage.html) Vendor page.

```javascript
// Storage object containing credentials of user
const storage = new Storage({
	projectId: GCLOUD_PROJECT,
	credentials: {
		client_email: GCLOUD_CLIENT_EMAIL,
		private_key: GCLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
	},
});
```

The key functions are:

```javascript
// Express middleware that will automatically pass uploads to Cloud Storage.
// req.file is processed and will have two new properties:
// * ``cloudStorageObject`` the object name in cloud storage.
// * ``cloudStoragePublicUrl`` the public url to the object.
function sendUploadToGCS(req, res, next)
```

```javascript
/* Delete file from Google Cloud Storage
* Input:
* Filename - Name of file to be deleted
*/
async function deleteFromGCS(filename)
```

# Vendors
* [GoogleCloudStorage](https://kanetesta.github.io/IT-Project/content/Vendors/GoogleCloudStorage.html)
* [Multer](https://kanetesta.github.io/IT-Project/content/Vendors/Multer.html)
