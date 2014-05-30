test('pieces', function() {
	equal(chess.pieces['wR'], chess.pieces.wR);
});

test('board', function() {
	equal(chess.board.fileNames.length, 8, 'board has 8 files');
	equal(chess.board.rowNames.length, 8, 'board has 8 rows');
});

test('find piece on a given square', function() {
	var position = new Position();

	equal(position.isEmpty('a1'), true);

	position.addPiece('wR', 'a1');
	equal(position.isEmpty('a1'), false, 'a1 is no longer empty');
	equal(position.pieceOn('a1'), 'wR', 'white rook is on a1');
});

test('find squares with a given piece',
		function() {
			var position = new Position();

			equal(position.squaresWith('wR').length, 0,
					'no white rooks on the board');

			position.addPiece('wR', 'a1');
			equal(position.squaresWith('wR').length, 1,
					'one white rook on the board');
			equal(position.squaresWith('wR')[0], 'a1', 'white rook on a1');

			position.addPiece('wR', 'h8');
			equal(position.squaresWith('wR').length, 2,
					'two white rooks on the board');
			equal(position.squaresWith('wR')[0], 'a1', 'white rook on a1');
			equal(position.squaresWith('wR')[1], 'h8', 'white rook on h8');
		});

test('rook moves on an empty board', function() {
	equal(chess.pieces.wR.moves('a1', 'b2'), false, 'white rook cannot move from a1 to b2');
	equal(chess.pieces.wR.moves('a1', 'a2'), true, 'white rook can move from a1 to a2');
	equal(chess.pieces.wR.moves('a1', 'h1'), true, 'white rook can move from a1 to h1');
});

test('bishop moves on an empty board', function() {
	equal(chess.pieces.wB.moves('a1', 'a2'), false);
	equal(chess.pieces.wB.moves('a1', 'b2'), true);
	equal(chess.pieces.wB.moves('c1', 'h6'), true);
	equal(chess.pieces.wB.moves('c1', 'a3'), true);
});

test('queen moves on an empty board', function() {
	equal(chess.pieces.wQ.moves('d1', 'h6'), false);
	equal(chess.pieces.wQ.moves('d1', 'h5'), true);
	equal(chess.pieces.wQ.moves('d1', 'c8'), false);
	equal(chess.pieces.wQ.moves('d1', 'd8'), true);
});

test('king moves on an empty board', function() {
	equal(chess.pieces.wK.moves('e1', 'e3'), false);
	equal(chess.pieces.wK.moves('e1', 'd1'), true);
	equal(chess.pieces.wK.moves('e1', 'f3'), false);
	equal(chess.pieces.wK.moves('e1', 'f2'), true);
});

test('knight moves on an empty board', function() {
	equal(chess.pieces.wN.moves('b1', 'a2'), false);
	equal(chess.pieces.wN.moves('b1', 'a3'), true);
	equal(chess.pieces.wN.moves('b1', 'd3'), false);
	equal(chess.pieces.wN.moves('b1', 'd2'), true);
});

test('pawn moves on an empty board', function() {
	equal(chess.pieces.wP.moves('e2', 'd3'), false);
	equal(chess.pieces.wP.moves('e2', 'e1'), false);
	equal(chess.pieces.wP.moves('e2', 'e3'), true);
	equal(chess.pieces.wP.moves('e2', 'e4'), true);

	equal(chess.pieces.bP.moves('e7', 'e4'), false);
	equal(chess.pieces.bP.moves('e7', 'e8'), false);
	equal(chess.pieces.bP.moves('e7', 'e6'), true);
	equal(chess.pieces.bP.moves('e7', 'e5'), true);
});

test('squares crossed by a rook', function() {
//	deepEqual(chess.pieces.wR.crossedSquares('a1', 'a2'), [], 'from a1 to a2: no square crossed');
//	deepEqual(chess.pieces.wR.crossedSquares('a1', 'a3'), ['a2'], 'from a1 to a3: a2 crossed');
//	deepEqual(chess.pieces.wR.crossedSquares('a1', 'a8'), ['a2', 'a3', 'a4', 'a5', 'a6', 'a7'],
//			'from a1 to a8: 6 squares crossed');
	deepEqual(chess.pieces.wR.crossedSquares('a1', 'h1'), ['b1', 'c1', 'd1', 'e1', 'f1', 'g1'],
			'from a1 to h1: 6 squares crossed');
});

test('squares crossed by a bishop', function() {
	var bishop = chess.pieces.wB;
	deepEqual(bishop.crossedSquares('c1', 'd2'), [], 'from c1 to d2: no crossed square');
	deepEqual(bishop.crossedSquares('c1', 'e3'), ['d2'], 'from c1 to e3: d2 crossed');
	deepEqual(bishop.crossedSquares('c1', 'h6'), ['d2', 'e3', 'f4', 'g5'], 'from c1 to h6: 4 squares crossed');
	deepEqual(bishop.crossedSquares('h6', 'c1'), ['g5', 'f4', 'e3', 'd2'], 'from h6 to c1: 4 squares crossed');

	deepEqual(bishop.crossedSquares('a8', 'h1'), ['b7', 'c6', 'd5', 'e4', 'f3', 'g2'], 'from a8 to h1: 7 squares crossed');
	deepEqual(bishop.crossedSquares('g2', 'e4'), ['f3'], 'from g2 to e4: f3 crossed');	
});

test('squares crossed by a queen', function() {
	var queen = chess.pieces.wQ;
	deepEqual(queen.crossedSquares('d1', 'd2'), [], 'from d1 to d2: no square crossed');
	deepEqual(queen.crossedSquares('d1', 'e2'), [], 'from d1 to e2: no square crossed');
	
	deepEqual(queen.crossedSquares('d1', 'd8').length, 6, 'from d1 to d8: 6 squares crossed');
	deepEqual(queen.crossedSquares('d1', 'h5').length, 3, 'from d1 to h5: 3 squares crossed');
});

test('squares crossed by a pawn', function() {
	var whitePawn = chess.pieces.wP;
	deepEqual(whitePawn.crossedSquares('e2', 'e3'), [], 'from e2 to e3: no square crossed');
	deepEqual(whitePawn.crossedSquares('e2', 'e4'), ['e3'], 'from e2 to e4: e3 crossed');
	
	var blackPawn = chess.pieces.bP;
	deepEqual(blackPawn.crossedSquares('e7', 'e6'), [], 'from e7 to e6: no square crossed');
	deepEqual(blackPawn.crossedSquares('e7', 'e5'), ['e6'], 'from e7 to e5: e6 crossed');
});

test('squares crossed by a king', function() {
	deepEqual(chess.pieces.wK.crossedSquares('e1', 'f2'), [], 'from e1 to f2: no square crossed');
});

test('squares crossed by a knight', function() {
	deepEqual(chess.pieces.bN.crossedSquares('g8', 'f6'), [], 'from g8 to f6: no square crossed');
});

test('add and remove pieces to/from a position', function() {
	var pos = new Position();
	deepEqual(pos.squaresWith('wR'), []);
	
	pos.addPiece('wR', 'a1');
	equal(pos.pieceOn('a1'), 'wR');
	deepEqual(pos.squaresWith('wR'), ['a1']);
	
	pos.addPiece('wR', 'h1');
	equal(pos.pieceOn('h1'), 'wR');
	deepEqual(pos.squaresWith('wR'), ['a1', 'h1']);
	
	pos.clearSquare('a1');
	ok(pos.isEmpty('a1'));
	equal(pos.pieceOn('h1'), 'wR');
	deepEqual(pos.squaresWith('wR'), ['h1']);

	pos.clearSquare('h1');
	ok(pos.isEmpty('h1'));
	deepEqual(pos.squaresWith('wR'), []);
});

test('rook moves on a board with other pieces', function() {
	var pos = new Position();
	pos.addPiece('wR', 'a1');
	equal(pos.isMovePossible('a1', 'a8'), true, 'rook can move from a1 to a8');
	
	pos.addPiece('wP', 'a2');
	equal(pos.isMovePossible('a1', 'a8'), false, 'rook cannot move from a1 to a8 because there is a white pawn on a2');
	
	pos.clearSquare('a2');
	equal(pos.isMovePossible('a1', 'a8'), true, 'rook can move from a1 to a8');
	
	pos.addPiece('bP', 'a5');
	equal(pos.isMovePossible('a1', 'a8'), false, 'rook cannot move from a1 to a8 because there is a black pawn on a5');
	
	pos.clearSquare('a5');
	pos.addPiece('bB', 'a8');
	equal(pos.isMovePossible('a1', 'a8'), true, 'rook on a1 can capture black bishop on a8');
	
	pos.clearSquare('a8');
	pos.addPiece('wB', 'a8');
	equal(pos.isMovePossible('a1', 'a8'), false, 'white rook on a1 cannot capture white bishop on a8');
});

test('black pawn moves on a board with other pieces', function() {
	var pos = new Position();
	pos.addPiece('bP', 'c7');
	
	equal(pos.isMovePossible('c7', 'c6'), false, "black pawn can move from c7 to c6 because it is White's turn");
	
	pos.setToMove('b');
	equal(pos.isMovePossible('c7', 'c6'), true, 'black pawn can move from c7 to c6');
	equal(pos.isMovePossible('c7', 'c5'), true, 'black pawn can move from c7 to c5');
	equal(pos.isMovePossible('c7', 'c4'), false, 'black pawn cannot move from c7 to c4');
	equal(pos.isMovePossible('c7', 'd6'), false, 'black pawn cannot move from c7 to d6');
	
	pos.addPiece('wP', 'c6');
	equal(pos.isMovePossible('c7', 'c6'), false, 'black pawn can move from c7 to c6 because it is blocked by white pawn on c6');
	equal(pos.isMovePossible('c7', 'c5'), false, 'black pawn can move from c7 to c5 because it is blocked by white pawn on c6');
	equal(pos.isMovePossible('c7', 'd6'), false, 'black pawn cannot from c7 to d6');
	
	pos.addPiece('wP', 'd6');
	equal(pos.isMovePossible('c7', 'd6'), true, 'black pawn c7 can capture white pawn on d6');
	
	pos.clearSquare('d6');
	pos.addPiece('bR', 'd6');
	equal(pos.isMovePossible('c7', 'd6'), false, 'black pawn c7 cannot capture black rook on d6');
});

test('white queenside castling', function() {
	var pos = new Position();
	pos.addPiece('wK', 'e1');
	pos.addPiece('wR', 'a1');
	equal(pos.isMovePossible('e1', 'c1'), true, 'queenside castling possible');

	pos.hasRookA1MovedOrBeenCaptured = true;
	equal(pos.isMovePossible('e1', 'c1'), false, 'queenside castling not possible because rook a1 has moved');
});

test('white kingside castling', function() {
	var pos = new Position();
	pos.addPiece('wK', 'e1');
	pos.addPiece('wR', 'h1');
	equal(pos.isMovePossible('e1', 'g1'), true, 'kingside castling possible');

	pos.hasRookH1MovedOrBeenCaptured = true;
	equal(pos.isMovePossible('e1', 'g1'), false, 'kingside castling not possible because rook a1 has moved');
});

test('black queenside castling', function() {
	var pos = new Position();
	pos.addPiece('bK', 'e8');
	pos.addPiece('bR', 'a8');
	
	equal(pos.isMovePossible('e8', 'c8'), false, "queenside castling not possible because it is not Black's turn");
	
	pos.setToMove('b');
	equal(pos.isMovePossible('e8', 'c8'), true, 'queenside castling possible');

	pos.hasRookA8MovedOrBeenCaptured = true;
	equal(pos.isMovePossible('e8', 'c8'), false, 'queenside castling not possible because rook a8 has moved');
});

test('black kingside castling', function() {
	var pos = new Position();
	pos.addPiece('bK', 'e8');
	pos.addPiece('bR', 'h8');
	pos.setToMove('b');
	equal(pos.isMovePossible('e8', 'g8'), true, 'kingside castling possible');

	pos.hasRookH8MovedOrBeenCaptured = true;
	equal(pos.isMovePossible('e8', 'g8'), false, 'kingside castling not possible because rook a8 has moved');
});

test('en passant (simple case)', function() {
	var pos = new Position();
	pos.addPiece('wP', 'e5');
	pos.addPiece('bP', 'd5');
	
	equal(pos.isMovePossible('e5', 'd6'), false, 'black pawn d5 cannot captured en passant');
	pos.enPassantCaptureSquare = 'd6';
	equal(pos.isMovePossible('e5', 'd6'), true, 'black pawn d5 can be captured en passant');
});

test('en passant capture not possible', function() {
	var pos = new Position();
	pos.toMove = 'b';
	pos.addPiece('wP', 'e5');
	pos.addPiece('bP', 'd6');
	
	pos.moveFromTo('d6', 'd5');
	equal(pos.isMovePossible('e5', 'd6'), false, 'black pawn d5 cannot be captured en passant');
});

test('en passant capture possible', function() {
	var pos = new Position();
	pos.toMove = 'b';
	pos.addPiece('wP', 'e5');
	pos.addPiece('bP', 'd7');
	
	equal(pos.isMovePossible('e5', 'd6'), false, 'black pawn d5 cannot be captured en passant because it has not moved there yet');
	pos.moveFromTo('d7', 'd5');
	equal(pos.isMovePossible('e5', 'd6'), true, 'black pawn d5 can be captured en passant');
	equal(pos.pieceOn('d5'), 'bP');
	equal(pos.pieceOn('e5'), 'wP');
	
	pos.moveFromTo('e5', 'd6');
	equal(pos.isEmpty('e5'), true);
	equal(pos.isEmpty('d5'), true);
	equal(pos.pieceOn('d6'), 'wP');
});

test('promotion (simple case)', function() {
	var pos = new Position();
	
	pos.addPiece('wP', 'a6');
	var moveToA7 = pos.createMove('a6', 'a7');
	equal(moveToA7.promotionTo, null);
	
	pos.moveFromTo('a6', 'a7');
	equal(pos.isEmpty('a6'), true);
	equal(pos.pieceOn('a7'), 'wP');

	pos.addPiece('wP', 'b7');
	var moveToB8 = pos.createMove('b7', 'b8', 'Q');
	equal(moveToB8.promotionTo, 'Q');
	
	pos.moveFromTo('b7', 'b8', 'Q');
	equal(pos.isEmpty('b7'), true);
	equal(pos.pieceOn('b8'), 'wQ');
});

