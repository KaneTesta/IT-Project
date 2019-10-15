---
title: Users
category: Justifications
author: 
---

# Rewrite

To better align the project with the specifications outlined by the User Stories a backend rewrite/refactor was undertaken.

This involved simplifying the codebase by abstracting reusable logic using express middleware for the user authentication flow and advanced mongoose features for image management and artefact sharing.

## Features

With this rewrite comes new and changed functionality.

### Middleware

- Abstract passport use to /lib/oauth2.js
  - Exposes middleware to ensure user is authenticated
    - authRequired
  - Exposes middleware to add user data (if it exists) to res.locals
    - addTemplateVariables (mounted on '/')
  - Handles login, logout and callback routes
    - login and logout route strings with callback urls attached res.locals.login and res.locals.logout, respectively
- Add image upload functionality with /lib/images
  - Sets up a bucket for use using Google Cloud Storage
  - Exposes middleware for accepting an image from a multi-part form
    - multer
  - Exposes middleware for uploading accepted image to Google Cloud, returning the object name and url
    - sendUploadToGCS
    - req.file.cloudStorageObject and req.file.cloudStorageUrl respectively
  - Exposes async function for deletion of objects
    - deleteFromGCS
  - Easily enhanced with general file storage capability (pdf, docx, etc)

### Schemas

- Users
  - Subdocuments have been removed from the userSchema to allow sharing of artefacts without redundancy
  - The relation between a user and an artefact is now part of the artefact
  - A static function has been added to the userSchema to get all artefacts available to that user, which limits the available properties for artefacts not owned by said user as per user story
    - getArtefacts
- Artefacts
  - As mentioned, artefacts are a now a separate document, fields include
    - Name
    - Description
    - Images
      - item
      - documentation
      - insurance
    - Owner
      - reference to user which owns artefact
    - Viewers
      - reference to users which can view artefact
  - Images
    - The images have been abstracted to a subdocument with a single real field for filename and a virtual field for the imageUrl. This is to add support for easily getting the image url and deleting the image from Google Cloud Storage using features of the mongoose library

### Controllers

With schema, middleware and feature requirement changes comes changes to the controllers

- User
  - getUserDashboard
    - renders logged-in user-associated artefacts
  - getAllUsers
    - lists users for sharing
- Artefact
  - The following check for authorised user before allowing modification
    - createArtefact
      - expects artefact details to be in req.body
    - The following check for artefact ownership before allowing modification with checkOwner middleware
      - editArtefact
        - expects artefact details to be in req.body
      - deleteArtefact
        - expects artefact id to be req.body.id
      - addViewer
        - expects artefact id and viewer id to be in req.body
      - removeViewer
        - expects artefact id and viewer id to be in req.body
