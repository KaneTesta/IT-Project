const mongoose = require('mongoose');

const Artefact = mongoose.model('artefact');

const userController = require('../controllers/userController');

function getPageForCurrentUser(req, pageId, callback) {
	// Check page name
	if (!pageId || pageId === '') {
		callback({ error: 'Must include a page id', result: null });
	} else if (req.session && req.session.passport && req.session.passport.user) {
		userController.findUser(req.session.passport.user, (msg) => {
			if (!msg.error && msg.result.length > 0) {
				const user = msg.result[0];
				if (user && user.pages) {
					let foundPage = false;
					// Find the page among the user's pages
					for (let i = 0; i < user.pages.length; i += 1) {
						const artefactPage = user.pages[i];
						if (artefactPage._id && artefactPage._id.toString() === pageId.toString()) {
							callback({ error: null, result: { user, page: artefactPage } });
							foundPage = true;
							break;
						}
					}

					if (!foundPage) {
						callback({ error: "You don't have access to edit this page", result: null });
					}
				} else {
					callback(msg);
				}
			} else {
				callback(msg);
			}
		});
	} else {
		callback({ error: 'User not signed in', result: null });
	}
}

const addArtefact = (req, callback) => {
	const pageId = req.params.id;
	const artefactId = req.body.artefactid;
	const artefactName = req.body.artefactname;
	const artefactDescription = req.body.artefactdescription || '';

	// Check page name
	if (!artefactName || artefactName === '') {
		callback({ error: 'Must include an artefact name', result: null });
	} else {
		getPageForCurrentUser(req, pageId, (msg) => {
			if (msg.error) {
				callback(msg);
			} else {
				const { page } = msg.result;
				const { user } = msg.result;
				if (user && page) {
					if (artefactId) {
						// Edit existing artefact
						for (let i = 0; i < page.artefacts.length; i += 1) {
							if (page.artefacts[i]._id
								&& page.artefacts[i]._id.toString() === artefactId.toString()) {
								page.artefacts[i].name = artefactName;
								page.artefacts[i].description = artefactDescription;
							}
						}
					} else {
						// Add artefact to page
						const artefact = new Artefact({
							name: artefactName,
							description: artefactDescription,
						});

						if (page.artefacts) {
							page.artefacts.push(artefact);
						}
					}

					for (let i = 0; i < user.pages.length; i += 1) {
						if (user.pages[i]._id && user.pages[i]._id.toString() === pageId.toString()) {
							user.pages[i] = page;
						}
					}

					userController.updateUser(user.user_id, user, (msgUpdate) => callback(msgUpdate));
				}
			}
		});
	}
};

const getArtefact = (req, callback) => {
	const pageId = req.params.pageid;
	const artefactId = req.params.artefactid;

	// Check page name
	if (!artefactId || artefactId === '') {
		callback({ error: 'Must include an artefact id', result: null });
	} else {
		getPageForCurrentUser(req, pageId, (msg) => {
			if (msg.error) {
				callback(msg);
			} else {
				const { page } = msg.result;
				const { user } = msg.result;
				if (user && page) {
					let foundArtefact = false;
					for (let i = 0; i < page.artefacts.length; i += 1) {
						if (page.artefacts[i]._id.toString() === artefactId.toString()) {
							callback({ error: null, result: page.artefacts[i] });
							foundArtefact = true;
							break;
						}
					}

					if (!foundArtefact) {
						callback({ error: 'Artefact does not exist in this page', result: null });
					}
				}
			}
		});
	}
};

const deleteArtefact = (req, callback) => {
	const pageId = req.params.id;
	const artefactId = req.body.artefactid;

	// Check page name
	if (!artefactId || artefactId === '') {
		callback({ error: 'Must include an artefact id', result: null });
	} else {
		getPageForCurrentUser(req, pageId, (msg) => {
			if (msg.error) {
				callback(msg);
			} else {
				const { page } = msg.result;
				const { user } = msg.result;
				if (user && page) {
					// Remove artefact from page
					page.artefacts = page.artefacts.filter((el) => el._id
						&& el._id.toString() !== artefactId);
					// Update page
					for (let i = 0; i < user.pages.length; i += 1) {
						if (user.pages[i]._id && user.pages[i]._id.toString() === pageId.toString()) {
							user.pages[i] = page;
						}
					}

					userController.updateUser(user.user_id, user, (msgUpdate) => callback(msgUpdate));
				}
			}
		});
	}
};

const updatePage = (req, callback) => {
	const pageId = req.params.id;
	const pageName = req.body.pagename;

	// Check page name
	if (!pageName || pageName === '') {
		callback({ error: 'Must include a page name', result: null });
	} else {
		getPageForCurrentUser(req, pageId, (msg) => {
			if (msg.error) {
				callback(msg);
			} else {
				const { page } = msg.result;
				const { user } = msg.result;
				if (user && page) {
					// Remove artefact from page
					page.name = pageName;
					// Update page
					for (let i = 0; i < user.pages.length; i += 1) {
						if (user.pages[i]._id && user.pages[i]._id.toString() === pageId.toString()) {
							user.pages[i] = page;
						}
					}

					userController.updateUser(user.user_id, user, (msgUpdate) => callback(msgUpdate));
				}
			}
		});
	}
};


// Exporting callbacks
module.exports = {
	updatePage,

	addArtefact,
	getArtefact,
	deleteArtefact,
};
