// To add a new kitty:

// 1. Make "k-[name].svg" with:
// 		- .kitten-eyes and .kitten-blink groups
//		- .face on eyes and nose
// 		- .fill on all body classes
// 2. Add conditions below and set kitty
// 3. Add styles to _kittens.scss
// 4. Add `class="[kitten-class]"` to svg.

var kittenClass = 'has-kitty',
	kittenEvent = new Event('kitten'),
	showKitten = Math.random() < 0.3;

// if no kitten is defined
if (!thisCat.kitty) {

	// and we're allowed to show a kitten
	if (showKitten) {

		if (myGoodies.active.toy === 'toy-1') {
			thisCat.kitty = 'frisky';
		} else if (myGoodies.active.toy === 'toy-7' && myGoodies.active.glasses === 'glasses-5') {
			thisCat.kitty = 'scuba';
		} else if (myGoodies.active.toy === 'toy-9' && myGoodies.active.hat === 'hat-9') {
			thisCat.kitty = 'unicorn';
		} else if (myGoodies.active.toy === 'toy-8' && myGoodies.active.hat === 'hat-6') {
			thisCat.kitty = 'camper';
		} else if (myGoodies.active.toy === 'toy-14') {
			thisCat.kitty = 'rocketship';
		} else if (myGoodies.active.toy === 'toy-15' && myGoodies.active.hat === 'hat-5') {
			thisCat.kitty = 'fan';
		} else if (myGoodies.active.toy === 'toy-16' && myGoodies.active.glasses === 'glasses-4') {
			thisCat.kitty = 'bonsai';
		} else if (myGoodies.active.toy === 'toy-18' && myGoodies.active.glasses === 'glasses-8') {
			thisCat.kitty = 'midi';
		}
		// } else if (myGoodies.active.toy === 'toy-11') {
		// 	thisCat.kitty = 'coffee';
		// }

		// 2. Add new kitty conditions here
		// if (conditions) {
		// 	thisCat.kitty = 'new-kitty';
		// }

		else {
			thisCat.kitty = 'no-kitty';
		}

	} else {
		thisCat.kitty = 'no-kitty';
	}
}

// show the kitten we have
showKitty(thisCat.kitty);

function showKitty(kitty) {

	// if no kitten, bounce
	if (kitty === 'no-kitty') {
		return;
	}

	// add the kitten class so that we remove the toys
	$('.center-wrapper').addClass(kittenClass);

	// inject the kitten into the DOM
	$('.ck').html('<img id="combo-kitten" src="images/k-' + kitty + '.svg" />');

	inject(document.querySelector('#combo-kitten'), function(err, svg) {
 		if (err) {
 			console.error('inject error!');
 		}

 		// When it's done loading, dispatch event to get tabby.js styles
 		document.dispatchEvent(kittenEvent);

		// Make that kitten blink
	 	loopKittenBlink();
	});
}

function kittenBlink() {
	$('.kitten-eyes').hide();
	$('.kitten-blink').show();
	setTimeout(function() {
		$('.kitten-eyes').show();
		$('.kitten-blink').hide();
	}, 200);
}

function loopKittenBlink() {
    var randomTime = Math.round(Math.random() * 3000 + 200);
    setTimeout(function() {
    	kittenBlink();
    	loopKittenBlink();
    }, randomTime);
}
