var _chooserData = {};
var _defaultHighChoiceProbability = 0.75;

function chooser(config) {
    if (!config.type) {
        throw new Error('Chooser - you need to supply a type!');
    }
    if (!config.probability) {
        throw new Error('Chooser - you need to supply a probability!');
    }
    if (!config.choices && !config.choicesHigh && !config.choicesLow) {
        throw new Error('Chooser - please supply `choices` or `choicesHigh` and `choicesLow` to ' + config.type);
    }
    _chooserData[config.type] = config;
}

chooser.choose = function(type) {
    if (!_chooserData[type]) {
        throw new Error('Chooser - You haven\'t configured the type `' + type + '` :(');
    }

    if (_chooserData[type].probability === 'random') {
        return chooser._chooseRandom(type);
    }

    if (_chooserData[type].probability === 'descending') {
        return chooser._chooseDescending(type);
    }
};

chooser._chooseRandom = function(type) {
    // if it's a regular choices array
    if (_chooserData[type].choices) {
        return chooser.chooseFromArray(_chooserData[type].choices);
    }
    // if it's a high/low split
    if (_chooserData[type].choicesHigh && _chooserData[type].choicesLow) {
        if (Math.random() < (_chooserData[type].highChoiceProbability || _defaultHighChoiceProbability)) {
            chooser.chooseFromArray(_chooserData[type].choicesHigh);
        } else {
            chooser.chooseFromArray(_chooserData[type].choicesLow);
        }
    }
}

chooser._chooseDescending = function(type) {
    var random = Math.random();
    var score = 0, lastScore = 0;
    var length = _chooserData[type].choices.length;
    for (var i = 0; i < length; i++) {
        score = ((length - i) * 10) / (5 * (length + 1) * length);
        if (random < score + lastScore) {
            return _chooserData[type].choices[i];
        }
        lastScore += score;
    }
    return _chooserData[type].choices[length - 1];
}

// utilities

chooser.chooseFromArray = function(array) {
    return array[Math.floor(Math.random() * array.length)];
}