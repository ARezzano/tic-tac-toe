const startButton = document.querySelector("#start-button");
const leftContent = document.querySelector(".left-content");
const playerNames = document.querySelector(".player-names");
const boardCells = document.querySelectorAll(".board-cell");
const player1Name = document.getElementById("player1-name");
const player2Name = document.getElementById("player2-name");

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
        const test = document.createElement("p");
        test.textContent = "helloooooo"
        leftContent.appendChild(test);
    }

    return {
        getBoard: ()=> [...board],
        placeMarker,
        resetGame
    }
})();

function newPlayer(name,marker){
    return {
        name,
        marker
    };
}

startButton.addEventListener("click",function(){
    hasStarted = true;

    let player1Input = player1Name.value || "Player 1";
    let player2Input = player2Name.value || "Player 2";

    gameManager.init(player1Input, player2Input);


    leftContent.removeChild(playerNames);
    leftContent.removeChild(startButton);

    resetButton = document.createElement("button");
    resetButton.textContent = "Reset";
    resetButton.addEventListener("click",()=> Gameboard.resetGame() );
    leftContent.appendChild(resetButton);

    updateTurn();
});

const gameManager = (() => {
    let player1;
    let player2;
    let currentTurn;
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

    const init = (name1, name2) => {
        player1 = newPlayer(name1, "X");
        player2 = newPlayer(name2, "O");
        currentTurn = player1;
        winner = null;
    };

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

    const getCurrentTurn = () => currentTurn;

    const getPlayer1 = () => player1;
    const getPlayer2 = () => player2;

    return{
        init,
        getWinner,
        playTurn,
        getCurrentTurn,
        getPlayer1,
        getPlayer2
    }
})();

let playerTurnDisplay = document.createElement("p");

const updateTurn = function() {
    const currentPlayer = gameManager.getCurrentTurn();
    playerTurnDisplay.textContent = `It's ${currentPlayer.name}'s turn`;
    leftContent.appendChild(playerTurnDisplay);
}

boardCells.forEach(function(cell, index){
    let hasBeenClicked = false;

    cell.addEventListener("click",()=>{
        if((hasStarted === true) && (!hasBeenClicked)){
            const currentPlayer = gameManager.getCurrentTurn();

            const result = gameManager.playTurn(index);

            if(currentPlayer === gameManager.getPlayer1()){
                cell.style.backgroundColor = "blue";
            }else if(currentPlayer === gameManager.getPlayer2()){
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
            if(gameManager.getCurrentTurn() === gameManager.getPlayer1()){
                cell.style.backgroundColor = "red";
            }else if(gameManager.getCurrentTurn() === gameManager.getPlayer2()){
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

//next commit: export resetGame(), player turn now displayed correctly