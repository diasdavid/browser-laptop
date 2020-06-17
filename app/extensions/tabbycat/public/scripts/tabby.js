chooser({
	type: 'bg-color',
	probability: 'random',
	choices: [
		"bg-light-blue",
		"bg-red",
		"bg-blue",
		"bg-light-purple",
		"bg-purple",
		"bg-green",
		"bg-teal",
		"bg-yellow",
		"bg-mauve"
	]
});

chooser({
	type: 'cat-color',
	probability: 'random',
	choices: [
		"cat-grey",
		"cat-orange",
		"cat-white",
		"cat-black"
	]
});

chooser({
	type: 'tilt',
	probability: 'random',
	choices: ['tilt-left', 'tilt-right']
});

chooser({
	type: 'action',
	probability: 'descending',
	choices: [tiltHead, toggleSleep]
});

// ================================================
// DOM ELEMENTS
// ================================================

var	cat = $('.center-wrapper'),
	face = $('.face svg'),
	body = $('.body svg'),
	head = $('.head svg'),
	headWrapper = $('.head-wrapper'),
	purrables = $('.purrs svg, .purrs img');

// ================================================
// COLOR MAP
// ================================================

var colorMap = {
		background: {
			'#bad5dd': 'bg-light-blue',
			'#FC7E7E': 'bg-red',
			'#A5C6EF': 'bg-blue',
			'#c9d2fc': 'bg-light-purple',
			'#C8B8F2': 'bg-purple',
			'#D7EDAF': 'bg-green',
			'#A2D8C0': 'bg-teal',
			'#F2CC7B': 'bg-yellow'
		},
		cat: {
			'#B3B3B3': 'cat-grey',
			'#FCB47E': 'cat-orange',
			'#FCDAC9': 'cat-white',
			'#5E5E5E': 'cat-black'
		}
	};

function getBgColor() {
	if (thisCat.color.background.charAt(0) === '#') {
		$(document.body).addClass(colorMap.background[thisCat.color.background]);
	} else {
		$(document.body).addClass(thisCat.color.background);
	}
}

function getCatColor() {
	if (thisCat.color.cat.charAt(0) === '#') {
		$('.fill').addClass(colorMap.cat[thisCat.color.cat]);
	} else {
		$('.fill').addClass(thisCat.color.cat);
	}
}

// ================================================
// THIS CAT
// ================================================

if (!thisCat) {
	var thisCat = {
		likesPets: Math.random() < 0.6 ? true : false,
		name: getName(),
		body: random(body),
		head: random(head),
		color: {
			background: chooser.choose('bg-color'),
			cat: chooser.choose('cat-color')
		},
		activeGoodies: {}
	};
} else {
	if (thisCat.likesPets === 'false') {
		thisCat.likesPets = false;
	};
	if (thisCat.likesPets === 'true') {
		thisCat.likesPets = true;
	};
	thisCat.body = parseInt(thisCat.body);
	thisCat.head = parseInt(thisCat.head);

	if (thisCat.activeGoodies) {
		$('[data-active-goodies="' + thisCat.activeGoodies.hat + '"]').addClass('show');
		$('[data-active-goodies="' + thisCat.activeGoodies.toy + '"]').addClass('show');
		$('[data-active-goodies="' + thisCat.activeGoodies.glasses + '"]').addClass('show');
	}
}

// ================================================
// STATE VARS
// ================================================

var	normalFace = face.eq(0),
	blinkFace = face.eq(1),
	currentFace = normalFace,

	petFace = thisCat.likesPets ? face.eq(2) : face.eq(3),
	isBeingPet = false,
	headIsTilted = false,
	isSleeping,

	tiltInterval,
	purrInterval,

	movementTimeout = null,
	lastX = null,
	lastY = null,
	timeToPet = 1000,

	purring = false,
	direction = 1,
	scale = .4,
	offset;

// ================================================
// APPLY STATE
// ================================================

// Make body
body.eq(thisCat.body).addClass('show');
head.eq(thisCat.head).addClass('show');

// Add name
$('.name').text(thisCat.name.full);

// Add colors
getBgColor();
getCatColor();

// Add kitten color
document.addEventListener('kitten', function(event) {
	getCatColor();
}, false);

// Make rare cat
if (thisCat.name.special) {
	$(document.body).addClass(thisCat.name.special.toLowerCase());
}

// Set sleep
if (Math.random() < 0.6 ? false : true) {
	toggleSleep();
}

// Animate
loopActions();
loopBlink();

// ================================================
// SET STATE
// ================================================

function getName() {
	var newName = {
		first: chooser.chooseFromArray(prefixes),
		last: chooser.chooseFromArray(names)
	};

	newName.full = newName.first + ' ' + newName.last;
	newName.special = isSpecial(newName);

	return newName;
}

function random(thing) {
	return Math.floor(Math.random() * (thing.length));
}

function setFace(newFace) {
	currentFace = newFace;

	face.toggleClass('show', false);
	currentFace.toggleClass('show', true);
}

// ================================================
// CAT MOVEMENTS
// ================================================

function blink() {
	if (isSleeping || (isBeingPet && thisCat.likesPets)) {
		return;
	} else {
		currentFace.toggleClass('show', false);
		blinkFace.toggleClass('show', true);
		setTimeout(function() {
			setFace(currentFace);
		}, 200);
	}
}

function removeTilt() {
	headWrapper.toggleClass('tilt-right', false).toggleClass('tilt-left', false);
	headIsTilted = false;
}

function headDown() {
	removeTilt();
	headWrapper.toggleClass('head-down', true);
}

function headUp() {
	removeTilt();
	headWrapper.toggleClass('head-down', false);
}

function sleep() {
	setFace(blinkFace);
}

function wakeUp() {
	setFace(normalFace);
}

function toggleSleep() {
	if (isBeingPet) {
		return;
	}

	if (isSleeping) {
		wakeUp();
		headUp();
	} else {
		sleep();
		headDown();
	}

	isSleeping = !isSleeping;
}

function tiltHead() {
	if (isBeingPet && !thisCat.likesPets) {
		return;
	}
	if (isSleeping) {
		toggleSleep();
	}
	if (headIsTilted) {
		removeTilt();
	}

	headWrapper.toggleClass(chooser.choose('tilt'), true);
	headIsTilted = true;
}

function resetCat() {
	setFace(normalFace);
    headUp();

	if (isSleeping) {
		toggleSleep();
	}
}

function pet() {
	if (isSleeping) {
		toggleSleep();
	}

	isBeingPet = true;

	setFace(petFace);

	if (thisCat.likesPets) {
		headWrapper.toggleClass('likes-being-pet', true);
		startPurr();
		tiltInterval = setInterval(function(){
			tiltHead();
		}, 600);

	} else {
		headWrapper.toggleClass('hates-being-pet', true);
		headDown();
	}
}

function endPet() {
	stopPurr();
	headWrapper.toggleClass('likes-being-pet', false).toggleClass('hates-being-pet', false);
	clearInterval(tiltInterval);

	resetCat();
	isBeingPet = false;
}

function loopActions() {
    var randomTime = Math.round(Math.random() * 5000 + 2000);
    setTimeout(function() {
    	chooser.choose('action')();
    	loopActions();
    }, randomTime);
}

function loopBlink() {
    var randomTime = Math.round(Math.random() * 2000 + 200);
    setTimeout(function() {
    	blink();
    	loopBlink();
    }, randomTime);
}

// ================================================
// PURR STUFF
// ================================================

cat.on('mousemove', function(e) {
	if (lastX !== e.clientX || lastY !== e.clientY) {
		detectMouseMove();
		lastX = e.clientX;
		lastY = e.clientY;
	}
});

function detectMouseMove() {
	if (!isBeingPet) {
		pet();
		movementTimeout = setTimeout(endPet, timeToPet);
	} else {
		clearTimeout(movementTimeout);
		movementTimeout = setTimeout(endPet, timeToPet);
	}
}

function startPurr() {
	if (!purring) {
		purring = true;
		offset = Date.now();
		window.requestAnimationFrame(doPurr);
	}
}

function stopPurr() {
	if (purring) {
		purring = false;
		purrables.css('transform', '');
	}
}

function doPurr() {
	if (purring) {
		window.requestAnimationFrame(doPurr);
		var mod = Math.sin((Date.now() - offset) / 500);
		purrables.each( function() {
			this.style.transform = 'rotate(' + (direction * scale * mod) + 'deg)';
		});
		direction *= -1;
	}
}

// ================================================
// SAVE STUFF
// ================================================

$('.camera').click(function() {
	thisCat.activeGoodies = myGoodies.active;
	$('.camera').addClass('flash');

	$.post('http://tabbycats.club/save', thisCat, function(res) {
		var thisUrl = 'http://tabbycats.club/' + res;
		$('.camera').hide().removeClass('flash');
		$('.snapshot-url').html('<a href="' + thisUrl + '" target="_blank">' + thisUrl.replace('http://', '') + '</a>').show();
	});
});

function resetSnapshot() {
	$('.camera').show();
	$('.snapshot-url').hide();
}
