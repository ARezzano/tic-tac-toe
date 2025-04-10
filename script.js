const startButton = document.querySelector("#start-button");
const leftContent = document.querySelector(".left-content");
const playerNames = document.querySelector(".player-names");
const boardCells = document.querySelectorAll(".board-cell");
let hasStarted = false;

const Gameboard = (()=>{
    const board = [null,null,null,null,null,null,null,null,null];

    const placeMarker = (index,marker) => {
        if(board[index] === null){
            board[index] = marker;
            return true;
        }
        return false;
    }

    const resetGame = () => {
        for(let i = 0; i < board.length; i++){
            board[i] = null;
        }
    }

    return {
        getBoard: ()=> [...board],
        placeMarker
    }
})();

function newPlayer(name,marker){
    return {
        name,
        marker
    };
}

const gameManager = (() => {
    const player1 = newPlayer("Player 1", "X");
    const player2 = newPlayer("Player 2", "O");
    let currentTurn = player1;
    let winner = null;

    const winConditions = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,4,8],
        [2,4,6],
        [0,3,6],
        [1,4,7],
        [2,5,8]
    ];

    const getWinner = () => {
        const board = Gameboard.getBoard();


        if(!board.includes(null)){
            return "draw";
        }

        for(const condition of winConditions){
            const [a,b,c] = condition;

            if(board[a] && board[a] === board[b] && board[a] === board[c]){
                return board[a] === player1.marker ? player1 : player2;
            }
        }

        return null;

    }

    const playTurn = (index) => {
        const board = Gameboard.getBoard();

        if(board[index] === null && !winner){
            Gameboard.placeMarker(index,currentTurn.marker);
            winner = getWinner();

            if(!winner){
                currentTurn = currentTurn === player1 ? player2: player1;
            }

            return {
                board: Gameboard.getBoard(),
                winner: winner
            };
        }

        return null;
    }

    return{
        getCurrentTurn: () => currentTurn,
        getWinner,
        playTurn,
        player1,
        player2
    }
})();

let playerTurnDisplay = document.createElement("p");

const updateTurn = function(){
    playerTurnDisplay.textContent = `It's ${gameManager.getCurrentTurn().name}'s turn`;
    leftContent.appendChild(playerTurnDisplay);
}

startButton.addEventListener("click",function(){
    leftContent.removeChild(playerNames);
    leftContent.removeChild(startButton);
    hasStarted = true;

    resetButton = document.createElement("button");
    resetButton.textContent = "Reset";
    resetButton.addEventListener("click",()=> Gameboard.resetGame );
    leftContent.appendChild(resetButton);

    updateTurn();
});

boardCells.forEach(function(cell, index){
    let hasBeenClicked = false;

    cell.addEventListener("click",()=>{
        if((hasStarted === true) && (!hasBeenClicked)){
            const currentPlayer = gameManager.getCurrentTurn();

            const result = gameManager.playTurn(index);

            if(currentPlayer === gameManager.player1){
                cell.style.backgroundColor = "blue";
            }else if(currentPlayer === gameManager.player2){
                cell.style.backgroundColor = "purple";
            }

            hasBeenClicked = true;

            if(result){
                if (result.winner){
                    if(result.winner === "draw"){
                        alert("It's a draw!");
                    }else{
                        alert(`${result.winner.name} wins!`);
                    }
                } else {
                    updateTurn();
                }
            }
        }

        console.log(gameManager.currentTurn);//check if player turn changed
    });

    cell.addEventListener("mouseenter", ()=>{
        if((hasStarted === true) && (!hasBeenClicked)){
            if(gameManager.getCurrentTurn() === gameManager.player1){
                cell.style.backgroundColor = "red";
            }else if(gameManager.getCurrentTurn() === gameManager.player2){
                cell.style.backgroundColor = "green";
            }
        }
    });

    cell.addEventListener("mouseleave",()=>{
        if(!hasBeenClicked){
            cell.style.backgroundColor = "white";
        }
    });

});

//find out why painted cells != board elements