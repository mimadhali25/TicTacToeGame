import Store from "./store.js"; // Correct import path and class name
import View from "./view.js";

const player = [
    { id: 1, name: "Player 1", iconClass: "fa-x", colorClass: "turquoise" },
    { id: 2, name: "Player 2", iconClass: "fa-o", colorClass: "yellow" },
];

function init() {
    const view = new View();
    const store = new Store(player);

    // Bind reset button to reset game state
    view.bindResetButton((type) => {
        if (type === "reset") {
            view.closeAll();
            store.reset();
            view.clearBoard();
            view.setturnIndicator(store.game.currentPlayer);
        } else if (type === "model") {
            view.closeAll();
            view.clearBoard();
            store.reset();
            view.setturnIndicator(store.game.currentPlayer);
        }
        view.updateScoreboard(store.stats.playerWithStats[0].wins,store.stats.playerWithStats[1].wins,store.stats.ties);
    });

    // Bind "new round" button event 
    view.bindNewRoundButton(() => {
        store.newRound(); 
        view.closeAll();
        view.clearBoard();
        view.setturnIndicator(store.game.currentPlayer);
        view.updateScoreboard(store.stats.playerWithStats[0].wins,store.stats.playerWithStats[1].wins,store.stats.ties);
    });

    // Bind square click event
    view.bindEveryMove((square) => {
        const existingMove = store.game.moves.find((move) => move.squareId === +square.id);
        if (existingMove) {
            return;
        }
        view.handlePlayerMove(square, store.game.currentPlayer);
        store.playerMove(+square.id);

        if (store.game.status.isComplete) {
            view.showModel(store.game.status.winner ? `${store.game.status.winner.name} wins!` : "Tie Game!");
            return;
        }
        view.setturnIndicator(store.game.currentPlayer);
    });
}

window.addEventListener("load", init);

