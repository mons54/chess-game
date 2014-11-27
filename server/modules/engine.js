module.exports = Engine = function (game, start, end, promotion) {
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

    this.possibleInPassing = [];

    if (pieceStart.name == 'pion' && pieceStart.moved == false) {
        this.checkInPassing(pieceStart, end);
    }

    delete game.pieces[start];

    pieceStart.moved = true;

    game.pieces[end] = pieceStart;

    if (pieceStart.name == 'king') {
        game[pieceStart.color].king.position = end;
    }

     console.log(game);
};

Engine.prototype.checkInPassing = function (piece, end) {

    var number = end.substr(-1),
        letter,
        ligneTake,
        lignePiece;

    if (piece.color == 'blanc') {
        ligneTake = 3;
        lignePiece = 4;
    } else {
        ligneTake = 6;
        lignePiece = 5;
    }

    if (number != lignePiece) {
        return;
    }

    letter = end.substr(0, 1);

    this.inPassing = letter + ligneTake;

    letter = this.letterToNumber(letter);

    if (this.checkPosition(letter + 1, number)) {
        this.possibleInPassing.push(this.getPosition(letter + 1, number));
    }

    if (this.checkPosition(letter - 1, number)) {
        this.possibleInPassing.push(this.getPosition(letter - 1, number));
    }
};

Engine.prototype.checkPiece = function (game, position) {
    return game.pieces[position];
}

Engine.prototype.checkPosition = function (letter, number) {
    return letter > 0 && letter < 9 && number > 0 && number < 9;
};

Engine.prototype.getPosition = function (letter, number) {
    return this.numberToLetter(letter) + number;
};

Engine.prototype.letterToNumber = function (letter) {
    switch (letter) {
        case 'a': return 1;
        case 'b': return 2;
        case 'c': return 3;
        case 'd': return 4;
        case 'e': return 5;
        case 'f': return 6;
        case 'g': return 7;
        case 'h': return 8;
    }
};

Engine.prototype.numberToLetter = function (number) {
    switch (number) {
        case 1: return 'a';
        case 2: return 'b';
        case 3: return 'c';
        case 4: return 'd';
        case 5: return 'e';
        case 6: return 'f';
        case 7: return 'g';
        case 8: return 'h';
    }
    return number;
};

Engine.prototype.castling = function (game, end) {
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

Engine.prototype.isCastling = function (piece, end) {
    if (piece.name != 'king' || piece.moved == true || !this.inArray(['c1', 'g1', 'c8', 'g8'], end)) {
        return false;
    }
    return true;
};

Engine.prototype.getPawnPromotion = function (name, color) {
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

Engine.prototype.isPawnPromotion = function (piece, end) {
    var number = end.substr(-1);
    if (piece.name == 'pawn' && ((piece.color == 'white' && number == '8') || (piece.color == 'black' && number == '1'))) {
        return true;
    }
    return false;
};

Engine.prototype.deleteInPassing = function (game, end) { 
    var letter = end.substr(0, 1),
        number = end.substr(-1);

    if (number == '3') {
        delete game.pieces[letter + '4'];
    } else {
        delete game.pieces[letter + '5'];
    }
};

Engine.prototype.getTypeMove = function (piece, end) {
    if (this.inArray(piece.deplace, end)) {
        return 'deplace';
    } else if (this.inArray(piece.capture, end)) {
        return 'capture';
    }
    return false;
};

Engine.prototype.inArray = function (array, index) {
    return array.indexOf(index) != -1;
};
