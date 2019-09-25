const express = require('express');

const router = express.Router();

const artefactController = require('../controllers/artefactController');


router.get('/:id', artefactController.getArtefact);

router.post('/create', artefactController.createArtefact);

router.post('/edit', artefactController.editArtefact);

router.post('/delete', artefactController.deleteArtefact);

router.post('/share/add', artefactController.addViewer);

router.post('/share/remove', artefactController.removeViewer);

router.get('/export', artefactController.getDatabaseZip);

module.exports = router;
