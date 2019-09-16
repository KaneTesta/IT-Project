// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const createError = require('http-errors');
const { Storage } = require('@google-cloud/storage');

// Environment variables for .env file
const {
	CLOUD_BUCKET,
	GCLOUD_PROJECT,
	GCLOUD_CLIENT_EMAIL,
	GCLOUD_PRIVATE_KEY,
} = process.env;

// Storage object containing credentials of user
const storage = new Storage({
	projectId: GCLOUD_PROJECT,
	credentials: {
		client_email: GCLOUD_CLIENT_EMAIL,
		private_key: GCLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
	},
});

// Create a storage bucket
const bucket = storage.bucket(CLOUD_BUCKET);

/**
 * Returns the public, anonymously accessible URL to a given Cloud Storage
 * object.
 * @param {string} filename
 */
function getPublicUrl(filename) {
	return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}

/**
 * Middleware for uploading multiple files and fields to GCS.
 * req.files is processed and each file will have two new properties:
 * * ``cloudStorageObject`` the object name in cloud storage
 * * ``cloudStoragePublicUrl`` the public url to the object
 */
function uploadFilesToGCS(req, res, next) {
	if (!req.files) {
		next();
	}

	const promises = [];

	// Iterate through uploaded files object
	// req.files = { 'image': [], 'field': [] }
	Object.keys(req.files).forEach((field) => {
		req.files[field].forEach((f) => {
			promises.push(new Promise((resolve, reject) => {
				const blob = bucket.file(f.originalname);
				const stream = blob.createWriteStream({
					metadata: {
						contentType: f.mimetype,
					},
					resumable: false,
				});

				stream.on('error', (err) => {
					f.cloudStorageError = err;
					reject(err);
				});

				stream.on('finish', () => {
					blob.makePublic().then(resolve());
				});

				stream.end(f.buffer);
			}));
		});
	});

	Promise.all(promises).then(next());
}
function sendUploadToGCS(req, res, next) {
	if (!req.file) {
		next();
		return;
	}

	// Name of Google Cloud Storage object
	const gcsname = Date.now() + req.file.originalname;

	// file object
	const file = bucket.file(gcsname);

	// Create a writeable stream from a file object
	const stream = file.createWriteStream({
		metadata: {
			contentType: req.file.mimetype,
		},
		resumable: false,
	});

	// Throw error if request fails
	stream.on('error', (err) => {
		req.file.cloudStorageError = err;
		next(createError(500, err));
	});

	// Create a file object in cloud storage and upload it to the public URL on success.
	stream.on('finish', () => {
		req.file.cloudStorageObject = gcsname;
		file.makePublic().then(() => {
			req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
			next();
		});
	});

	stream.end(req.file.buffer);
}
// [END process]

// Multer handles parsing multipart/form-data requests.
// This instance is configured to store images in memory.
// This makes it straightforward to upload to Cloud Storage.
// [START multer]
const Multer = require('multer');
const SharpStorage = require('./SharpStorage');

// Create a Multer object containing a 5Mb limit
const multer = Multer({
	storage: SharpStorage,
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
});
// [END multer]

/**
 * Delete file from Google Cloud Storage
 * @param {string} filename
 */
function deleteFromGCS(filename) {
	return bucket.file(filename).delete();
}

function getFileStream(filename) {
	return bucket.file(filename).createReadStream();
}

module.exports = {
	getPublicUrl,
	sendUploadToGCS,
	multer,
	deleteFromGCS,
	getFileStream,
	uploadFilesToGCS,
};
