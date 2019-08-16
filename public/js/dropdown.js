$(() => {
	// Setup dropdown buttons
	$('[data-dropdown]').each((i, el) => {
		const $button = $(el);
		// Setup dropdown
		const dropdownId = $button.attr('data-dropdown');
		const $dropdown = $(`#${dropdownId}`);
		$dropdown.css('visibility', 'hidden');
		// Setup on click
		$button.on('click', () => {
			if ($dropdown.hasClass('visible')) {
				$button.removeClass('button-dropdown-visible');
				$dropdown.removeClass('visible');
				setTimeout(() => {
					if (!$dropdown.hasClass('visible')) {
						$dropdown.css('visibility', 'hidden');
					}
				}, 200);
			} else {
				$button.addClass('button-dropdown-visible');
				$dropdown.addClass('visible');
				$dropdown.css('visibility', '');
			}
		});
	});

	// Close dropdowns on window click
	window.onclick = (event) => {
		const $target = $(event.target);
		if ($target && !$target.attr('data-dropdown')) {
			$('[data-dropdown]').each((i, el) => {
				const $button = $(el);
				// Find dropdown
				const dropdownId = $button.attr('data-dropdown');
				const $dropdown = $(`#${dropdownId}`);
				if ($dropdown.hasClass('visible')) {
					// Check target isn't a child of the dropdown
					if ($target.closest($dropdown).length === 0) {
						$button.removeClass('button-dropdown-visible');
						$dropdown.removeClass('visible');
						setTimeout(() => {
							if (!$dropdown.hasClass('visible')) {
								$dropdown.css('visibility', 'hidden');
							}
						}, 200);
					}
				}
			});
		}
	};
});
