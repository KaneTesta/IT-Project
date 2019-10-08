---
title: Database export
category: Functionality
author: James Taranto
---

## Motivation

The user requested the ability to create a backup to be able to store a redundant copy on external storage.

## Implementation

Utilising the node.js streaming api, constructs a zip stream consisting of a csv file with the information of each artefact and a subfolder containing uploaded images.
