---
title: async
category: Vendors
author:
---

## What it does

Async is a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript

## Where we used it

Used to perform asynchronous operations and return the results together,
a specific example is retrieving owned and viewable artefacts for a user.
Using two separate `mongoose.find()` operations and collating the results.

### Example

```javascript
function getArtefacts(userId, done) {
    async.parallel({
        owner: function owner(callback) {
            Artefact.find({ owner: userId })
                .populate(Artefact.ownerPopulation)
                .sort('name')
                .exec(callback);
        },
        viewer: function viewer(callback) {
            Artefact.find({ viewers: userId }, Artefact.viewerRestrictions)
                .populate(Artefact.viewerPopulation)
                .sort('name')
                .exec(callback);
        },
    }, (err, artefacts) => {
        done(err, artefacts);
    });
};
```
