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

	// close dropdown box
	function closeDropdown($dropdown, $button) {
		if ($dropdown.hasClass('visible')) {
			// Check target isn't a child of the dropdown
			$button.removeClass('button-dropdown-visible');
			$dropdown.removeClass('visible');
			setTimeout(() => {
				if (!$dropdown.hasClass('visible')) {
					$dropdown.css('visibility', 'hidden');
				}
			}, 200);
		}
	}

	// Close dropdowns on 'escape' key
	$(document).keydown((e) => {
		if (e.key === 'Escape') {
			$('[data-dropdown]').each((i, el) => {
				const $button = $(el);
				// Find dropdown
				const dropdownId = $button.attr('data-dropdown');
				const $dropdown = $(`#${dropdownId}`);
				closeDropdown($dropdown, $button);
			});
		}
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
				if ($target.closest($dropdown).length === 0) {
					closeDropdown($dropdown, $button);
				}
			});
		}
	};
});
