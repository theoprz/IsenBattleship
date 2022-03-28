let player = require('./player.js');
let game = require('./game.js');

/**
 * @class gameServer
 */
function gameServer() {

	/**
	 * @type {Object}
	 * @this {gameServer}
	 */
	this.games = {};

	/**
	 * @param  {String} gameName
	 * @param  {player} player_one
	 * @this {gameServer}
	 */
	this.createMultiplayerGame = function(gameName, player_one) {
		this.games[gameName] = new game(gameName, player_one);
		player_one.game = this.games[gameName];
		this.updateAvailableGames();
	};

	/**
	 * @param  {String} gameName
	 * @param  {player} player_two
	 * @this {gameServer}
	 */
	this.joinMultiplayerGame = function(gameName, player_two) {
		player_two.game = this.games[gameName];
		this.games[gameName].player_two = player_two;
		this.updateAvailableGames();
	};

	/**
	 * @param  {String} gameName
	 * @this {gameServer}
	 */
	this.removeGame = function(gameName) {
		delete this.games[gameName];
	};

	this.availableGames = {}

	/**
	 * @this {gameServer}
	 */
	this.updateAvailableGames = function() {
		newDict = {};
		for (var element in this.games) {
			if (this.games[element].isAvailable()) {
				newDict[element] = {
					'name': this.games[element].name,
					'player_one': this.games[element].player_one.username
				};
			}
		}
		this.availableGames = newDict;
	};

	/**
	 * @type {Object}
	 * @this {gameServer}
	 */
	this.players = {};

	/**
	 * @param  {String} username
	 * @this {gameServer}
	 */
	this.newPlayer = function(username) {
		this.players[username] = new player(username);
	};

	/**
	 * @param  {String} username
	 * @this {gameServer}
	 */
	this.removePlayer = function(username) {
		delete this.players[username];
	};

	/**
	 * @param  {String} username
	 * @return {Boolean}
	 */
	this.usernameAlreadyExists = function(username) {
		return !!this.players[username];

	};

	/**
	 * @param  {String} gameName
	 * @return {Boolean}
	 */
	this.gameNameAlreadyExists = function(gameName) {
		return !!this.games[gameName];
	}

	/**
	 * @param  {String} username
	 * @return {String}
	 */
	this.sendRoute = function(username) {
		if (username) {
			if (this.players[username].game) {
				if (!this.players[username].game.isAvailable() || this.players[username].game.gameType == 'solo') {
					if (this.players[username].battleship.areBoatsSet) {
						return '/game';
					}
					else {
						return '/setBoats';
					}
				}
				else {
					return '/initialization';
				}
			}
			else {
				return '/join';
			}
		}
		else {
			return '/';
		}
	}
}

module.exports = gameServer;
