// To add a new goody:
//
// 1. Export "goody-#.svg" and "goody-#-sm.svg".
// 2. Add full-size to `cat.hbs`.
// 3. Add small to `all-goodies.hbs`.

var myGoodies = getGoodiesFromStorage(),
	lastActiveHat,
	lastActiveToy,
	lastActiveGlasses;

function pushGoodyToActive(type, goody) {
	myGoodies.active[type] = myGoodies.active[type] === goody ? '' : goody;
}

function pushGoodyToUnseen(goody) {
	myGoodies.unseen.push(goody);
}

function getNewGoody() {
	// get all possible goodies from DOM
	var rareGoodies = $('[data-goodies]').map(function(index, thisGoody) {
		return {
			goody: $(thisGoody).attr('data-goodies'),
			type: $(thisGoody).attr('data-type')
		};
	}).toArray();

	// if we already have all the goodies
	if (myGoodies.collected.length === rareGoodies.length) {
		return;
	}

	// shave down rareGoodies to ones we don't have
	if (myGoodies.collected.length) {

		$.each(myGoodies.collected, function(i, collectedGoody) {

			var index = rareGoodies.map(function(object) {
				return object.goody;
			}).indexOf(collectedGoody);

			if (index === -1) {
				myGoodies.collected.splice(i, 1);

				if (myGoodies.active.hat === collectedGoody) {
					myGoodies.active.hat = '';
				} else if (myGoodies.active.toy === collectedGoody) {
					myGoodies.active.toy = '';
				} else if (myGoodies.active.glasses === collectedGoody) {
					myGoodies.active.glasses = '';
				}

				return;
			}

			rareGoodies.splice(index, 1);
		});
	}

	// pick a random new goody
	var newGoody = rareGoodies[ Math.floor(Math.random() * (rareGoodies.length)) ];
	// add it to collected
	myGoodies.collected.push(newGoody.goody);
	// add it to active
	pushGoodyToActive(newGoody.type, newGoody.goody);
	// add it to unseen
	pushGoodyToUnseen(newGoody.goody);
	// remove shuffle so that they see the goody
	removeShuffle();
	// save the goodies
	saveGoodiesToStorage(myGoodies);
}

function showCollectedGoodies() {
	$.each(myGoodies.collected, function(index, name) {
		$('.goodies').append( $('[data-goodies="' + name + '"]') );
	});
}

function showActiveGoodies() {
	if (myGoodies.active.hat !== lastActiveHat) {
		$('[data-type="hat"]').removeClass('show').removeClass('active');
		$('[data-active-goodies="' + myGoodies.active.hat + '"]').addClass('show');
		$('[data-goodies="' + myGoodies.active.hat + '"]').addClass('active');

		lastActiveHat = myGoodies.active.hat;
	}

	if (myGoodies.active.toy !== lastActiveToy) {
		$('[data-type="toy"]').removeClass('show').removeClass('active');
		$('[data-active-goodies="' + myGoodies.active.toy + '"]').addClass('show');
		$('[data-goodies="' + myGoodies.active.toy + '"]').addClass('active');

		lastActiveToy = myGoodies.active.toy;
	}

	if (myGoodies.active.glasses !== lastActiveGlasses) {
		$('[data-type="glasses"]').removeClass('show').removeClass('active');
		$('[data-active-goodies="' + myGoodies.active.glasses + '"]').addClass('show');
		$('[data-goodies="' + myGoodies.active.glasses + '"]').addClass('active');

		lastActiveGlasses = myGoodies.active.glasses;
	}
}

function showInitialActiveGoodies() {
	$('[data-type="hat"]').removeClass('show').removeClass('active');
	$('[data-active-goodies="' + myGoodies.active.hat + '"]').addClass('show');
	$('[data-goodies="' + myGoodies.active.hat + '"]').addClass('active');

	$('[data-type="toy"]').removeClass('show').removeClass('active');
	$('[data-active-goodies="' + myGoodies.active.toy + '"]').addClass('show');
	$('[data-goodies="' + myGoodies.active.toy + '"]').addClass('active');

	$('[data-type="glasses"]').removeClass('show').removeClass('active');
	$('[data-active-goodies="' + myGoodies.active.glasses + '"]').addClass('show');
	$('[data-goodies="' + myGoodies.active.glasses + '"]').addClass('active');

	lastActiveHat = myGoodies.active.hat;
	lastActiveToy = myGoodies.active.toy;
	lastActiveGlasses = myGoodies.active.glasses;
}

function showUnseenGoodies() {
	if (myGoodies.unseen.length) {
		$('.collection').addClass('new');

		$.each(myGoodies.unseen, function(index, goody) {
			$('[data-goodies="' + goody + '"]').addClass('new');
		});
	}
}

function shuffleActiveGoodies() {
	var groupedGoodies = {},
		typesOfGoodies = [];

	$.each(myGoodies.collected, function(index, goody) {
		// find the type
		var typeOfGoody = goody.substring(0, goody.indexOf('-'));
		// group by type
		groupedGoodies[typeOfGoody] = (groupedGoodies[typeOfGoody] || []).concat(goody);

		if (typesOfGoodies.indexOf(typeOfGoody) === -1) {
			typesOfGoodies.push(typeOfGoody);
		}
	});

	$.each(typesOfGoodies, function(index, type) {
		var index = Math.floor(Math.random() * (groupedGoodies[type].length + (groupedGoodies[type].length * 1.5)) );
		myGoodies.active[type] = groupedGoodies[type][index];
	});

	saveGoodiesToStorage(myGoodies);
}

function shouldPickNewGoody(visits) {
	if (visits === 1) {
		return true;
	} else if (visits % 200 === 0) {
		return true;
	} else {
		return Math.random() < 0.005 ? true : false;
	}
}

var pickNewGoody = shouldPickNewGoody(getVisitsFromStorage());

if (pickNewGoody) {
	getNewGoody();
}
if (myGoodies.shuffle) {
	$('.shuffle').addClass('active');
	shuffleActiveGoodies();
	saveGoodiesToStorage(myGoodies);
}
showCollectedGoodies();
showInitialActiveGoodies();
showUnseenGoodies();

var bagClicks = 0;

$('.bag').click(function() {
	bagClicks ++;

	if (bagClicks === 1) {
		$('.collection').removeClass('new');
		myGoodies.unseen = [];

		saveGoodiesToStorage(myGoodies);
	}

	if (bagClicks === 2) {
		$('[data-goodies]').removeClass('new');
	}

	window.setTimeout(function(){
		$('.collection').toggleClass('open');
	}, 20);

});

function removeShuffle() {
	myGoodies.shuffle = false;
	$('.shuffle').removeClass('active');
}

function removeKitty() {
	if ($('.has-kitty').length) {
		$('.has-kitty').removeClass('has-kitty');
		$('.ck').empty();
	}
}

$('[data-goodies]').click(function(e) {
	removeShuffle();

	var goody = e.currentTarget.dataset.goodies;
	var type = e.currentTarget.dataset.type;

	pushGoodyToActive(type, goody);

	if (type === 'toy') {
		removeKitty();
	}

	showActiveGoodies();

	saveGoodiesToStorage(myGoodies);
	resetSnapshot();
});

$('.shuffle').click(function() {
	myGoodies.shuffle = !myGoodies.shuffle;

	if (myGoodies.shuffle) {
		$(this).addClass('active');
		shuffleActiveGoodies();
		showActiveGoodies();
	} else {
		removeShuffle();
	}

	saveGoodiesToStorage(myGoodies);
	resetSnapshot();
});
