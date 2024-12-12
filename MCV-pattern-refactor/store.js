const initialValue = { //all the initial conditions
    moves: [],
    history: {
        currentGame: [],
        allGame: [],
    }
};

export default class Store {
    #state = initialValue; // Initialize private state

    constructor(player) {
        this.player = player;
    }
    // get the status after the end of the game

    get stats() {
        const state = this.#getstate();
    
        return {
          playerWithStats: this.player.map((player) => {
            const wins = state.history.currentGame.filter(
              (game) => game.status.winner?.id === player.id
            ).length;
    
            return {
              ...player,
              wins,
            };
          }),
          ties: state.history.currentGame.filter(
            (game) => game.status.winner === null
          ).length,
        };
      }
      // determining the result of the game after each round

    get game() {
        const state = this.#getstate();
        const currentPlayer = this.player[state.moves.length % 2];
        let winner = null;

        const winningPatterns = [
            [1, 2, 3], [1, 5, 9], [1, 4, 7], [2, 5, 8], //all the winning patterns in the tic tac toe game
            [3, 5, 7], [3, 6, 9], [4, 5, 6], [7, 8, 9],
        ];

        for (const player of this.player) {
            const selectedSquares = state.moves
                .filter((move) => move.player.id === player.id)
                .map((move) => move.squareId);

            for (const pattern of winningPatterns) {
                if (pattern.every((v) => selectedSquares.includes(v))) {
                    winner = player;
                    break;
                }
            }
        }

        return {
            moves: state.moves,
            currentPlayer,
            status: {
                isComplete: winner !== null || state.moves.length === 9,
                winner,
            }
        };
    }
    // updating the moves in the squares
    playerMove(squareId) {
        const stateClone = structuredClone(this.#getstate());
        stateClone.moves.push({
            squareId,
            player: this.game.currentPlayer
        });
        this.#savestate(stateClone);
    }
    // reseting the game
    reset() {
        const stateClone = structuredClone(this.#getstate());
        const { status, moves } = this.game;
        if (status.isComplete) {
            stateClone.history.currentGame.push({
                moves,
                status,
            });
        }
        stateClone.moves = []; // Reset moves for new round
        this.#savestate(stateClone);
    }
    // making a new round in the game
    newRound() {
        this.reset();
    
        const stateClone = structuredClone(this.#getstate());
        stateClone.history.allGame.push(...stateClone.history.currentGame);
        stateClone.history.currentGame = [];
    
        this.#savestate(stateClone);
      }

    // Private method to get the current state
    #getstate() {
        return this.#state;
    }

    // Private method to save or update the state
    #savestate(stateOrFn) {
        const prevState = this.#getstate();
        let newState;

        switch (typeof stateOrFn) {
            case "function":
                newState = stateOrFn(prevState);
                break;
            case "object":
                newState = stateOrFn;
                break;
            default:
                throw new Error("Invalid argument passed to save state");
        }

        this.#state = newState;
    }
}

