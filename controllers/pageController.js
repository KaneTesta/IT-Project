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
					// Find the page among the user's pages
					for (let i = 0; i < user.pages.length; i += 1) {
						let foundPage = false;
						const itemPage = user.pages[i];
						if (itemPage._id && itemPage._id.toString() === pageId.toString()) {
							callback({ error: null, result: { user, page: itemPage } });
							foundPage = true;
							break;
						}

						if (!foundPage) {
							callback({ error: "You don't have access to edit this page", result: null });
						}
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

const addItem = (req, callback) => {
	const pageId = req.params.id;
	const itemId = req.body.itemid;
	const itemName = req.body.itemname;
	const itemDescription = req.body.itemdescription || '';

	// Check page name
	if (!itemName || itemName === '') {
		callback({ error: 'Must include an item name', result: null });
	} else {
		getPageForCurrentUser(req, pageId, (msg) => {
			if (msg.error) {
				callback(msg);
			} else {
				const { page } = msg.result;
				const { user } = msg.result;
				if (user && page) {
					if (itemId) {
						// Edit existing item
						for (let i = 0; i < page.items.length; i += 1) {
							if (page.items[i]._id && page.items[i]._id.toString() === itemId.toString()) {
								page.items[i].name = itemName;
								page.items[i].description = itemDescription;
							}
						}
					} else {
						// Add item to page
						const item = new Artefact({
							name: itemName,
							description: itemDescription,
						});

						page.items.push(item);
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

const getItem = (req, callback) => {
	const pageId = req.params.pageid;
	const itemId = req.params.itemid;

	// Check page name
	if (!itemId || itemId === '') {
		callback({ error: 'Must include an item id', result: null });
	} else {
		getPageForCurrentUser(req, pageId, (msg) => {
			if (msg.error) {
				callback(msg);
			} else {
				const { page } = msg.result;
				const { user } = msg.result;
				if (user && page) {
					let foundItem = false;
					for (let i = 0; i < page.items.length; i += 1) {
						if (page.items[i]._id.toString() === itemId.toString()) {
							callback({ error: null, result: page.items[i] });
							foundItem = true;
							break;
						}
					}

					if (!foundItem) {
						callback({ error: 'Item does not exist in this page', result: null });
					}
				}
			}
		});
	}
};


// Exporting callbacks
module.exports = {
	addItem,
	getItem,
};
