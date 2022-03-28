/**
 * Boat Object
 * @class Boat
 * @param  {string} name
 * @param  {integer} size
 */

function boat (name, size) {
	/**
	 * @type {string}
	 * @this {boat}
	 */
	this.name = name;

	/**
	 * @this {boat}
	 * @type {Integer}
	 */
	this.size = size;

	/**
	 * @type {Boolean}
	 * @default
	 * @this {boat}
	 */
	this.isSunk = false;

	/**
	 * @this {boat}
	 */
	this.sink = function() {
		this.isSunk = true;
	}

	/**
	 * Rotation
	 * @type {String}
	 * @default
	 * @this {boat}
	 */
	this.direction = 'right';

	/**
	 * @type {tuple}
	 * @default
	 * @this {boat}
	 */
	this.coordinates = [0,0];

	/**
	 * @type {Boolean}
	 * @this {boat}
	 * @default
	 */
	this.isSet = false;

	/**
	 * @param {tuple} initial_coordinates
	 * @param {string} direction
	 * @this {boat}
	 */
	this.setPosition = function (initial_coordinates, direction) {
		this.coordinates = initial_coordinates;
		this.direction = direction;
	};

	/**
	 * @type {Array}
	 * @default
	 * @this {boat}
	 */
	this.coordinatesList = new Array(this.size).fill([0,0]);

	/**
	 * @this {boat}
	 */
	this.setCoordinatesList = function() {
        this.coordinatesList[0] = this.coordinates;
        switch (this.direction) {
            case 'down':
                for (var i = 0; i < this.size; i++) {
                    this.coordinatesList[i] = [this.coordinates[0] + i, this.coordinates[1]];
                }
                break;
            case 'right':
                for (var i = 0; i < this.size; i++) {
                    this.coordinatesList[i] = [this.coordinates[0], this.coordinates[1] + i];
                }
                break;
        }
	};

};

module.exports = boat;
