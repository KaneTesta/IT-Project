const express = require('express');

const router = express.Router();

const artefactController = require('../controllers/artefactController');


router.get('/tags', artefactController.getDistinctTags);

router.get('/find/:id', artefactController.getArtefact);

router.post('/create', artefactController.createArtefact);

router.post('/edit', artefactController.editArtefact);

router.post('/delete', artefactController.deleteArtefact);

router.post('/share/add', artefactController.addViewer);

router.post('/share/remove', artefactController.removeViewer);


module.exports = router;
