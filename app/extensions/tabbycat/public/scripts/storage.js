var _catStorage,
	_visits,
	goodySchema = {
		collected: [],
		active: {},
		unseen: [],
		shuffle: false
	};

function incrementVisits() {
	_visits = Number(window.localStorage.getItem('visits'));
	_visits ++;
	window.localStorage.setItem('visits', _visits);
}

function getVisitsFromStorage() {
	return _visits;
}
 
function getGoodiesFromStorage() {
	_catStorage = window.localStorage.getItem('goodies');

	if (_catStorage) {
		try {
			_catStorage = JSON.parse(_catStorage);
		} catch(e) {
			console.error('Whoops! There was an issue fetching your goodies. :(');
			_catStorage = goodySchema;
		}
	}

	return _catStorage || goodySchema;
}

function saveGoodiesToStorage(goodies) {
	_catStorage = goodies;

	try {
		var _storageString = JSON.stringify(_catStorage);
		window.localStorage.setItem('goodies', _storageString);
	} catch(e) {
		console.error('Whoops! There was an issue saving your goodies. :(');
	}
}

incrementVisits();