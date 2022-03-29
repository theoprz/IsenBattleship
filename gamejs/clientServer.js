var clientServer = function(gameServer, io) {

	var self = this;

	self.io = io;

	self.gameServer = gameServer;

	self.init = function() {
		self.io.on('connection', function(socket) {

			if (self.getUsername(socket)) {
				if (self.getUserGame(socket)) {
						self.handleMultiplayerInitialization(socket);
						self.handleMultiplayerGameConnection(socket);
				} else {
					self.sendAvailableGames(socket);
				}
			} else {
				self.handleDisconnect(socket);
			}
		});
	};


/******************************** Socket io handlers *************************************/
	/**
	 * @param  {socket} socket
	 * @this {clientServer}
	 */
	self.handleMultiplayerInitialization = function(socket) {
		var username = self.getUsername(socket);
		var game = self.getUserGame(socket);
		var player_one = game.player_one;
		var player_two = game.player_two;

		self.joinGameRoom(socket);

		self.gameServer.players[username].saveSocketId(socket.id);

		if (username === player_one.username) {
			self.sendWaitStatus(socket);
		}

		else {
			self.sendConnectStatus(socket);
		}

		socket.on('startGame', function() {
			self.sendSetBoatStatus(socket);
		});
	}

	/**
	 * @param  {socket} socket
	 * @this {clientServer}
	 */
	self.handleMultiplayerGameConnection = function(socket) {
		var username = self.getUsername(socket);

		var game = self.getUserGame(socket);

		if (!game.isAvailable()) {
			var enemyPlayer = self.getEnemyPlayer(socket);

			if (!enemyPlayer.battleship.areBoatsSet) {
				self.sendWaitForBoatStatus(socket);
				self.gameServer.players[self.getUsername(socket)].isTurn = true;
			}else{
				self.sendStartGameStatus(socket);
			}

			socket.on('attack', function(attackCoordinates) {
				if (enemyPlayer.battleship.areBoatsSet && gameServer.players[username].isTurn) {
					var coordinates = [attackCoordinates.row, attackCoordinates.col];

					self.getUserBattleship(socket).attackEnemy(coordinates, enemyPlayer);

					if (enemyPlayer.battleship.isFleetDestroyed()) {
						self.sendGameOverStatus(socket);
						self.disconnectAllPlayersInGame(socket);
					}else{
						self.gameServer.players[username].isTurn = false;
						enemyPlayer.isTurn = true;

						self.sendNextTurnStatus(socket);
					}
				}
			});
		}
	}

	/**
	 * @param  {socket} socket
	 * @return {game}
	 */
	self.getUserGame = function(socket) {
		return self.gameServer.players[self.getUsername(socket)].game;
	}

	/**
	 * @param  {socket} socket
	 * @return {String}
	 */
	self.getUsername = function(socket) {
		return socket.handshake.session.username;
	}

	/**
	 * @param  {socket} socket
	 * @return {battleship}
	 */
	self.getUserBattleship = function(socket) {
		return self.gameServer.players[self.getUsername(socket)].battleship;
	}


	/**
	 * @param  {socket} socket
	 */
	self.sendWaitStatus = function(socket) {
		var status = {
			status: 'waiting',
			message: 'Attente de joueurs pour rejoindre...',
		}
		socket.emit('status', status);
	}

	/**
	 * @param  {socket} socket
	 */
	self.sendConnectStatus = function(socket) {
		var game = self.getUserGame(socket);
		var player_one = game.player_one;
		var player_two = game.player_two;

		var status = {
			status: 'connected',
			message: "Le joueur " + player_two.username + " est connecté ! Vous êtes prêts à lancer la partie !",
		}
		socket.broadcast.to(player_one.socketId).emit('status', status);

		status.message = "Vous êtes connectés à " + player_one.username + " !";
		socket.emit('status', status);
	}

	/**
	 * @param  {socket} socket
	 */
	self.joinGameRoom = function(socket) {
		var game = self.getUserGame(socket);
		socket.join(game.name);
	}

	/**
	 * @param  {socket} socket
	 */
	self.sendAvailableGames = function(socket) {
		socket.emit('listGames', self.gameServer.availableGames);
	}

	/**
	 * @param  {socket} socket
	 */
	self.sendSetBoatStatus = function(socket) {
		var game = self.getUserGame(socket);
		var response = {
			redirect: '/setBoats'
		};
		self.io.sockets.in(game.name).emit('setBoats', response)
	}

	/**
	 * @param  {socket} socket
	 * @return {player}
	 */
	self.getEnemyPlayer = function(socket) {
		var game = self.getUserGame(socket);
		var username = self.getUsername(socket);
		if (game.player_one.username === username) {
			return game.player_two;
		} else {
			return game.player_one;
		}
	}

	/**
	 * @param  {socket} socket
	 */
	self.sendWaitForBoatStatus = function(socket) {
		var username = self.getUsername(socket);
		var enemyPlayer = self.getEnemyPlayer(socket);
		var response = {
			status : 'waiting',
			message: 'En attente de ' + enemyPlayer.username + " pour le placement de ses bateaux",
		}
		socket.emit('wait', response);
	}

	/**
	 * @param  {socket} socket
	 */
	self.sendStartGameStatus = function(socket) {
		var response = {
				message: 'C\'est à vous de jouer',
			}
		socket.broadcast.to(self.getEnemyPlayer(socket).socketId).emit('wait', response);
		response.message = "C\'est au tour de " + self.getEnemyPlayer(socket).username + " de jouer";
		socket.emit('wait', response);
	}

	/**
	 * @param  {socket} socket
	 */
	self.sendGameOverStatus = function(socket) {
		var response = {
			message: 'Vous avez perdu ! Vous aurez plus de chance la prochaine fois !',
			battleship: self.getEnemyPlayer(socket).battleship
		};
		socket.broadcast.to(self.getEnemyPlayer(socket).socketId).emit('finish', response);
		response = {
			message: 'Vous avez gagné !',
			battleship: self.getUserBattleship(socket)
		};
		socket.emit('finish', response);
	}

	/**
	 * @param  {socket} socket
	*/
	self.sendNextTurnStatus = function(socket) {
		response = {
			message: 'C\'est à vous de jouer',
			battleship: self.getEnemyPlayer(socket).battleship
		};
		socket.broadcast.to(self.getEnemyPlayer(socket).socketId).emit('attack', response);

		response = {
			message: "C\'est au tour de " + self.getEnemyPlayer(socket).username + " de jouer",
			battleship: self.getUserBattleship(socket)
		};
		socket.emit('attack', response);
	}

	/**
	 * @param  {socket} socket
	 */
	self.handleDisconnect = function(socket) {
		var response = {
			message: 'Vous n\'êtes pas connecté',
			redirect: '/'
		}
		socket.emit('logout', response);
		socket.disconnect();
	}

	/**
	 * @param  {socket} socket
	 */
	self.disconnectAllPlayersInGame = function(socket) {
		setTimeout(function() {
			self.handleDisconnect(self.io.sockets.connected[self.getEnemyPlayer(socket).socketId]);
			self.handleDisconnect(socket);
		}, 300000);
	}
};

module.exports = clientServer;
