function TwoDMatrix(x, y) {
	var self = {};

	self.elements = [];
	self.x = x;
	self.y = y;

	self.set = function (obj, x, y) {
		self.elements[x][y] = obj;
	}

	self.get = function (x, y) {
		return self.elements[x][y];
	}

	// init
	for (var i = 0; i < x; i++) {
		var ex = [];

		for (var j = 0; j < y; j++) {
			var why = {};
			ex.push(why);
		}

		self.elements.push(ex);
	}

	return self;
}