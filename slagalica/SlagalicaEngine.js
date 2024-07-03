function Tile() {
	var self = {};

	self.homePosX = 0;
	self.homePosY = 0;
	self.isWhite = false;

	return self;
}

function GameEngine(props) {
	var self = {};

	self.canvasContext = null;

	self.image = null;
	self.whiteImage = null;

	self.tileMatrix = [];
	
	self.isClickable = false;

	self.tileWidth = 0;
	self.tileHeight = 0;

	self.drawImage = function() {
		self.canvasContext.drawImage(self.image, 0, 0);
	};
	
	self.drawTile = function (tile, x, y) {
		var xPos = x * self.tileWidth;
		var yPos = y * self.tileHeight;
		var atlasPosX = tile.homePosX * self.tileWidth;
		var atlasPosY = tile.homePosY * self.tileHeight;

		if (tile.isWhite === true) {
			self.canvasContext.drawImage(self.whiteImage, 0, 0, self.tileHeight, self.tileWidth, xPos, yPos, self.tileWidth, self.tileHeight);
		} 
		else {
			self.canvasContext.drawImage(self.image, atlasPosX, atlasPosY, self.tileWidth, self.tileHeight, xPos, yPos, self.tileWidth, self.tileHeight);
		}
	};

	self.drawTiles = function () {
		for (var i = 0; i < self.tileMatrix.x; i++) {
			for (var j = 0; j < self.tileMatrix.y; j++) {
				self.drawTile(self.tileMatrix.get(i, j), i, j);
			}
		}
	};

	self.areTilesOnInitialPosition = function () {
		for (var i = 0; i < self.tileMatrix.x; i++) {
			for (var j = 0; j < self.tileMatrix.y; j++) {
				var tile = self.tileMatrix.get(i, j);
				
				if (tile.homePosX !== i || tile.homePosY !== j) {
					return false;
				}
			}
		}
		
		var event = new Event("tilesAreOnInitialPosition");
		document.dispatchEvent(event);
	};
	
	self.clickPixel = function (pixelX, pixelY) {
		if (self.isClickable === true) {
			var x = Math.floor(pixelX / self.tileWidth);
			var y = Math.floor(pixelY / self.tileHeight);
	
			var tile = self.tileMatrix.get(x, y);
	
			self.clickTile(tile, x, y);
		}
	};

	self.clickTile = function (tile, tileX, tileY) {
		if (tile.isWhite !== true) {
			var whiteTile = null;
			var whiteTileX = null;
			var whiteTileY = null;

			for (var i = 0; i < self.tileMatrix.x; i++) {
				var tmpTile = self.tileMatrix.get(i, tileY);
				if (tmpTile.isWhite === true) {
					whiteTile = tmpTile;
					whiteTileX = i;
					whiteTileY = tileY;
				}
			}

			if (whiteTileX === null) {
				for (var i = 0; i < self.tileMatrix.y; i++) {
					var tmpTile = self.tileMatrix.get(tileX, i);
					if (tmpTile.isWhite === true) {
						whiteTile = tmpTile;
						whiteTileX = tileX;
						whiteTileY = i;
					}
				}
			}

			if (whiteTileX !== null) {
				//alert("x=" + whiteTileX + "; y=" + whiteTileY);

				if (whiteTileX === tileX) {
					var step = tileY > whiteTileY ? -1 : 1;
					var border = (whiteTileY - tileY) * step;

					for (var i = border; i > 0; i--) {
						var tmpTile = self.tileMatrix.get(tileX, whiteTileY - step);
						self.tileMatrix.set(tmpTile, tileX, whiteTileY);

						whiteTileY = whiteTileY - step;
						self.tileMatrix.set(whiteTile, tileX, whiteTileY);
					}

					self.drawTiles();
				}

				if (whiteTileY === tileY) {
					var step = tileX > whiteTileX ? -1 : 1;
					var border = (whiteTileX - tileX) * step;

					for (var i = border; i > 0; i--) {
						var tmpTile = self.tileMatrix.get(whiteTileX - step, tileY);
						self.tileMatrix.set(tmpTile, whiteTileX, tileY);

						whiteTileX = whiteTileX - step;
						self.tileMatrix.set(whiteTile, whiteTileX, tileY);
					}

					self.drawTiles();
				}
			}
		}
		
		self.areTilesOnInitialPosition();
	}

	self.init = function () {
		self.tileHeight = self.image.height / self.tileMatrix.y;
		self.tileWidth = self.image.width / self.tileMatrix.x;

		self.canvas.width = self.image.width;
		self.canvas.height = self.image.height;
	};

	self.isLastShuffledAxeX = false;
	
	self.shuffle = function () {
		var whiteTile = null;
		var whitePosX = null;
		var whitePosY = null;

		for (var i = 0; i < self.tileMatrix.x && whiteTile === null; i++) {
			for (var j = 0; j < self.tileMatrix.y && whiteTile === null; j++) {
				var tile = self.tileMatrix.get(i, j);
				if (tile.isWhite === true) {
					whiteTile = tile;
					whitePosX = i;
					whitePosY = j;
				}
			}
		}

		var tile = null;

		if (self.isLastShuffledAxeX === false) {
			var x = Math.floor(Math.random() * self.tileMatrix.x - 1);
			
			if (x === -1) {
				x++;
			}
			
			if (x === whitePosX) {
				x++;
			}

			self.isLastShuffledAxeX = true;
			
			tile = self.tileMatrix.get(x, whitePosY);
			self.clickTile(tile, x, whitePosY);
		} 
		else {
			var y = Math.floor(Math.random() * self.tileMatrix.y - 1);
			
			if (y === -1) {
				y++;
			}
			
			if (y === whitePosY) {
				y++;
			}

			self.isLastShuffledAxeX = false;
			
			tile = self.tileMatrix.get(whitePosX, y);
			self.clickTile(tile, whitePosX, y);
		}
	};

	//init
	self.canvas = props.canvas,
	self.canvasContext = self.canvas.getContext("2d");
	self.tileMatrix = TwoDMatrix(props.noTilesX, props.noTilesY);
	self.image = props.image;
	self.whiteImage = props.whiteImage;

	for (var i = 0; i < self.tileMatrix.x; i++) {
		for (var j = 0; j < self.tileMatrix.y; j++) {
			var tile = Tile();
			tile.homePosX = i;
			tile.homePosY = j;

			if (i === 0 && j === self.tileMatrix.y - 1) {
				tile.isWhite = true;
				self.whiteTile = tile;
			}

			self.tileMatrix.set(tile, i, j);
		}
	}

	self.canvas.addEventListener("click", function (event) {
		x = event.pageX - self.canvas.offsetLeft;
		y = event.pageY - self.canvas.offsetTop;
		self.clickPixel(x, y);
	});

	return self;
}
