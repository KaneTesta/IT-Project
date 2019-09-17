---
title: Google Cloud Storage
category: Vendors
author:
---

## What it does

Google Cloud Storage is an online data storage platform that we chose to use for
our file hosting since we were allowed $300 dollars worth of hosting for free.
GCS was a stand out choice since it seemed easy enough to integrate with a single API.

## Where we used it

* [images.js](../Javascript/images.md)

## How

GCS was mostly incorporated following the
[vendor guide](https://cloud.google.com/nodejs/getting-started/using-cloud-storage)
with some small modifications to suit our needs.

Of particular note is the snippet:

```javascript
const storage = new Storage({
    projectId: GCLOUD_PROJECT,
    credentials: {
        client_email: GCLOUD_CLIENT_EMAIL,
        private_key: GCLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
});
```

The example code provided by Google expects a keyFile in order to authenticate
the application.
Not being able to and not willing to store a credentials file on our production server,
the workaround was to store the necessary credentials in environment variables.
This includes a multi-line private-key stored as a one-liner.
Before submitting the required credentials to Google for verification, the
escaped `\n` must be replaced with newlines.
