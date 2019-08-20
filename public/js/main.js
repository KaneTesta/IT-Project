
// Init all plugin when document is ready
$(document).on('ready', () => {
	const contextWindow = $(window);

	// Show and hide menu when icon is clicked
	const menuArtefacts = $('.all-menu-wrapper .nav-link');
	const menuIcon = $('.menu-icon');
	const menuBlock = $('.all-menu-wrapper');
	const reactToMenu = $('.page-main, .navbar-sidebar');
	const menuLinks = $('.navbar-sidebar a');

	// Menu icon clicked
	menuIcon.on('click', () => {
		menuIcon.toggleClass('menu-visible');
		menuBlock.toggleClass('menu-visible');
		menuArtefacts.toggleClass('menu-visible');
		reactToMenu.toggleClass('menu-visible');
		return false;
	});

	// Hide menu
	menuLinks.on('click', () => {
		menuIcon.removeClass('menu-visible');
		menuBlock.removeClass('menu-visible');
		menuArtefacts.removeClass('menu-visible');
		reactToMenu.removeClass('menu-visible');
		return true;
	});


	// Init fullPage.js plugin
	const pageSectionDivs = $('.page-fullpage .section');
	const pageSections = [];
	const pageAnchors = [];
	const mainPage = $('#mainpage');
	let scrollOverflow = true;
	let css3 = true;

	// disable scroll overflow on small device
	if (contextWindow.width() < 601) {
		scrollOverflow = false;
		css3 = false;
	}

	if (contextWindow.height() < 480) {
		scrollOverflow = false;
		css3 = false;
	}

	// Get sections name
	for (let i = 0; i < pageSectionDivs.length; i += 1) {
		pageSections.push(pageSectionDivs[i]);
	}

	window.asyncEach(pageSections, (pageSection, cb) => {
		const anchor = pageSection.getAttribute('data-section');
		pageAnchors.push(`${anchor}`);
		cb();
	}, (err) => {
		// Init plugin
		if (mainPage.width()) {
			// config fullpage.js
			mainPage.fullpage({
				menu: '#qmenu',
				anchors: pageAnchors,
				verticalCentered: false,
				css3,
				navigation: true,
				responsiveWidth: 601,
				responsiveHeight: 480,
				scrollOverflow,
				scrollOverflowOptions: {
					click: true,
					submit: true,
				},
				normalScrollElements: '.section .scrollable',
			});
		}
	});
});
