const Gameboard = (()=>{
    const board = [null,null,null];
    return {getBoard: ()=> [...board]}
})();

function newPlayer(name,marker){
    return {name,marker};
}

const gameManager = (() => {
    
})();
