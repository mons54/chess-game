var Game = function () {};

module.exports = Game;

Game.prototype.init = function () {
    this.games = {};
};

Game.prototype.move = function (id, start, end, promotion) {
    
    var game = this.games[id];

    if (!game || game.finish) {
        return;
    }

    var pieceStart = game.pieces[start],
        pieceEnd = game.pieces[end];

    if (!pieceStart) {
        return;
    }

    var typeMove = this.getTypeMove(pieceStart, end);

    if (!typeMove) {
        return;
    }

    if (typeMove == 'capture') {
        if (!pieceEnd) {
            this.deleteInPassing(game, end);
        }

        if (pieceStart.color == 'white') {
            game.black.nbPieces -= 1;
        } else {
            game.white.nbPieces -= 1;
        }
    } else {

        if (this.isCastling(pieceStart, end)) {
            this.castling(game, end);
        }

        if (this.isPawnPromotion(pieceStart, end)) {
            pieceStart = this.getPawnPromotion(pieceStart.color, promotion);
        }
    }

    delete game.pieces[start];

    pieceStart.moved = true;

    game.pieces[end] = pieceStart;

    console.log(game);
};

Game.prototype.castling = function (game, end) {
    var letter = end.substr(0, 1),
        number = end.substr(-1),
        rook;

    if (letter == 'c') {
        letter = 'd';
        rook = game.pieces['a' + number];
        delete game.pieces['a' + number];
    } else {
        letter = 'f';
        rook = game.pieces['h' + number];
        delete game.pieces['h' + number];
    }
    game.pieces[letter + number] = {
        name: rook.name,
        color: rook.color,
        deplace: [],
        capture: [],
        moved: true
    };
}

Game.prototype.isCastling = function (piece, end) {
    if (piece.name != 'king' || piece.moved == true || !this.inArray(['c1', 'g1', 'c8', 'g8'], end)) {
        return false;
    }
    return true;
};

Game.prototype.getPawnPromotion = function (name, color) {
    if (!this.inArray(['queen', 'rook', 'bishop', 'knight'], name)) {
        name = 'queen';
    }
    return {
        name: name,
        color: color,
        deplace: [],
        capture: [],
        moved: true
    };
};

Game.prototype.isPawnPromotion = function (piece, end) {
    var number = end.substr(-1);
    if (piece.name == 'pawn' && ((piece.color == 'white' && number == '8') || (piece.color == 'black' && number == '1'))) {
        return true;
    }
    return false;
};

Game.prototype.deleteInPassing = function (game, end) { 
    var letter = end.substr(0, 1),
        number = end.substr(-1);

    if (number == '3') {
        delete game.pieces[letter + '4'];
    } else {
        delete game.pieces[letter + '5'];
    }
};

Game.prototype.getTypeMove = function (piece, end) {
    if (this.inArray(piece.deplace, end)) {
        return 'deplace';
    } else if (this.inArray(piece.capture, end)) {
        return 'capture';
    }
    return false;
};

Game.prototype.inArray = function (array, index) {
    return array.indexOf(index) != -1;
};

Game.prototype.create = function (id, white, black, time) {

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
