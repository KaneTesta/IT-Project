---
title: error.js
category: Javascript
author: 
---

# Error.js
A simple file to convert error's products by express-validator into a human-readable format, where each new error is on a new line.

Key functions:

```javascript
// Convert errors products by express-validator into a human-readable format,
// where each new error is on a new line.
exports.errorsToMessage = function errorsToMessage(errors)

// Create a 400 http error from a validation error produced by express-validator.
exports.createValidationError = function createValidationError(errors)
```

# Vendors
* [http-errors](https://kanetesta.github.io/IT-Project/content/Vendors/http-errors.html)