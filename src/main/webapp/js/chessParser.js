chess.fenParser = {
	createPosition: function(fenString) {
		if (!fenString) {
			fenString = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
		}
		var split = fenString.split(' ', 1);
		var pieces = split[0];
		var pos = new Position();

		this.setupPieces(pos, pieces);
		// TODO: interpret whose turn it is, castling, and possible en passant captures
		
		return pos;
	},
	setupPieces: function(pos, pieces) {
		var rows = pieces.split('/');
		for (var rowNum = 8; rowNum >= 1; rowNum--) {
			this.setupRow(pos, rowNum, rows[8 - rowNum]);
		}
	},
	setupRow: function(pos, rowNum, piecesInRow) {
		var numbersReplaced = this.replaceNumbersWithBlanks(piecesInRow);
		var piecesArray = numbersReplaced.split('');
		var files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
		for (var i = 0; i < 8; i++) {
			var piece = piecesArray[i];
			if (piece && piece !== ' ') {
				piece = this.convertPieceName(piece);
				var square = files[i] + rowNum;
				pos.addPiece(piece, square);
			}
		}
	},

	replaceNumbersWithBlanks: function(piecesInRow) {
		var result = '';
		for (var i = 0; i < piecesInRow.length; i++) {
			var c = piecesInRow[i];
			var parsedInt = parseInt(c);
			if (isNaN(parsedInt)) {
				result += c;
			} else {
				for (var emptyCounter = 0; emptyCounter < parsedInt; emptyCounter++) {
					result += ' ';
				}
			}
		}
		return result;
	},
	convertPieceName: function(fenPiece) {
		if (fenPiece.toUpperCase() === fenPiece) {
			return 'w' + fenPiece;
		}
		return 'b' + fenPiece.toUpperCase();
	}
};

chess.pgnParser = {
	// pgn is a complete pgn string, movetext is the substring that contains the moves
	movetext: function(pgn) {
		var index = pgn.search('1\\.');
		assert(index !== -1, 'couldn not find start of movetext in pgn string ' + pgn);
		return pgn.substring(index);
	},
	// movetext is the string that contains the moves, e.g. '1. e4 c5 2. Nf3  d6...'. Returns an array of plies, e.g. ['e4', 'c5', 'Nf3', 'd6',...]
	plies: function(movetext) {
		var isResult = function(item) {
			return item === '1-0' || item === '0-1' || item === '1/2-1/2';
		};
		// Split the movetext using blanks (\s) and dot (\.) as separator, ignoring the move numbers. Example: '1.e4 c5' -> ['e4', 'c5']
		var items = movetext.split(/[\s\.]+/);
		var plies = [];
		for (var i = 0; i < items.length; i++) {
			if (isNaN(items[i]) && !isResult(items[i])) {
				plies.push(items[i]);
			}
		}
		return plies;
	},
	// ply is a string like 'Nf3', 'exd6', '0-0', 'e8Q', or 'e8=Q'. pos is a position. Returns a move, i.e. an object with a 'from' and a 'to' field.
	parsePly: function(ply, pos) {
		// private inner function (functions are just objects!)
		var filterFromCandidates = function(candidates, hint) {
			if (!hint) {
				return candidates;
			}
			var result = [];
			if (hint.length === 1) {
				var fileNameIndex = $.inArray(hint, chess.board.fileNames);
				if (fileNameIndex > -1) {
					for (var i = 0; i < candidates.length; i++) {
						var candidateSquare = candidates[i];
						if (candidateSquare[0] === hint) {
							result.push(candidateSquare);
						}
					}
					return result;
				}
				var rowNameIndex = $.inArray(hint, chess.board.rowNames);
				if (rowNameIndex > -1) {
					for (var i = 0; i < candidates.length; i++) {
						var candidateSquare = candidates[i];
						if (candidateSquare[1] === hint) {
							result.push(candidateSquare);
						}
					}
					return result;
				}
			}
			throw "cannot understand hint " + hint + " for 'from' square";
		};

		var color = pos.toMove;
		var modifiedPly = ply;
		var pieceType = 'P';
		if (ply[0] === 'O') {
			pieceType = 'K';
			if (ply === 'O-O-O') {
				modifiedPly = (color === 'w' ? 'c1' : 'c8');
			} else {
				assert(ply === 'O-O', 'cannot parse castling move ' + ply);
				modifiedPly = (color === 'w' ? 'g1' : 'g8');
			}
		} else if (ply[0].toUpperCase() === ply[0]) {
			pieceType = ply[0];
			assert(['K', 'Q', 'R', 'B', 'N'].indexOf(pieceType) !== -1, 'unknown piece type ' + pieceType + ' in ply ' + ply);
			modifiedPly = modifiedPly.substring(1);
		}
		var piece = color + pieceType;
		
//		var isCapture = false;
		if (modifiedPly.contains('x')) {
//			isCapture = true;
			modifiedPly = modifiedPly.replace('x', '');  
		}
		if (modifiedPly.contains('+')) {
			modifiedPly = modifiedPly.replace('+', '');  
		}
		if (modifiedPly.contains('#')) {
			modifiedPly = modifiedPly.replace('#', '');  
		}
		if (modifiedPly.contains('=')) {
			// promotion, e.g. 'e8=Q' -> 'e8Q'
			modifiedPly = modifiedPly.replace('=', '');  
		}
		
		var promotionTo = undefined;
		var tail = modifiedPly[modifiedPly.length - 1];
		if (['Q', 'R', 'B', 'N'].indexOf(tail) !== -1) {
			// promotion
			var row = modifiedPly[modifiedPly.length - 2];
			assert((piece === 'wP' && row === '8') || (piece === 'bP' && row === '1'), 'ply ' + ply + ' looks like a promotion, but this seems impossible');
			promotionTo = tail;
			modifiedPly = modifiedPly.substring(0, modifiedPly.length - 1);
		}
		var to = modifiedPly.substring(modifiedPly.length - 2);
		modifiedPly = modifiedPly.substring(0, modifiedPly.length - 2);
		
		var squaresWithPiece = pos.squaresWith(piece);
		var fromCandidates = filterFromCandidates(squaresWithPiece, modifiedPly);
		var movesFound = [];
		for (var i = 0; i < fromCandidates.length; i++) {
			if (pos.isMovePossible(fromCandidates[i], to)) {
				movesFound.push(pos.createMove(fromCandidates[i], to, promotionTo));
			}
		}
		assert(movesFound.length === 1,
				'expected exactly one interpretation for ' + ply + ', but found ' + movesFound.length + ': ' + movesFound);
		return movesFound[0];
	},
	// pgnIndex is a position in the pgn string, e.g. the 127th character. Returns {move: 2, color: w} for pgnIndex 13 (= letter 'N')
	// in the pgn string '1. e4 c5 2. Nf3...' 
	selectedMove: function(pgn, pgnIndex) {
		var isBlank = function(str) {
			// regex: not (^) blanks (\s) until the end ($)
			return !str || /^\s*$/.test(str);
		};
		var head = pgn.substring(0, pgnIndex);
		var dotIndex = head.lastIndexOf('.');
		var color = isBlank(pgn.substring(dotIndex + 1, pgnIndex)) ? 'w' : 'b';
			
		head = head.substring(0, head.lastIndexOf('.'));
		
		var moveString = '';
		for (var i = head.length - 1; head[i] >= '0' && head[i] <= '9'; i--) {
			moveString = head[i] + moveString;
		}
		var move = parseInt(moveString);
		
		return {
			move: move,
			color: color
		};
	},
	createGame: function(movetext) {
		var plies = this.plies(movetext);
		var game = new Game();
		
		for (var i = 0; i < plies.length; i++) {
			var move = this.parsePly(plies[i], game.endPos);
			game.addMove(move);
		}
		return game;
	}
};