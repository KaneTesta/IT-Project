const mongoose = require('mongoose');

const Page = mongoose.model('itempage');
const Artefact = mongoose.model('artefact');

const userController = require('../controllers/userController');

const addItem = (req, callback) => {
	const pageId = req.params.id;
	const itemName = req.body.itemname;
	const itemDescription = req.body.itemdescription || '';

	// Check page name
	if (!pageId || pageId === '') {
		callback({ error: 'Must include a page id', result: null });
	} else if (!itemName || itemName === '') {
		callback({ error: 'Must include an item name', result: null });
	} else if (req.session && req.session.passport && req.session.passport.user) {
		userController.findUser(req.session.passport.user, (msg) => {
			if (!msg.error && msg.result.length > 0) {
				const user = msg.result[0];
				if (user && user.pages) {
					// Find the page among the user's pages
					for (let i = 0; i < user.pages.length; ++i) {
						let itemPage = user.pages[i];
						if (itemPage._id && itemPage._id.toString() === pageId.toString()) {
							// Add item to page
							const item = new Artefact({
								name: itemName,
								description: itemDescription,
							});

							itemPage.items.push(item);
							user.pages[i] = itemPage;
							userController.updateUser(user.user_id, user, (msgUpdate) => callback(msgUpdate));
							return;
						} else {
							callback({ error: "You don't have access to edit this page", result: null });
							return;
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
};


// Exporting callbacks
module.exports = {
	addItem,
};
