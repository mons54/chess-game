var Game = function () {};

module.exports = Game;

Game.prototype.init = function () {
    this.games = {}; 
};

Game.prototype.move = function (id, uid, start, end) {

    var game = this.games[id],
        pieceStart,
        pieceEnd;
    
    if (!game) {
        return;
    }

    pieceStart = game.pieces[start];
    pieceEnd = game.pieces[end];

    if (!this.isValidMove(uid, pieceStart, end)) {
        return;
    }

    if (this.isCapture()) {
        if (!pieceEnd) {
            this.inPassing();
        } else {
            
        }
    } else {
        this.castling(game, piece, end);
    }

};

Game.prototype.isValidMove = function (uid, piece, end) {

    if (!piece || !this.isPlayerPiece(uid, piece) || (!this.isDeplace() && !this.isCapture())) {
        return false;
    }

    return true;
};

Game.prototype.isDeplace = function (piece, end) {
    return piece.deplace.indexOf(end) != -1;
};

Game.prototype.isCapture = function (piece, end) {
    return piece.capture.indexOf(end) != -1;
};

Game.prototype.isPlayerPiece = function (uid, piece) {
    return uid == game[piece.color].uid;
};

Game.prototype.inPassing = function (game, position) {
    
    var letter = position.substr(0, 1),
        number = position.substr(-1);

    if (number == 3) {
        delete game.pieces[letter + '4'];
    } else {
        delete game.pieces[letter + '5'];
    }
};

Game.prototype.castling = function (game, piece, position) {
    
    if (piece.name != 'king' || piece.moved || ['c1', 'g1', 'c8', 'g8'].indexOf(position) == -1) {
        return;
    }

    var letter = position.substr(0, 1),
        number = position.substr(-1),
        rook,
        letterKing,
        letterRook;

    if (letter == 'c') {
        letterKing = 'd';
        letterRook = 'a';
    } else {
        letterKing = 'f';
        letterRook = 'h';
    }

    rook = game.pieces[letterRook + number].name;

    game.pieces[letterKing + number] = {
        name: rook.name,
        color: rook.color,
        move: [],
        moved: true
    };

    delete game.pieces[letterRook + number];
};

Game.prototype.newGame = function (id, white, black, time) {

    var timeTurn = 120,
        nbPieces = 16;

    this.games[id] = {
        white: {
            uid: white.uid,
            name: white.name,
            time: time,
            timeTurn: timeTurn,
            king: {
                position: 'e1',
                moveForbidden: []
            },
            nbPieces: nbPieces
        },
        black: {
            uid: black.uid,
            name: black.name,
            time: time,
            timeTurn: timeTurn,
            king: {
                position: 'e8',
                moveForbidden: []
            },
            nbPieces: nbPieces
        },
        time: time,
        timeTurn: timeTurn,
        finish: false,
        turn: 'white',
        pieces: {
            e1: {
                name: 'king',
                color: 'white',
                deplace: [],
                capture: [],
                moved: false
            },
            e8: {
                name: 'king',
                color: 'black',
                deplace: [],
                capture: [],
                moved: false
            },
            d1: {
                name: 'queen',
                color: 'white',
                deplace: [],
                capture: [],
                moved: false
            },
            d8: {
                name: 'queen',
                color: 'black',
                deplace: [],
                capture: [],
                moved: false
            },
            a1: {
                name: 'rook',
                color: 'white',
                deplace: [],
                capture: [],
                moved: false
            },
            h1: {
                name: 'rook',
                color: 'black',
                move: [],
                moved: false
            },
            a8: {
                name: 'rook',
                color: 'black',
                deplace: [],
                capture: [],
                moved: false
            },
            h8: {
                name: 'rook',
                color: 'black',
                deplace: [],
                capture: [],
                moved: false
            },
            c1: {
                name: 'bishop',
                color: 'white',
                deplace: [],
                capture: [],
                moved: false
            },
            f1: {
                name: 'bishop',
                color: 'white',
                deplace: [],
                capture: [],
                moved: false
            },
            c8: {
                name: 'bishop',
                color: 'black',
                deplace: [],
                capture: [],
                moved: false
            },
            f8: {
                name: 'bishop',
                color: 'black',
                deplace: [],
                capture: [],
                moved: false
            },
            b1: {
                name: 'knight',
                color: 'white',
                deplace: ['a3', 'c3'],
                capture: [],
                moved: false
            },
            g1: {
                name: 'knight',
                color: 'white',
                deplace: ['f3', 'h3'],
                capture: [],
                moved: false
            },
            b8: {
                name: 'knight',
                color: 'black',
                deplace: ['a6', 'c6'],
                capture: [],
                moved: false
            },
            g8: {
                name: 'knight',
                color: 'black',
                deplace: ['f6', 'h6'],
                capture: [],
                moved: false
            },
            a2: {
                name: 'pawn',
                color: 'white',
                deplace: ['a3', 'a4'],
                capture: [],
                moved: false
            },
            b2: {
                name: 'pawn',
                color: 'white',
                deplace: ['b3', 'b4'],
                capture: [],
                moved: false
            },
            c2: {
                name: 'pawn',
                color: 'white',
                deplace: ['c3', 'c4'],
                capture: [],
                moved: false
            },
            d2: {
                name: 'pawn',
                color: 'white',
                deplace: ['d3', 'd4'],
                capture: [],
                moved: false
            },
            e2: {
                name: 'pawn',
                color: 'white',
                deplace: ['e3', 'e4'],
                capture: [],
                moved: false
            },
            f2: {
                name: 'pawn',
                color: 'white',
                deplace: ['f3', 'f4'],
                capture: [],
                moved: false
            },
            g2: {
                name: 'pawn',
                color: 'white',
                deplace: ['g3', 'g4'],
                capture: [],
                moved: false
            },
            h2: {
                name: 'pawn',
                color: 'white',
                deplace: ['h3', 'h4'],
                capture: [],
                moved: false
            },
            a7: {
                name: 'pawn',
                color: 'black',
                deplace: ['a6', 'a5'],
                capture: [],
                moved: false
            },
            b7: {
                name: 'pawn',
                color: 'black',
                deplace: ['b6', 'b5'],
                capture: [],
                moved: false
            },
            c7: {
                name: 'pawn',
                color: 'black',
                deplace: ['c6', 'c5'],
                capture: [],
                moved: false
            },
            d7: {
                name: 'pawn',
                color: 'black',
                deplace: ['d6', 'd5'],
                capture: [],
                moved: false
            },
            e7: {
                name: 'pawn',
                color: 'black',
                deplace: ['e6', 'e5'],
                capture: [],
                moved: false
            },
            f7: {
                name: 'pawn',
                color: 'black',
                deplace: ['f6', 'f5'],
                capture: [],
                moved: false
            },
            g7: {
                name: 'pawn',
                color: 'black',
                deplace: ['g6', 'g5'],
                capture: [],
                moved: false
            },
            h7: {
                name: 'pawn',
                color: 'black',
                deplace: ['h6', 'h5'],
                capture: [],
                moved: false
            }
        }
    };
};
