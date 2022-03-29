var Boat = require('./boat.js'); // Require boat object

/** @type {Object}
 * @class battleship
 */
function battleship() {

	/**
	* @this {battleship}
	* @return {array}
	*/
	this.grid =  [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	];

	/**
	 * @type {Array}
	 */
	this.attack_grid = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];

	/**
	* @this {battleship}
	* @param {integers} (x,y)
	* @return {boolean}
	*/
	this.checkPosition = function (x, y) {
		return this.grid[x][y] === 1;
	};

	/**
	 * @param  {Integer} x
	 * @param  {Integer} y
	 * @return {Boolean}
	 * @this {battleship}
	 */
	this.areAttackCoordinatesTested = function(x,y) {
		return !(this.attack_grid[x][y] === 0 || this.attack_grid[x][y] === 1);

	};

	/**
	* @this {battleship}
	* @param {object} enemyPlayer player object of the opponent
	* @param {tuple} coordinates Attack coordinates
	*/
	this.attackEnemy = function(coordinates, enemyPlayer) {
		var x = coordinates[0];
		var y = coordinates[1];
		if (this.areAttackCoordinatesTested(x,y)) {
			console.log('Cette zone a déja été attaquée !!');
			return false;
		}
		if (enemyPlayer.battleship.checkPosition(x,y)) {
			enemyPlayer.battleship.grid[x][y] = 3; // 2= Râté, 3= Touché, 4= Coulé
			this.attack_grid[x][y] = 3;

			// Find the boat that has been hit
			var hitBoat = enemyPlayer.battleship.findHitBoat(x, y);
			// Sink the boat if it was compvarely destroyed
			enemyPlayer.battleship.sinkBoatIfDestroyed(hitBoat.name);
			this.sinkEnemyBoatIfDestroyed(hitBoat.name, enemyPlayer);
		}
		else {
			enemyPlayer.battleship.grid[x][y] = 2;
			this.attack_grid[x][y] = 2;
		}
	};

	/**
	 * @this {battleship}
	 * @type {dictionnary}
	 */
	this.boats = {
		'Contre-torpilleur': new Boat('contre-torpilleur', 5),
		'Porte-Avions': new Boat('Porte-Avions', 4),
		'Croiseur': new Boat('Croiseur', 3),
		'Sous-marin': new Boat('Sous-marin', 3),
		'Torpilleur': new Boat('Torpilleur', 2),
	};

	/**
	 * All boats destroyed ?
	 * @return {Boolean}
	 */
	this.isFleetDestroyed = function() {
		var flag = true;
		for (var boat in this.boats) {
			if (!this.boats[boat].isSunk) {
				flag = false;
			}
		}
		return flag;
	}

	/**
	 * All boats on grid
	 * @type {Boolean}
	 * @this {battleshîp}
	 * @default
	 */
	this.areBoatsSet = false;

	/**
	 * @type {Boolean}
	 * @default false
	 */
	this.isTurn = false;

	/**
	 * @param {String} boat_name
	 * @return {errors}
	 */
	this.positionIsNotValid = function(boat_name) {
		var boat = this.boats[boat_name];
		var errors = [];
		for (var i = 0; i < boat.coordinatesList.length; i++) {
			if (!this.isInGrid(boat.coordinatesList[i])) {
				errors.push(boat.name + ' n\'est pas parfaitement sur la grille !')
			}
			if (!isZoneAvailable(boat.coordinatesList[i], this.grid)) {
				errors.push('Problème de zone, ' + boat.name + ' est trop proche d\'un autre bâteau !')
			}
		}
		if (errors.length === 0) {
			return false;
		}
		return errors;
	};

	/**
	 * @param {String} boat
	 * @this {battleship}
	 */
	this.setBoat = function (boat_name) {
		if (this.positionIsNotValid(boat_name)) {
			throw new Error({message: 'La position est invalide'});
		}

        var boat = this.boats[boat_name];
        for (var i = 0; i < boat.size; i++) {
            this.grid[boat.coordinatesList[i][0]][boat.coordinatesList[i][1]] = 1;
        }
        boat.isSet = true;
	};


	// Random positions for boat if option is selected
	this.randomSetBoats = function () {
		for (var boat in this.boats) {
			while (!this.boats[boat].isSet) {
				var i = Math.floor(Math.random() * 10);
				var j = Math.floor(Math.random() * 10);
				var rnd = Math.floor(Math.random() + 0.5);
				var dir = "down".repeat(rnd) + "right".repeat(1-rnd);
				this.boats[boat].setPosition([i, j], dir);
				this.boats[boat].setCoordinatesList();
				if (!this.positionIsNotValid(boat)) {
					this.setBoat(boat);
				}
			}
		}
	}

	/**
	 * @param  {x} x
	 * @param  {y} y
	 * @return {boat}
	 */
	this.findHitBoat = function(x, y) {
		for (boat in this.boats) {
			for (coordinates of this.boats[boat].coordinatesList) {
				if (coordinates[0] === x && coordinates[1] === y) {
					return this.boats[boat];
				}
			}
		}
	};

	/**
	 * Turns from 3 to 4 (Touché à coulé)
	 * @param  {String} boat_name
	 * @this {battleship}
	 */
	this.sinkBoatIfDestroyed = function(boat_name) {
		var flag = true;
		for (coordinates of this.boats[boat_name].coordinatesList) {
			var x = coordinates[0];
			var y = coordinates[1];
			if (this.grid[x][y] !== 3) {
				flag = false;
				break;
			}
		}
		if (flag) {
			this.boats[boat_name].sink();
			for (coordinates of this.boats[boat_name].coordinatesList) {
				var x = coordinates[0];
				var y = coordinates[1];
				this.grid[x][y] = 4;
			}
		}
	};

	/**
	 * Update attack_grid
	 * @param  {string} boat_name
	 * @param  {player} enemyPlayer
	 */
	this.sinkEnemyBoatIfDestroyed = function(boat_name, enemyPlayer) {
		if (enemyPlayer.battleship.boats[boat_name].isSunk) {
			for (coordinates of enemyPlayer.battleship.boats[boat_name].coordinatesList) {
				var x = coordinates[0];
				var y = coordinates[1];
				this.attack_grid[x][y] = 4;
			}
		}
	}

	/**
	 * @param  {tuple}  coordinates
	 * @return {Boolean}
	 */
	this.isInGrid = function(coordinates) {
		if (Math.min(9, Math.max(coordinates[0],0)) != coordinates[0] ) {
	        return false;
	    }
	    if (Math.min(9, Math.max(coordinates[1],0)) != coordinates[1] ) {
	        return false;
	    }
	    return true;
	};
};

/**
 * @param  {tuple}  coordinates
 * @param  {Array}  currentGrid
 * @return {Boolean}
 */
function isZoneAvailable(coordinates, currentGrid) {
	var x = coordinates[0];
	var y = coordinates[1];

	for (var i = x-1; i <= x+1; i++) {
		for (var j = y-1; j <= y+1; j++) {
			if (i>=0 && i<=9 && j>=0 && j<=9) {
				if (currentGrid[i][j] != 0) {
					return false;
				}
			}
		}
	}
	return true;
};

module.exports = battleship;
