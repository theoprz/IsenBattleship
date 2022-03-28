/**
 * @class Game
 * @param  {string} name
 * @param  {player object} player_one
 */
function game(name, player_one) {

	/**
	 * @type {string}
	 * @this {game}
	 */
	this.name = name;

	/**
	 * @type {player}
	 * @this {game}
	 */
	this.player_one = player_one;

	/**
	 * @this {game}
	 * @type {player}
	 */
	this.player_two = null;

	/**
	 * @return {Boolean}
	 * @this {game}
	 */
	this.isAvailable = function() {
		return this.player_two == null && this.gameType === 'multi';
	};

	/**
	 * @type {String}
	 */
	this.gameType  = 'multi';

};

module.exports = game;
