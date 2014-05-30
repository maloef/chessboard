test('pieces', function() {
	equal(chess.pieces['wR'], chess.pieces.wR);
});

test('create position for new game', function() {
	pos = chess.fenParser.createPosition();
	equal(pos.toMove, 'w');
	equal(pos.pieceOn('e1'), 'wK', 'white king on e1');
	deepEqual(pos.squaresWith('bB'), ['c8', 'f8'], 'black bishops on c8 and f8');
});

test('play the Najdorf', function() {
	game = new Game();
	
	game.addMoveFromTo('e2', 'e4');
	game.addMoveFromTo('c7', 'c5');
	game.addMoveFromTo('g1', 'f3');
	game.addMoveFromTo('d7', 'd6');
	game.addMoveFromTo('d2', 'd4');
	game.addMoveFromTo('c5', 'd4');
	game.addMoveFromTo('f3', 'd4');
	game.addMoveFromTo('g8', 'f6');
	game.addMoveFromTo('b1', 'c3');
	game.addMoveFromTo('a7', 'a6');
	
	var pos = game.endPos;
	equal(pos.pieceOn('d4'), 'wN', 'white knight on d4');
	deepEqual(pos.squaresWith('wN'), ['d4', 'c3'], 'white knights are on c3 and d4');
});

test('replaceNumbersWithBlanks', function() {
	equal(chess.fenParser.replaceNumbersWithBlanks('3r1N2'), '   r N  ', 'black rook on d-file, white knight on f-file');
});

test('pgn parser: parse move e4', function() {
	pos = chess.fenParser.createPosition();
	var e4 = chess.pgnParser.parsePly('e4', pos);
	equal(e4.from, 'e2', "move 'e4' comes from e2");
	equal(e4.to, 'e4', "move 'e4' moves to e4");
});

test('pgn parser: parse move Nf3', function() {
	pos = chess.fenParser.createPosition();
	var nf3 = chess.pgnParser.parsePly('Nf3', pos);
	equal(nf3.from, 'g1', "move 'Nf3' comes from g1");
	equal(nf3.to, 'f3', "move 'Nf3' moves to f3");
});

test('pgn parser: parse move Nge2', function() {
	pos = new Position();
	pos.addPiece('wN', 'c3');
	pos.addPiece('wN', 'g1');
	
	var nge2 = chess.pgnParser.parsePly('Nge2', pos);
	equal(nge2.from, 'g1', "move 'Nge2' comes from g1");
	equal(nge2.to, 'e2', "move 'Nge2' moves to e2");
});

test('pgn parser: parse white queenside castling', function() {
	pos = new Position();
	pos.addPiece('wK', 'e1');
	pos.addPiece('wR', 'a1');
	
	var castle = chess.pgnParser.parsePly('O-O-O', pos);
	equal(castle.from, 'e1');
	equal(castle.to, 'c1');
});

test('pgn parser: parse black kingside castling', function() {
	pos = new Position();
	pos.toMove = 'b';
	pos.addPiece('bK', 'e8');
	pos.addPiece('bR', 'h8');
	
	var castle = chess.pgnParser.parsePly('O-O', pos);
	equal(castle.from, 'e8');
	equal(castle.to, 'g8');
});

test('pgn parser: parse move with insufficient information - error must be thrown', function() {
	pos = new Position();
	pos.addPiece('wN', 'c3');
	pos.addPiece('wN', 'g1');
	
	throws(
			function() { chess.pgnParser.parsePly('Ne2', pos); },
			"move 'Ne2' must throw an error because it is not clear which knight is moving");
});

test('parse movetext', function() {
	var pgn = '1. e4 c5 2. Nf3 Nc6 1-0';
	equal(chess.pgnParser.movetext(pgn), '1. e4 c5 2. Nf3 Nc6 1-0');
});

test('read plies from movetext', function() {
	var pgn = '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 d6 6. Bc4 Bd7';
	var movetext = chess.pgnParser.movetext(pgn);
	var plies = chess.pgnParser.plies(movetext);
	equal(plies.length, 12);
	equal(plies[0], 'e4');
	equal(plies[1], 'c5');
	equal(plies[2], 'Nf3');
	
	equal(plies[10], 'Bc4');
	equal(plies[11], 'Bd7');
});

test('play game', function() {
	var pgn = '1. e4 c5 2. Nf3 Nc6 1-0';
	var movetext = chess.pgnParser.movetext(pgn);
	var game = chess.pgnParser.createGame(movetext);
	
	equal(game.plies.length, 4, 'game has 4 plies');
	
	game.goToMove(1, 'w');
	equal(game.currentPos.pieceOn('e4'), 'wP', "white pawn on e4 after White's first move");
	game.goToMove(1, 'b');
	equal(game.currentPos.pieceOn('c5'), 'bP', "black pawn on c5 after Black's first move");
	game.goToMove(2, 'w');
	equal(game.currentPos.pieceOn('f3'), 'wN', "white knight on f3 after White's second move");
	game.goToMove(2, 'b');
	equal(game.currentPos.pieceOn('c6'), 'bN', "black knight on c6 after Black's second move");
});

test('selected move', function() {
	var shortPgn = 'bla 1. e4 c5 2. Nf3 d6';
	
	var first = chess.pgnParser.selectedMove(shortPgn, 7);
	equal(first.move, 1, "select 'e4' -> move 1");
	equal(first.color, 'w', "select 'e4' -> white");
	
	var second = chess.pgnParser.selectedMove(shortPgn, 10);
	equal(second.move, 1, "select 'c5' -> move 1");
	equal(second.color, 'b', "select 'c5' -> black");
	
	var third = chess.pgnParser.selectedMove(shortPgn, 16);
	equal(third.move, 2, "select 'Nf3' -> move 2");
	equal(third.color, 'w', "select 'Nf3' -> white");
	
	var fourth = chess.pgnParser.selectedMove(shortPgn, 20);
	equal(fourth.move, 2, "select 'd6' -> move 2");
	equal(fourth.color, 'b', "select 'd6' -> black");
});

test('en passant: White captures', function() {
	var movetext = '1.e4 d5 2.e5 f5 3.exf6';
	var game = chess.pgnParser.createGame(movetext);
	
	equal(game.endPos.pieceOn('f6'), 'wP', 'white pawn on f6 in end position');
	equal(game.endPos.squaresWith('wP').length, 8, 'White has 8 pawns in end position');
	equal(game.endPos.squaresWith('bP').length, 7, 'Black has 7 pawns in end position');
});

test('en passant: Black captures', function() {
	var movetext = '1.Nc3 h5 2.Nb5 h4 3.g4 hxg3';
	var game = chess.pgnParser.createGame(movetext);
	
	equal(game.endPos.pieceOn('g3'), 'bP', 'black pawn on g3 in end position');
	equal(game.endPos.squaresWith('wP').length, 7, 'White has 7 pawns in end position');
	equal(game.endPos.squaresWith('bP').length, 8, 'Black has 8 pawns in end position');
});

test('promotion: white pawn promotes to queen', function() {
	var movetext = '1.e4 d5 2.exd5 c6 3.dxc6 h5 4.cxb7 Nc6 5.b8Q';
	var game = chess.pgnParser.createGame(movetext);
	
	equal(game.endPos.pieceOn('b8'), 'wQ', 'promoted white queen on b8 in end position');
	equal(game.endPos.isEmpty('b7'), true, 'b7 is empty in end position');
});

test('promotion: black pawn promotes to rook', function() {
	var movetext = '1.e4 d5 2.Nc3 dxe4 3.d3 exd3 4.Be2 dxe2 5.Nb1 exd1R+';
	var game = chess.pgnParser.createGame(movetext);
	
	equal(game.endPos.pieceOn('d1'), 'bR', 'promoted black rook on d1 in end position');
	equal(game.endPos.isEmpty('e2'), true, 'e2 is empty in end position');
});

test('taking check into account when finding possible moves', function() {
	// this must not lead to an error because the move Ne2 is not ambiguous: only Ng1 can move, Nc3 is pinned by Bb4
	var movetext = '1.e4 e6 2.d4 d5 3.Nc3 Bb4 4.Ne2';
	var game = chess.pgnParser.createGame(movetext);
	
	equal(game.endPos.pieceOn('e2'), 'wN');
	equal(game.endPos.pieceOn('c3'), 'wN');
	equal(game.endPos.isEmpty('g1'), true);
});


test('regex1', function() {
	// regular expression delimiter '/' (at beginning and end). \s stands for whitespace, + means at least one
	deepEqual('1. e4 c5 2. Sf3 \n\ d6'.split(/\s+/), ['1.', 'e4', 'c5', '2.', 'Sf3', 'd6']);
});
