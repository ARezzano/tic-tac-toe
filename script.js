const Gameboard = (()=>{
    const board = [null,null,null,null,null,null,null,null,null];
    return {getBoard: ()=> [...board]}
})();

function newPlayer(name,marker){
    return {name,marker};
}

const gameManager = (() => {
    const player1 = newPlayer("Player 1", "X");
    const player2 = newPlayer("Player 2", "O");
    let currentTurn = player1;

    const winConditions = () => {
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,4,8],
        [2,4,6],
        [0,3,6],
        [1,4,7],
        [2,5,8]
    }

    const getWinner = () => {
        const board = Gameboard.getBoard();

        for(const condition of winConditions){
            const [a,b,c] = condition;

            if(board[a] && board[a] === board[b] && board[a] === board[c]){
                return board[a] === player1.marker ? player1 : player2;
            }

            if(!board.includes(null)){
                return "draw";
            }

            return null;
        }

        return{
            currentTurn,
            getWinner
        }
    }
})();
