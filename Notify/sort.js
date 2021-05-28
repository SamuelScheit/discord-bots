module.exports.position = function(a, b) {
	if (a.position > b.position) {
		return -1;
	} else if (a.position < b.position) {
		return 1;
	} else {
		return 0;
	}
};

module.exports.sortRole = (a, b) => {
	if (a.position > b.position) {
		return -1;
	} else if (a.position < b.position) {
		return 1;
	} else {
		return 0;
	}
};

module.exports.member = (a, b) => {
	if (a.highestRole.position > b.highestRole.position) {
		return -1;
	} else if (a.highestRole.position < b.highestRole.position) {
		return 1;
	} else {
		return 0;
	}
};

module.exports.members = (a, b) => {
	if (a.position > b.position) {
		return -1;
	} else if (a.position < b.position) {
		return 1;
	} else {
		return 0;
	}
};
