var battleship = require('./battleship.js');

/**
 * @param  {string} username
 * @class player
 */
function player(username) {

	/**
	 * @type {String}
	 * @this {player}
	 */
	this.username = username;

	/**
	 * @type {battleship}
	 */
	this.battleship = new battleship();

	/**
	 * @type {game}
	 * @this {player}
	 */
	this.game = null;

	/**
	 * @type {Boolean}
	 * @this {player}
	 */
	this.isTurn = false;

	/**
	 * @type {ObjectID}
	 * @this {player}
	 */
	this.socketId = null;

	/**
	 * @param  {ObjectID} socketId Socket ID of the connected player
	 * @this {player}
	 */
	this.saveSocketId = function(socketId) {
		this.socketId = socketId;
	};

	/**
	 * @param  {game} game
	 * @this {player}
	 */
	this.joinGame = function(game) {
		this.game = game;
		this.game.player_two = this.username;
	};

};

module.exports = player;
