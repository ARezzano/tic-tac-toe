const startButton = document.querySelector("#start-button");
const leftContent = document.querySelector(".left-content");
const playerNames = document.querySelector(".player-names");

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
        currentTurn,
        getWinner,
        playTurn
    }
})();


startButton.addEventListener("click",function(){
    leftContent.removeChild(playerNames);
    leftContent.removeChild(startButton);

    let playerTurnDisplay = document.createElement("p");
    playerTurnDisplay.textContent = `It's ${gameManager.currentTurn.name}'s turn`;
    leftContent.appendChild(playerTurnDisplay);
});
