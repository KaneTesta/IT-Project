---
title: Database export
category: Functionality
author: James Taranto
---

## Motivation

The user requested the ability to create a backup to be able to store a redundant copy on external storage.

## Implementation

Utilising the node.js streaming api, constructs a zip stream consisting of a csv file with the information of each artefact and a subfolder containing uploaded images. To do so, click the "database" export button in the navigation menu.

Alternatively, a user can simply select the "print artefacts" button in the navigation menu and a page will render that is formatted to be printable.
