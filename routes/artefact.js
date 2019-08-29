const express = require('express');

const router = express.Router();

const artefactController = require('../controllers/artefactController');


router.post('/create', artefactController.createArtefact);

router.post('/:id/edit', artefactController.editArtefact);

router.post('/:id/delete', artefactController.deleteArtefact);

module.exports = router;
