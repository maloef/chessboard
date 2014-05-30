var assert = function(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
};

var chess = {
	otherColor: function(color) {
		if (color === 'w') {
			return 'b';
		}
		assert(color === 'b', 'illegal color: ' + color);
		return 'w';
	}
};

function Board() {
	this.squares = [];
	this.fileNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
	this.rowNames = ['1', '2', '3', '4', '5', '6', '7', '8'];
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			var square = this.fileNames[j] + this.rowNames[i];
			this.squares.push(square);
		}
	}
	this.fileNumber = function(fileName) {
		switch (fileName) {
		case 'a': return 1;
		case 'b': return 2;
		case 'c': return 3;
		case 'd': return 4;
		case 'e': return 5;
		case 'f': return 6;
		case 'g': return 7;
		case 'h': return 8;
		default: throw 'unknown file: ' + fileName;
		};
	};
	this.fileName = function(fileNumber) {
		return this.fileNames[fileNumber - 1];
	};
	this.fileDistance = function(square1, square2) {
		return this.fileNumber(square2[0]) - this.fileNumber(square1[0]);
	};
	this.rowDistance = function(square1, square2) {
		return square2[1] - square1[1];
	};
	this.areOnSameLine = function(square1, square2) {
		return square1[0] === square2[0] || square1[1] === square2[1];
	};
	this.areOnNeighbouringFiles = function(square1, square2) {
		return Math.abs(this.fileDistance(square1, square2)) === 1;
	};
	this.areOnSameDiagonal = function(square1, square2) {
		var files = Math.abs(this.fileDistance(square1, square2));
		var rows = Math.abs(this.rowDistance(square1, square2));
		
		return files === rows;
	};
	this.areInKnightMoveDistance = function(square1, square2) {
		var files = Math.abs(this.fileDistance(square1, square2));
		var rows = Math.abs(this.rowDistance(square1, square2));
		
		return (files === 2 && rows === 1) || (files === 1 && rows === 2);
	};
	this.areInKingMoveDistance = function(square1, square2) {
		var files = Math.abs(this.fileDistance(square1, square2));
		var rows = Math.abs(this.rowDistance(square1, square2));
		
		return square1 !== square2 && files <= 1 && rows <= 1;
	};
	this.areKingsideCastleSquares = function(from, to, color) {
		if (color === 'w') {
			return from === 'e1' && to === 'g1';
		}
		assert(color === 'b', 'illegal color: ' + color);
		return from === 'e8' && to === 'g8';
	};
	this.areQueensideCastleSquares = function(from, to, color) {
		if (color === 'w') {
			return from === 'e1' && to === 'c1';
		}
		assert(color === 'b', 'illegal color: ' + color);
		return from === 'e8' && to === 'c8';
	};

};
// the chess board (consists of rows, files, and squares)
chess.board = new Board();

// an object that consists of functions that describe ways in which pieces move
chess.moves = {
	straight: function(from, to) {
		return chess.board.areOnSameLine(from, to);
	},
	diagonal: function(from, to) {
		return chess.board.areOnSameDiagonal(from, to);
	},
	straightOrDiagonal: function(from, to) {
		return chess.board.areOnSameLine(from, to) || chess.board.areOnSameDiagonal(from, to);
	},
	likeWhiteKing: function(from, to) {
		return chess.board.areInKingMoveDistance(from, to) ||
			chess.board.areKingsideCastleSquares(from, to, 'w') || chess.board.areQueensideCastleSquares(from, to, 'w');
	},
	likeBlackKing: function(from, to) {
		return chess.board.areInKingMoveDistance(from, to) ||
			chess.board.areKingsideCastleSquares(from, to, 'b') || chess.board.areQueensideCastleSquares(from, to, 'b');	

	},
	likeKnight: function(from, to) {
		return chess.board.areInKnightMoveDistance(from, to);
	},
	likeWhitePawn: function(from, to) {
		if (from[0] !== to[0]) {
			return false;
		}
		if (from[1] === '2' && to[1] === '4') {
			return true;
		}
		return parseInt(from[1]) + 1 === parseInt(to[1]);
	},
	likeBlackPawn: function(from, to) {
		if (from[0] !== to[0]) {
			return false;
		}
		if (from[1] === '7' && to[1] === '5') {
			return true;
		}
		return parseInt(from[1]) - 1 === parseInt(to[1]);
	}
};

// an object that consists of functions that describe ways in which pieces capture
chess.captures = {
	likeKing: function(from, to) {
		return chess.board.areInKingMoveDistance(from, to);
	},
	likeWhitePawn: function(from, to) {
		if (Math.abs(chess.board.fileDistance(from, to)) !== 1) {
			return false;
		}
		return parseInt(from[1]) + 1 === parseInt(to[1]);
	},
	likeBlackPawn: function(from, to) {
		if (Math.abs(chess.board.fileDistance(from, to)) !== 1) {
			return false;
		}
		return parseInt(from[1]) - 1 === parseInt(to[1]);
	}
};

// an object that consists of functions that return the squares that are crossed when a piece moves from one square to another
chess.crosses = {
	straight: function(from, to) {
		var fileDistance = chess.board.fileDistance(from, to);
		var rowDistance = chess.board.rowDistance(from, to);
		if (fileDistance !== 0 && rowDistance !== 0) {
			throw 'squares must be on same file or row: ' + from + ', ' + to;
		}
		if (fileDistance === 0 && rowDistance === 0) {
			throw 'fromSquare ' + from + ' and toSquare ' + to + ' seem to be equal';
		}
		var result = [];
		if (fileDistance === 0) {
			if (rowDistance > 0) {
				for (var i = parseInt(from[1]) + 1; i < parseInt(to[1]); i++) {
					result.push(from[0] + parseInt(i));
				}
			} else {
				for (var i = parseInt(from[1]) - 1; i > parseInt(to[1]); i--) {
					result.push(from[0] + parseInt(i));
				}
			}
			return result;
		}
		var fromFileNumber = chess.board.fileNumber(from[0]);
		var toFileNumber = chess.board.fileNumber(to[0]);
		if (fileDistance > 0) {
			for (var i = fromFileNumber + 1; i < toFileNumber; i++) {
				result.push(chess.board.fileName(i) + from[1]);
			}
		} else {
			for (var i = fromFileNumber - 1; i > toFileNumber; i--) {
				result.push(chess.board.fileName(i) + from[1]);
			}
		}
		return result;
	},
	diagonal: function(from, to) {
		var fileDistance = chess.board.fileDistance(from, to);
		var rowDistance = chess.board.rowDistance(from, to);
		var distance = Math.abs(fileDistance);
		var fromFileNumber = chess.board.fileNumber(from[0]);
		var fromRowNumber = parseInt(from[1]);
		
		var result = [];
		if (fileDistance > 0) {
			if (rowDistance > 0) {
				for (var i = 1; i < distance; i++) {
					var file = chess.board.fileName(fromFileNumber + i);
					var row = fromRowNumber + i;
					result.push(file + row);
				}
				return result;
			}
			assert(rowDistance === -fileDistance);
			for (var i = 1; i < distance; i++) {
				var file = chess.board.fileName(fromFileNumber + i);
				var row = fromRowNumber - i;
				result.push(file + row);
			}
			return result;
		}
		if (rowDistance > 0) {
			for (var i = 1; i < distance; i++) {
				var file = chess.board.fileName(fromFileNumber - i);
				var row = fromRowNumber + i;
				result.push(file + row);
			}
			return result;
		}
		for (var i = 1; i < distance; i++) {
			var file = chess.board.fileName(fromFileNumber - i);
			var row = fromRowNumber - i;
			result.push(file + row);
		}
		return result;
	},
	straightOrDiagonal: function(from, to) {
		if (chess.board.areOnSameLine(from, to)) {
			return chess.crosses.straight(from, to);
		}
		return chess.crosses.diagonal(from, to);
	},
	likeWhitePawn: function(from, to) {
		if (from[1] === '2' && to[1] === '4') {
			return [from[0] + '3'];
		}
		return [];
	},
	likeBlackPawn: function(from, to) {
		if (from[1] === '7' && to[1] === '5') {
			return [from[0] + '6'];
		}
		return [];
	},
	likeKing: function(from, to) {
		if (Math.abs(chess.board.fileDistance(from, to)) !== 2) {
			return [];
		}
		if (to === 'c1') {
			return ['b1', 'd1'];
		}
		if (to === 'g1') {
			return ['f1'];
		}
		if (to === 'c8') {
			return ['b8', 'd8'];
		}
		if (to === 'g8') {
			return ['f8'];
		}
		throw 'unexpected king move from ' + from + ' to ' + to;
	}, 
	nothing: function(from, to) {
		return [];
	},
};

// the chess pieces and the ways in which they move, capture, and cross squares
chess.pieces = {
	wK: {color: 'w', piece: 'K',
		moves: chess.moves.likeWhiteKing,
		captures: chess.captures.likeKing,
		crossedSquares: chess.crosses.likeKing},
	wQ: {color: 'w', piece: 'Q',
		moves: chess.moves.straightOrDiagonal,
		captures: chess.moves.straightOrDiagonal, 
		crossedSquares: chess.crosses.straightOrDiagonal},
	wR: {color: 'w', piece: 'R',
		moves: chess.moves.straight,
		captures: chess.moves.straight,
		crossedSquares: chess.crosses.straight},
	wB: {color: 'w', piece: 'B',
		moves: chess.moves.diagonal,
		captures: chess.moves.diagonal,
		crossedSquares: chess.crosses.diagonal},
	wN: {color: 'w', piece: 'N',
		moves: chess.moves.likeKnight,
		captures: chess.moves.likeKnight,
		crossedSquares: chess.crosses.nothing},
	wP: {color: 'w', piece: 'P',
		moves: chess.moves.likeWhitePawn,
		captures: chess.captures.likeWhitePawn,
		crossedSquares: chess.crosses.likeWhitePawn},
	
	bK: {color: 'b', piece: 'K',
		moves: chess.moves.likeBlackKing,
		captures: chess.captures.likeKing,
		crossedSquares: chess.crosses.likeKing},
	bQ: {color: 'b', piece: 'Q',
		moves: chess.moves.straightOrDiagonal,
		captures: chess.moves.straightOrDiagonal,
		crossedSquares: chess.crosses.straightOrDiagonal},
	bR: {color: 'b', piece: 'R',
		moves: chess.moves.straight,
		captures: chess.moves.straight,
		crossedSquares: chess.crosses.straight},
	bB: {color: 'b', piece: 'B',
		moves: chess.moves.diagonal,
		captures: chess.moves.diagonal,
		crossedSquares: chess.crosses.diagonal},
	bN: {color: 'b', piece: 'N',
		moves: chess.moves.likeKnight,
		captures: chess.moves.likeKnight,
		crossedSquares: chess.crosses.nothing},
	bP: {color: 'b', piece: 'P',
		moves: chess.moves.likeBlackPawn,
		captures: chess.captures.likeBlackPawn,
		crossedSquares: chess.crosses.likeBlackPawn}
};

// A chess position. Set up a start position by addPiece(). Change a position by move() or moveFromTo().
function Position() {
	this.hasWhiteKingMoved = false;
	this.hasRookA1MovedOrBeenCaptured = false;
	this.hasRookH1MovedOrBeenCaptured = false;
	this.hasBlackKingMoved = false;
	this.hasRookA8MovedOrBeenCaptured = false;
	this.hasRookH8MovedOrBeenCaptured = false;
	
	this.enPassantCaptureSquare = null;

	this.toMove = 'w';
	this.plies = 0;
	this.squareMap = {}; // {a1: wR, b1: wN,...}
	this.pieceMap = {}; // {wk: [e1], wQ: [d1], wR: [a1, h1],...}
	for (var piece in chess.pieces) {
		this.pieceMap[piece] = [];
	}
	this.setToMove = function(color) {
		this.toMove = color;
	};
	this.toggleToMove = function() {
		this.toMove = chess.otherColor(this.toMove);
	};
	this.addPiece = function(piece, square) {
		this.squareMap[square] = piece;
		this.pieceMap[piece].push(square);
	};
	this.clearSquare = function(square) {
		var piece = this.pieceOn(square);
		if (!piece) {
			return;
		}
		this.squareMap[square] = undefined;
		var squares = this.pieceMap[piece];
		var index = squares.indexOf(square);
		if (index > -1) {
			squares.splice(index, 1);
		}
	};
	this.isEmpty = function(square) {
		return this.pieceOn(square) === undefined;
	};
	// returns the piece on that square, or undefined if the square is empty
	this.pieceOn = function(square) {
		return this.squareMap[square];
	};
	// returns an array containing all the squares with a piece of the given
	// type
	this.squaresWith = function(piece) {
		return this.pieceMap[piece];
	};
	// returns true iff the piece on 'from' can move to 'to' in this position
	this.isMovePossible = function(from, to) {
		var piece = chess.pieces[this.pieceOn(from)];
		if (!piece) {
			return false;
		}
		if (piece.color !== this.toMove) {
			return false;
		}
		var pieceOnTo = this.pieceOn(to);
		if (pieceOnTo) {
			// capturing move?
			if (chess.pieces[pieceOnTo].color === piece.color) {
				// there is a piece of the same color on the 'to' square
				return false;
			}
			if (!piece.captures(from, to)) {
				return false;
			}
		} else if (piece.piece === 'P' && chess.board.areOnNeighbouringFiles(from, to)) {
			// a pawn move that does not go straight even though the 'to' square is empty: can only be an en passant capturing move
			return (piece.color === 'w' && from[1] === '5' && this.enPassantCaptureSquare === to) ||
				(piece.color === 'b' && from[1] === '4' && this.enPassantCaptureSquare === to);
		} else {
			// non-capturing move?
			if (!piece.moves(from, to)) {
				return false;
			}
			if (piece.piece === 'K') {
				if (chess.board.areQueensideCastleSquares(from, to, piece.color)) {
					if (!this.isQueensideCastlingPossible(piece.color)) {
						return false;
					}
				} else if (chess.board.areKingsideCastleSquares(from, to, piece.color)) {
					if (!this.isKingsideCastlingPossible(piece.color)) {
						return false;
					}
				}
			}
		}
		var crossed = piece.crossedSquares(from, to);
		for (var i = 0; i < crossed.length; i++) {
			if (!this.isEmpty(crossed[i])) {
				return false;
			}
		}
		// execute the move and see if the player would be in check in the resulting position
		var posCopy = this.copy();
		posCopy.moveFromTo(from, to);
		return !posCopy.isInCheck(piece.color);
	};
	this.isQueensideCastlingPossible = function(color) {
		if (color === 'w') {
			return !this.hasWhiteKingMoved && !this.hasRookA1MovedOrBeenCaptured;
		}
		assert(color === 'b', 'illegal color ' + color + ' - must be w or b');
		return !this.hasBlackKingMoved && !this.hasRookA8MovedOrBeenCaptured;
	};
	this.isKingsideCastlingPossible = function(color) {
		if (color === 'w') {
			return !this.hasWhiteKingMoved && !this.hasRookH1MovedOrBeenCaptured;
		}
		assert(color === 'b', 'illegal color ' + color + ' - must be w or b');
		return !this.hasBlackKingMoved && !this.hasRookH8MovedOrBeenCaptured;
	};
	// returns true iff there is a piece on square 'from' that threatens (can move to) square 'to'
	this.threatens = function(from, to) {
		var pieceName = this.pieceOn(from);
		if (!pieceName) {
			return false;
		}
		var piece = chess.pieces[pieceName];
		if (!piece.captures(from, to)) {
			return false;
		}
		var crossed = piece.crossedSquares(from, to);
		for (var i = 0; i < crossed.length; i++) {
			if (!this.isEmpty(crossed[i])) {
				return false;
			}
		}
		return true;
	};
	// returns true iff color is in check in the given position (no matter whose turn it is)
	this.isInCheck = function(color) {
		var kingSquares = this.squaresWith(color + 'K');
		if (kingSquares.length === 0) {
			return false;
		}
		var kingSquare = kingSquares[0];
		for (var piece in chess.pieces) {
			if (piece[0] === color) {
				// piece of the same color
				continue;
			}
			// squares with a given type of opponent piece
			var squaresWithPiece = this.squaresWith(piece);
			for (var index in squaresWithPiece) {
				if (this.threatens(squaresWithPiece[index], kingSquare)) {
					return true;
				}
			}
		}
		return false;
	};
	// creates a copy of this (the original position)
	this.copy = function() {
		return $.extend(true, {}, this);
	};
	// Creates a move object. The piece on 'from' moves to 'to'. If this is a pawn move to the base rank, the pawn gets promoted to 'promotionTo'.
	// This method performs no validation. The position remains unchanged.
	this.createMove = function(from, to, promotionTo) {
		var piece = this.pieceOn(from);
		var captured = this.pieceOn(to);
		var enPassant = false;
		if (piece[1] === 'P' && from[0] !== to[0] && !captured) {
			// en passant capture
			captured = chess.otherColor(piece[0]) + 'P';
			enPassant = true;
		}

		return {
			from: from,
			to: to,
			piece: piece,
			captured: captured,
			enPassant: enPassant,
			promotionTo: promotionTo,
			toString: function() {
				return piece + from + '-' + to + (promotionTo || '');
			}
		};
	};
	// Moves from square 'from' to square 'to' (promoting a pawn to 'promotionTo' if necessary). This changes the position.
	this.moveFromTo = function(from, to, promotionTo) {
		var move = this.createMove(from, to, promotionTo);
		return this.move(move);
	};
	// Executes the given move. This changes the position.
	this.move = function(move) {
		this.clearSquare(move.from);
		if (move.captured) {
			if (move.enPassant) {
				// captured pawn is on same file as 'to' square and on same row as 'from' square
				this.clearSquare(move.to[0] + move.from[1]);
			} else {
				this.clearSquare(move.to);
			}
		}
		if (typeof move.promotionTo !== 'undefined') {
			var newPiece = move.piece[0] + move.promotionTo;
			this.addPiece(newPiece, move.to);
		} else {
			this.addPiece(move.piece, move.to);
		}

		if (move.from === 'e1' && move.piece === 'wK') {
			this.hasWhiteKingMoved = true;
			if (move.to === 'c1') {
				this.addPiece('wR', 'd1');
				this.clearSquare('a1');
			}
			if (move.to === 'g1') {
				this.addPiece('wR', 'f1');
				this.clearSquare('h1');
			}
		}
		if (move.from === 'a1' || move.to === 'a1') {
			this.hasRookA1MovedOrBeenCaptured = true;
		}
		if (move.from === 'h1' || move.to === 'h1') {
			this.hasRookH1MovedOrBeenCaptured = true;
		}
		if (move.from === 'e8' && move.piece === 'bK') {
			this.hasBlackKingMoved = true;
			if (move.to === 'c8') {
				this.addPiece('bR', 'd8');
				this.clearSquare('a8');
			}
			if (move.to === 'g8') {
				this.addPiece('bR', 'f8');
				this.clearSquare('h8');
			}
		}
		if (move.from === 'a8' || move.to === 'a8') {
			this.hasRookA8MovedOrBeenCaptured = true;
		}
		if (move.from === 'h8' || move.to === 'h8') {
			this.hasRookH8MovedOrBeenCaptured = true;
		}
		
		this.enPassantCaptureSquare = null;
		if (move.piece[1] === 'P') {
			if (move.from[1] === '2' && move.to[1] === '4') {
				this.enPassantCaptureSquare = move.from[0] + '3';
			} else if (move.from[1] === '7' && move.to[1] === '5') {
				this.enPassantCaptureSquare = move.from[0] + '6';
			}
		}
		
		this.toggleToMove();
		this.plies++;
		return move;
	};
};

// A chess game. This object contains a start position (in case the game does not start from the standard position), a current position, and an end position.
// Add a move to the game by addMove or addMoveFromTo. Move around in the game by goToMove, goToPly, nextMove, or previousMove.
function Game(fenString) {
	this.fenString = fenString;
	this.startPos = chess.fenParser.createPosition(fenString);
	this.currentPos = this.startPos.copy();
	this.endPos = this.startPos.copy();
	this.plies = [];
	
	// Adds a move to the game, i.e. changes the end position.
	this.addMoveFromTo = function(from, to, promotionTo) {
		var move = this.endPos.createMove(from, to, promotionTo);
		this.addMove(move);
	};
	// Adds a move to the game, i.e. changes the end position.
	this.addMove = function(move) {
		var ply = this.endPos.move(move);
		this.plies.push(ply);
	};
	// Goes to a given move, i.e. changes the current position.
	this.goToMove = function(move, color) {
		if (color !== 'w' && color !== 'b') {
			throw 'unknown color: ' + color + ' - must be w or b';
		}
		var ply = move * 2;
		if (color === 'w') {
			ply--;
		}
		this.goToPly(ply);
	};
	// Goes to a given ply (= half move), i.e. changes the current position.
	this.goToPly = function(ply) {
		ply = Math.min(ply, this.plies.length);
		this.currentPos = this.startPos.copy();
		for (var i = 0; i < ply; i++) {
			this.currentPos.move(this.plies[i]);
		};
	};
	// Goes to the next move (more exactly: ply), i.e. changes the current position.
	this.nextMove = function() {
		var nextPly = this.currentPos.plies;
		if (nextPly < this.plies.length) {
			this.currentPos.move(this.plies[nextPly]);
		};
	};
	// Goes to the previous move (more exactly: ply), i.e. changes the current position.
	this.previousMove = function() {
		// Takeback would be more difficult: how would we know if castling was still allowed? And this is fast enough.
		var previousPly = this.currentPos.plies - 1;
		if (previousPly >= 0) {
			this.goToPly(previousPly);
		};
	};
};
