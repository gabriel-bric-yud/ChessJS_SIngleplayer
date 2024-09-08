const titleDiv = document.querySelector('.titleDiv')
const gameContainer = document.getElementById('gameContainer')
const gameboard = document.getElementById('gameboard');
const userInterface = document.getElementById('userInterface')
const setUp = document.querySelector('#setUp')
const singlePlayer = document.getElementById('singlePlayer');
const selectColor = document.getElementById('selectColor')
const optionsContainer = document.getElementById('optionsContainer')
const restartText = document.querySelector('#rematchHeader')
const resultTxt = document.getElementById('resultTxt')
const winnerDiv = document.querySelector('.resultNotif')

const alphabet = ['A', 'B', 'C', 'D','E','F','G','H']
let allPiecesList = []
let whitePiecesList = [];
let blackPiecesList = [];
let boardTiles = [];
let possibleMovesList = [];
let currentTurn = "black";
let dragTarget;
let dropSpot;
let clicked;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

window.addEventListener('selectstart', (e) => {
    e.preventDefault();  
})


singlePlayer.addEventListener('click', (e) => {
    clearBoard()
    searchUI.classList.remove('hide')
    optionsContainer.classList.remove('hide')
})

selectColor.addEventListener('change', (e) => {
    while (gameboard.firstChild) {
        gameboard.firstChild.remove()
    }
    
    winnerDiv.classList.remove('show')
    startGame(selectColor.value)

})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function startGame(msg) {
    gameboard.style.display = "flex";
    fadeIn(gameboard, .02, 10);
    createBoard(msg);
    addChessPieces();
    nextTurn()
    selectColor.value = '';
}

function nextTurn() {
    /**
    document.querySelectorAll(`[data-color=${currentTurn}]`).forEach((elem) => {
        elem.classList.remove("highlight")
    })
    currentTurn == "white" ? currentTurn = "black" : currentTurn = "white";

    document.querySelectorAll(`[data-color=${currentTurn}]`).forEach((elem) => {
        elem.classList.add("highlight")
    })
    */
    document.querySelectorAll(".gridTile").forEach((tile) => {
        tile.classList.remove("highlight")
    })
    currentTurn == "white" ? currentTurn = "black" : currentTurn = "white";


    document.querySelectorAll('.possibleMove').forEach(item => {
        //item.parentNode.classList.remove("possibleKillTile");
        //item.parentNode.classList.remove("possibleMoveTile");
        item.remove();
    });
}


function clearBoard() {
    while (gameboard.firstChild) {
        gameboard.firstChild.remove()
    } 
    winnerDiv.classList.remove('show')
}


function reset() {
    clearBoard()
    boardTiles = []
    allPiecesList = []
    whitePiecesList = [];
    blackPiecesList = [];
    possibleMovesList = [];
    whiteWins = false
    blackWins = false
    dragTarget = "";
    dropSpot = "";
    currentTurn = "black";
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function createChessPiece(pType, color, startingPosition) {
    let currentChessPiece = document.createElement("div");
    let currentPosition = document.querySelector(`#${startingPosition}`);
    currentChessPiece.classList.add("chessPiece");
    currentChessPiece.classList.add(color.substring(0, 1) + pType);
    currentChessPiece.dataset.color = color;
    currentChessPiece.dataset.type = pType;
    currentChessPiece.dataset.row = currentPosition.dataset.row;
    currentChessPiece.dataset.colNum = currentPosition.dataset.colNum;
    currentChessPiece.dataset.col = currentPosition.dataset.col;
    currentChessPiece.dataset.position = startingPosition;
    currentChessPiece.dataset.moved = "false";
    currentPosition.appendChild(currentChessPiece);
    currentPosition.dataset.occupied = "true";
    allPiecesList.push(currentChessPiece);
    if (color == "white" ) {whitePiecesList.push(currentChessPiece)}
    else {blackPiecesList.push(currentChessPiece)}
    createDraggable(currentChessPiece)
}


function addChessPieces() {
    for (let i = 0; i < alphabet.length; i++) {
        createChessPiece("Pawn", "white", `${alphabet[i]}2`);
        createChessPiece("Pawn", "black", `${alphabet[i]}7`);

        switch (i) {
            case 0:
                createChessPiece("Rook", "white", `${alphabet[i]}1`);
                createChessPiece("Rook", "black", `${alphabet[i]}8`);
                break;
            case 1:
                createChessPiece("Knight", "white", `${alphabet[i]}1`);
                createChessPiece("Knight", "black", `${alphabet[i]}8`);
                break;
            case 2:
                createChessPiece("Bishop", "white", `${alphabet[i]}1`);
                createChessPiece("Bishop", "black", `${alphabet[i]}8`);
                break;
            case 3:
                createChessPiece("Queen", "white", `${alphabet[i]}1`);
                createChessPiece("Queen", "black", `${alphabet[i]}8`);
                break;
            case 4:
                createChessPiece("King", "white", `${alphabet[i]}1`);
                createChessPiece("King", "black", `${alphabet[i]}8`);
                break;
            case 5:
                createChessPiece("Bishop", "white", `${alphabet[i]}1`);
                createChessPiece("Bishop", "black", `${alphabet[i]}8`);
                break;
            case 6:
                createChessPiece("Knight", "white", `${alphabet[i]}1`);
                createChessPiece("Knight", "black", `${alphabet[i]}8`);
                break;
            case 7:
                createChessPiece("Rook", "white", `${alphabet[i]}1`);
                createChessPiece("Rook", "black", `${alphabet[i]}8`);
                break;
        }
    }
}


function removePiece(piece) {
    let array;

    piece.dataset.color == "white" ? array = whitePiecesList : array = blackPiecesList;
    console.log(array)
    for (let i = 0; i < array.length; i++) {
        if (piece == array[i]) {
            array.splice(i, 1)
            break;
        }
    }
    piece.remove();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createBoard(pColor) {
    reset()
    rowNum = 0;
    colNum = 0;
    for (let r = 1; r <= 8; r++) {
        for (let c = 7; c >=0; c--) {
            let currentTile = createGridTile(r, c)
            if (pColor == "white") {
                if (r == 1 || c == 0) {
                    createTileLabel(currentTile, r, c, pColor)
                }
                boardTiles.unshift(currentTile)
                gameboard.prepend(currentTile)
            }
            else {
                if (r == 8 || c == 7) {
                    createTileLabel(currentTile, r, c, pColor)
                }
                boardTiles.push(currentTile)
                gameboard.append(currentTile)
            }
        }
    }
}



function createGridTile(rowNum, colNum) {
    const currentTile = document.createElement('div');
    currentTile.classList.add("gridTile");
    currentTile.dataset.row = rowNum;
    currentTile.dataset.colNum = colNum;
    currentTile.dataset.col = alphabet[colNum];
    currentTile.dataset.occupied = "false";
    currentTile.setAttribute('draggable', 'false')
    currentTile.setAttribute('id', `${alphabet[colNum]}${rowNum}`);
    createTileColor(currentTile, rowNum, colNum)
    //gameboard.appendChild(currentTile)
    return currentTile;
}


function createTileLabel(parentTile, rowNum, colNum, pColor) {
    if (pColor == "white"){   
        if (colNum == 0) {
            let labelTop = document.createElement('h4');
            labelTop.classList.add("gridTileLabel");
            //labelTop.classList.add("labelTopLeft");
            labelTop.textContent = rowNum;
            labelTop.setAttribute('draggable', 'false')
            parentTile.appendChild(labelTop)
        }
        if (rowNum == 1) {
            let labelBottom = document.createElement('h4');
            labelBottom.classList.add("gridTileLabel");
            labelBottom.classList.add("labelBottomRight");
            labelBottom.textContent = alphabet[colNum];
            labelBottom.setAttribute('draggable', 'false')
            parentTile.appendChild(labelBottom)
        }
    }
    else {
        if (colNum == 7) {
            let labelTop = document.createElement('h4');
            labelTop.classList.add("gridTileLabel");
            //labelTop.classList.add("labelTopLeft");
            labelTop.textContent = rowNum;
            labelTop.setAttribute('draggable', 'false')
            parentTile.appendChild(labelTop)
        }

        if (rowNum == 8) {
            let labelBottom = document.createElement('h4');
            labelBottom.classList.add("gridTileLabel");
            labelBottom.classList.add("labelBottomRight");
            labelBottom.textContent = alphabet[colNum];
            labelBottom.setAttribute('draggable', 'false')
            parentTile.appendChild(labelBottom)
        }
    }
}


function createTileColor(gridTile, r, c) {
    c--; //turn column to zero-based
    switch (r) {
        case 2:
        case 4:
        case 6:
        case 8:
            if (c%2 == 0) {
                gridTile.classList.add('darkTile')
            }
            else {
                gridTile.classList.add('lightTile') 
            }
            break;
        default:
            if ((c+1)%2 == 0) {
                gridTile.classList.add('darkTile')
            }
            else {
                gridTile.classList.add('lightTile') 
            }
            break;
    }

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function createPossibleMove(row, col) {
    let currentPossibleMove = document.createElement('div')
    currentPossibleMove.classList.add('possibleMove')
    //console.log(`${col}${row}`)
    let tile = document.querySelector(`#${col}${row}`)
    if (tile.dataset.occupied == "true") {
        currentPossibleMove.style.backgroundColor = "red"
        //tile.classList.add("possibleKillTile")
        //tile.style.backgroundColor = "red"
        //currentPossibleMove.style.width = "30%";
        //currentPossibleMove.style.height = "30%";
    }
    else {
        //tile.classList.add("possibleMoveTile")
    }
    tile.appendChild(currentPossibleMove)
    possibleMovesList.push(currentPossibleMove);
}


function checkPossibleMoves(piece) {
    document.querySelectorAll('.possibleMove').forEach(item => {
        item.remove();
    });
    possibleMovesList = [];

    switch(piece.dataset.type) {
        case "Pawn":
            createPawnPossibleMoves(piece)
            break;
        case "Rook":
            createRookPossibleMoves(piece) 
            break; 
        case "Bishop":
            createBishopPossibleMoves(piece)
            break; 
        case "Knight":
            createKnightPossibleMoves(piece)
            break; 
        case "Queen":
            createQueenPossibleMoves(piece)
            break; 
        case "King":
            createKingPossibleMoves(piece)
            break; 
    }

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkVerticalTile(row, col, pColor, rowDistance, kill) {
    let nullBool;
    rowDistance > 0 ? nullBool = (row + rowDistance <= 8) :  nullBool = (row + rowDistance >= 1)

    if (nullBool) { //check null
        let targetTileRow = row + rowDistance;
        let verticalTile = document.querySelector(`#${alphabet[col]}${targetTileRow}`)
        if (kill == true) {
            if (verticalTile.dataset.occupied == "true") {
                if (verticalTile.querySelector(".chessPiece").dataset.color != pColor) {
                    createPossibleMove(targetTileRow, alphabet[col])
                }
                return false;
            }
            else {
                createPossibleMove(targetTileRow, alphabet[col])
                return true 
            }
        }
        else {
            if (verticalTile.dataset.occupied == "false") { //check tile infront
                createPossibleMove(targetTileRow, alphabet[col])
                return true;
            }
            else {
                return false
            }
        }
    }
}




function checkHorizontalTile(row, col, pColor, colDistance, kill) {
    let nullBool;
    colDistance > 0 ? nullBool = (col + colDistance <= 7) : nullBool = (col + colDistance >= 0)

    if (nullBool) { //check null
        let targetTileColumn = alphabet[col + colDistance];
        let horizontalTile = document.querySelector(`#${targetTileColumn}${row}`)
        if (kill == true) {
            if (horizontalTile.dataset.occupied == "true") {
                if (horizontalTile.querySelector(".chessPiece").dataset.color != pColor) {
                    createPossibleMove(row, targetTileColumn)    
                }
                return false;
            }
            else {
                createPossibleMove(row, targetTileColumn)    
                return true 
            }
        }
        else {
            if (horizontalTile.dataset.occupied == "false") { //check tile infront
                createPossibleMove(row, targetTileColumn)
                return true;
            }
            else {
                return false
            }
        }
    }
}

function checkDiagonalTile(row, col, pColor, rowDistance, colDistance, kill, passive) {
    let rowNullBool
    let colNullBool

    rowDistance > 0 ? rowNullBool = (row + rowDistance <= 8) :  rowNullBool = (row + rowDistance >= 1)
    colDistance > 0 ? colNullBool = (col + colDistance <= 7) : colNullBool = (col + colDistance >= 0)

    if (rowNullBool && colNullBool) { //check null
        let targetTileColumn = alphabet[col + colDistance];
        let targetTileRow = row + rowDistance;


        let diagonalMove = document.querySelector(`#${targetTileColumn}${targetTileRow}`)
        if (kill == true) {
            if (diagonalMove.dataset.occupied == "true") {
                if (diagonalMove.querySelector(".chessPiece").dataset.color != pColor) { 
                    createPossibleMove(targetTileRow, targetTileColumn)
                }
                return false;
            }
            else {
                if (passive == false) {
                    createPossibleMove(targetTileRow, targetTileColumn)
                    return true;
                }
                return false;
            }
        }
        else {
            if (diagonalMove.dataset.occupied == "false" && passive == false) { 
                createPossibleMove(targetTileRow, targetTileColumn)
                return true;
            }
            else {
                return false;
            }
        }      
    }
}



function checkLTile(row, col, pColor, rowDistance, colDistance) {

    let rowNullBool
    let colNullBool

    rowDistance > 0 ? rowNullBool = (row + rowDistance <= 8) :  rowNullBool = (row + rowDistance >= 1)
    colDistance > 0 ? colNullBool = (col + colDistance <= 7) : colNullBool = (col + colDistance >= 0)

    if (rowNullBool && colNullBool) { //check null
        let targetTileColumn = alphabet[col + colDistance];
        let targetTileRow = row + rowDistance;
        let currentTargetTile = document.querySelector(`#${targetTileColumn}${targetTileRow}`)
        if (currentTargetTile.dataset.occupied == "false") {
            createPossibleMove(targetTileRow, targetTileColumn)
        }
        else if (currentTargetTile.querySelector(".chessPiece").dataset.color != pColor)  {
            createPossibleMove(targetTileRow, targetTileColumn);
        }    
    }

}


function checkCastlingTiles(piece) {
    if (piece.dataset.moved == "false") {
        let currentRow = Number(piece.dataset.row);
        let rookTile1 = document.querySelector(`#A${currentRow}`)
        let rookTile2 = document.querySelector(`#H${currentRow}`)
        console.log(rookTile1)
        console.log(rookTile2)
        if (rookTile1.dataset.occupied == "true") {
            let rook1 = rookTile1.querySelector(".chessPiece");
            if (rook1.dataset.type == "Rook" && rook1.dataset.color == piece.dataset.color) {
                if (rook1.dataset.moved == "false") {
                    if (document.querySelector(`#F${currentRow}`).dataset.occupied == "false" && document.querySelector(`#G${currentRow}`).dataset.occupied == "false") {
                        createPossibleMove(currentRow, "G")
                    }
                }
            }
        }

        if (rookTile2.dataset.occupied == "true") {
            let rook2 = rookTile2.querySelector(".chessPiece");
            if (rook2.dataset.type == "Rook" && rook2.dataset.color == piece.dataset.color) {
                if (rook2.dataset.moved == "false") {
                    if (document.querySelector(`#B${currentRow}`).dataset.occupied == "false" && document.querySelector(`#C${currentRow}`).dataset.occupied == "false" 
                    && document.querySelector(`#D${currentRow}`).dataset.occupied == "false") {
                        createPossibleMove(currentRow, "C")
                    }
                }
            }
        }
    }
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function checkForCheck(piece, targetSpot) {
    let targetColumn = targetSpot.dataset.col;
    let targetRow = targetSpot.dataset.row;

    let currentColor = piece.dataset.color;
    let enemyColor;
    currentColor == "white" ? enemyColor = "black" : enemyColor = "white";

    




}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function createPawnPossibleMoves(piece) {

    let currentColNum = Number(piece.dataset.colNum);
    let currentRow = Number(piece.dataset.row);

    if (piece.dataset.color == "white") {
        if (checkVerticalTile(currentRow, currentColNum, "white", 1, false)) { // check first tile
            if (piece.dataset.moved == "false") {checkVerticalTile(currentRow, currentColNum, "white", 2, false)} // check second tile
        }

        checkDiagonalTile(currentRow, currentColNum, "white", 1, 1, true, true)
        checkDiagonalTile(currentRow, currentColNum, "white", 1, -1, true, true) 
    }
    else {
        if (checkVerticalTile(currentRow, currentColNum, "black", -1, false)) { // check first tile
            if (piece.dataset.moved == "false") {checkVerticalTile(currentRow, currentColNum, "black", -2, false)} // check second tile
        }

        checkDiagonalTile(currentRow, currentColNum, "black", -1, 1, true, true)
        checkDiagonalTile(currentRow, currentColNum, "black", -1, -1, true, true)  
    }
}


function createRookPossibleMoves(piece) {
    let currentColNum = Number(piece.dataset.colNum);
    let currentRow = Number(piece.dataset.row);

    let colDistance = 1;
    while (checkHorizontalTile(currentRow, currentColNum, piece.dataset.color, colDistance, true)) {
        colDistance++
    }

    colDistance = -1;
    while (checkHorizontalTile(currentRow, currentColNum, piece.dataset.color, colDistance, true)) {
        colDistance--
    }

    let rowDistance = 1;
    while (checkVerticalTile(currentRow, currentColNum, piece.dataset.color, rowDistance, true, false)) {
        rowDistance++
    }

    rowDistance = -1;
    while (checkVerticalTile(currentRow, currentColNum, piece.dataset.color, rowDistance, true, false)) {
        rowDistance--
    }
}

function createBishopPossibleMoves(piece) {
    let currentColNum = Number(piece.dataset.colNum);
    let currentRow = Number(piece.dataset.row);

    let enemyColor;
    piece.dataset.color == "white" ? enemyColor = "black" : enemyColor = "white";

    let rowDistance = 1;
    let colDistance = 1;
    while (checkDiagonalTile(currentRow, currentColNum, piece.dataset.color, rowDistance, colDistance, true, false)) {
        rowDistance++
        colDistance++
    }

    rowDistance = 1;
    colDistance = -1;
    while (checkDiagonalTile(currentRow, currentColNum, piece.dataset.color, rowDistance, colDistance, true, false)) {
        rowDistance++
        colDistance--
    }

    rowDistance = -1;
    colDistance = -1;
    while (checkDiagonalTile(currentRow, currentColNum, piece.dataset.color, rowDistance, colDistance, true, false)) {
        rowDistance--
        colDistance--
    }

    rowDistance = -1;
    colDistance = 1;
    while (checkDiagonalTile(currentRow, currentColNum, piece.dataset.color, rowDistance, colDistance, true, false)) {
        rowDistance--
        colDistance++
    }
}



function createKnightPossibleMoves(piece) {
    let currentColNum = Number(piece.dataset.colNum);
    let currentRow = Number(piece.dataset.row);

    checkLTile(currentRow, currentColNum, piece.dataset.color, 2, 1)
    checkLTile(currentRow, currentColNum, piece.dataset.color, 2, -1)
    checkLTile(currentRow, currentColNum, piece.dataset.color, -2, 1)
    checkLTile(currentRow, currentColNum, piece.dataset.color, -2, -1)
    checkLTile(currentRow, currentColNum, piece.dataset.color, 1, 2)
    checkLTile(currentRow, currentColNum, piece.dataset.color, 1, -2)
    checkLTile(currentRow, currentColNum, piece.dataset.color, -1, 2)
    checkLTile(currentRow, currentColNum, piece.dataset.color, -1, -2)

}


function createQueenPossibleMoves(piece) {
    createRookPossibleMoves(piece)
    createBishopPossibleMoves(piece)
}

function createKingPossibleMoves(piece) {
    let currentColNum = Number(piece.dataset.colNum);
    let currentRow = Number(piece.dataset.row);

    checkVerticalTile(currentRow, currentColNum, piece.dataset.color, 1, true, false)
    checkVerticalTile(currentRow, currentColNum, piece.dataset.color, -1, true, false)
    checkHorizontalTile(currentRow, currentColNum, piece.dataset.color, 1, true)
    checkHorizontalTile(currentRow, currentColNum, piece.dataset.color, -1, true)
    checkDiagonalTile(currentRow, currentColNum, piece.dataset.color, 1, 1, true, false)
    checkDiagonalTile(currentRow, currentColNum, piece.dataset.color, 1, -1, true, false)
    checkDiagonalTile(currentRow, currentColNum, piece.dataset.color, -1, -1, true, false)
    checkDiagonalTile(currentRow, currentColNum, piece.dataset.color, -1, 1, true, false)
    checkCastlingTiles(piece)

}




function castleRook(piece, target) {
    if (piece.dataset.type ==  "King" && piece.dataset.moved == "false") {
        if (target.dataset.row == piece.dataset.row) {
            if (target.dataset.col == "G") {
                let edgeTile = document.querySelector(`#H${piece.dataset.row}`)
                edgeTile.dataset.occupied = "false";
                let currentRook = edgeTile.querySelector(".chessPiece")
                let targetTile = document.querySelector(`#F${piece.dataset.row}`)
                targetTile.appendChild(currentRook);
                edgeTile.dataset.occupied = "true";
                currentRook.dataset.position = targetTile.id;
                currentRook.dataset.moved = "true";
                currentRook.dataset.colNum = targetTile.dataset.colNum;
                currentRook.dataset.col = targetTile.dataset.col;
                currentRook.dataset.row = targetTile.dataset.row;
            }
            else if (target.dataset.col == "C") {
                let edgeTile = document.querySelector(`#A${piece.dataset.row}`)
                edgeTile.dataset.occupied = "false";
                let currentRook = edgeTile.querySelector(".chessPiece")
                let targetTile = document.querySelector(`#D${piece.dataset.row}`)
                targetTile.appendChild(currentRook);
                edgeTile.dataset.occupied = "true";
                currentRook.dataset.position = targetTile.id;
                currentRook.dataset.moved = "true";
                currentRook.dataset.colNum = targetTile.dataset.colNum;
                currentRook.dataset.col = targetTile.dataset.col;
                currentRook.dataset.row = targetTile.dataset.row;
            }

        }
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkDrop(coordinate, container) {
  if (coordinate.x <= container.getBoundingClientRect().x + container.getBoundingClientRect().width && coordinate.x >= container.getBoundingClientRect().x) {
    if ((coordinate.y >= container.getBoundingClientRect().y) && (coordinate.y <= container.getBoundingClientRect().y + container.getBoundingClientRect().height)) {
      dropSpot = container;
      return true
    }
  }
  else {
    return false
  }
}

function startMovingPiece(piece, eventTarget) {
    piece.style.cursor = "grabbing"
    piece.style.zIndex = 9999
    piece.style.position = "absolute";
    piece.style.left = (eventTarget.clientX) - (piece.offsetWidth/2) + window.scrollX + 'px'
    piece.style.top = (eventTarget.clientY) - (piece.offsetHeight/1.2) + window.scrollY + 'px'
    document.body.appendChild(piece)
    offSet = [piece.offsetLeft - eventTarget.clientX, piece.offsetTop - eventTarget.clientY]
}

function dropPiece(piece, targetSpot) {
    piece.style.removeProperty('left');
    piece.style.removeProperty('top');
    piece.style.zIndex = 1234;
    piece.style.position = "relative";

    targetSpot.appendChild(piece);
    targetSpot.dataset.occupied = "true";

    piece.dataset.position = targetSpot.id;
    piece.dataset.moved = "true";
    piece.dataset.colNum = targetSpot.dataset.colNum;
    piece.dataset.col = targetSpot.dataset.col;
    piece.dataset.row = targetSpot.dataset.row;
}


function resetPiecePosition(elem, parent) {
    elem.style.position = "relative";
    elem.style.removeProperty('left');
    elem.style.removeProperty('top');
    elem.style.zIndex = 1234;
    parent.appendChild(elem);
}

function clearDragInfo() {
    dropSpot = "";
}


function customMouseDragEvents(element, elementParent) {
    element.addEventListener('mousedown', (e) => {
      //e.preventDefault()
      dragTarget = e.target;
      elementParent = dragTarget.parentNode;
      if (dragTarget.dataset.color == currentTurn) {
        if (!clicked) {
            document.querySelectorAll(".gridTile").forEach((tile) => {
                tile.classList.remove("highlight")
            })
            dragTarget.classList.add("bigger")
            elementParent.classList.add("highlight")
            checkPossibleMoves(dragTarget)
            createClickablePossibleMoves(dragTarget, elementParent) 
            startMovingPiece(dragTarget, e)
            clicked = true;
        }
      }
    })
  
    element.addEventListener('mouseup', (e) => { 
      if (dragTarget != "") {
        dragTarget.style.cursor = "grab"
        dragTarget.classList.remove("bigger")
      }
      let currentMouse = {
        x : e.clientX,
        y : e.clientY
      };

      if (clicked == true) {
        for (let i = 0; i < possibleMovesList.length; i++) {
            if (checkDrop(currentMouse, possibleMovesList[i].parentNode)) {
                break;
            }
        }
      }

      clicked = false;
      if (dropSpot != "") {
        if (dropSpot.dataset.occupied == "true") {
            removePiece(dropSpot.querySelector(".chessPiece"))
        }
        elementParent.dataset.occupied = "false";
        castleRook(dragTarget, dropSpot) 
        dropPiece(dragTarget, dropSpot)
        nextTurn();
      }
      else {
        resetPiecePosition(dragTarget, elementParent);
      }
      clearDragInfo() 
    })

}


function customTouchDragEvents(element, elementParent) {
    element.addEventListener('touchstart', (e) => {
        e.preventDefault()
        if (e.touches.length > 1) {  
          e.preventDefault();
        }
        dragTarget = e.target;
        elementParent = dragTarget.parentNode;
        if (dragTarget.dataset.color == currentTurn) {
            if (!clicked) {
                dragTarget.classList.add("bigger")
                elementParent.classList.add("highlight")
                checkPossibleMoves(dragTarget)
                createClickablePossibleMoves(dragTarget, elementParent) 
                startMovingPiece(dragTarget, e.touches[0])
                clicked = true 
            }
        }
          
    }, { passive: false})
    
     
    
    element.addEventListener('touchend', (e) => { 
        let currentTouch = {
          x : e.changedTouches[0].clientX,
          y : e.changedTouches[0].clientY
        };
        if (clicked == true) {
            for (let i = 0; i < possibleMovesList.length; i++) {
                if (checkDrop(currentTouch, possibleMovesList[i].parentNode)) {
                    break;
                }
            }
        }

        dragTarget.classList.remove("bigger")
        clicked = false;
        if (dropSpot != "") {
            if (dropSpot.dataset.occupied == "true") {
                removePiece(dropSpot.querySelector(".chessPiece"))
            }
            elementParent.dataset.occupied = "false";
            dropPiece(dragTarget, dropSpot)
            nextTurn();
        }
        else {
            resetPiecePosition(dragTarget, elementParent);
        }

        clearDragInfo()
    }) 

}


function createDraggable(elem) {
    let dragParent;
    customMouseDragEvents(elem, dragParent)
    customTouchDragEvents(elem, dragParent)
}

document.addEventListener('mousemove', (e) => {
    if (clicked == true) {
      dragTarget.style.left = (e.clientX + offSet[0]) + 'px'
      dragTarget.style.top = (e.clientY+ offSet[1]) + 'px' 
    } 
})

document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {  
       e.preventDefault();
    }
    if (clicked == true) {
      dragTarget.style.left = (e.touches[0].clientX + offSet[0]) + 'px'
      dragTarget.style.top = (e.touches[0].clientY+ offSet[1]) + 'px' 
    } 
}, { passive: false})




function createClickablePossibleMoves(piece, oldParent) {

    possibleMovesList.forEach((possibleMove) => {
        possibleMove.addEventListener('click', (e) => { 
            if (possibleMove.parentNode.dataset.occupied == "true") {
                removePiece(possibleMove.parentNode.querySelector(".chessPiece"))
            }
            oldParent.dataset.occupied = "false";

            castleRook(piece, possibleMove.parentNode) 

            piece.style.removeProperty('left');
            piece.style.removeProperty('top');
            piece.style.zIndex = 1234;
            piece.style.position = "relative";
        
            possibleMove.parentNode.appendChild(piece);
            possibleMove.parentNode.dataset.occupied = "true";
            piece.dataset.position = possibleMove.parentNode.id;
            piece.dataset.moved = "true";
        
            piece.dataset.colNum = possibleMove.parentNode.dataset.colNum;
            piece.dataset.col = possibleMove.parentNode.dataset.col;
            piece.dataset.row = possibleMove.parentNode.dataset.row;
        
            nextTurn();
        })
    })
     
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createErrorNotification(msg, parent) {
    const messageDiv = document.createElement('div')
    messageDiv.classList.add('errorMessage')
    const messageText = document.createElement('p')
    messageText.textContent = msg
    messageText.classList.add('errorMessageText')
    messageDiv.appendChild(messageText)
    const closeBtn = document.createElement('button')
    closeBtn.classList.add('matchButton')
    closeBtn.innerHTML = 'Close &#10006'
    messageDiv.appendChild(closeBtn)
    parent.appendChild(messageDiv)

    closeBtn.addEventListener('click', (e) => { 
        messageDiv.remove()
    })
}

function fadeIn(elem, increment, interval) {
    let opacity = 0
    let fadeI = setInterval(() => {
      opacity += increment//.05
      elem.style.opacity = opacity
      if (elem.style.opacity >= 1) {
        clearInterval(fadeI)
      } 
    }, interval) //20
}
