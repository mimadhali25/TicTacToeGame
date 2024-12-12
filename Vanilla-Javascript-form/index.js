const game = {
    $: {
        //selecting all the HTML elements
        actionsmenu: document.querySelector('[data-id="actions"]'),
        actionbutton: document.querySelector('[data-id="actionsitems"]'),
        resetbutton: document.querySelector('[data-id="resetbtn"]'),
        newroundbutton: document.querySelector('[data-id="newround"]'),
        squarebutton: document.querySelectorAll('[data-id="square"]'),
        model: document.querySelector('[data-id="model"]'),
        modelcontainer: document.querySelector('[data-id="modelcontainer"]'),
        modeltext: document.querySelector('[data-id="modeltext"]'),
        modelbutton: document.querySelector('[data-id="modelbutton"]'),
        turn: document.querySelector('[data-id="turn"]'),
        turntext: document.querySelector('[data-id="turntext"]'),
        turnbutton: document.querySelector('[data-id="turnbutton"]'),
        resultp1: document.querySelector('[data-id="resultp1"]'),
        resulttextp1: document.querySelector('[data-id="resulttextp1"]'),
        resultspanp1: document.querySelector('[data-id="resultspanp1"]'),
        resulttie: document.querySelector('[data-id="resulttie"]'),
        resulttexttie: document.querySelector('[data-id="resulttexttie"]'),
        resultspantie: document.querySelector('[data-id="resultspantie"]'),
        resultp2: document.querySelector('[data-id="resultp2"]'),
        resulttextp2: document.querySelector('[data-id="resulttextp2"]'),
        resultspanp2: document.querySelector('[data-id="resultspanp2"]'),


    },

    state: {
        moves: [],
        p1winner: 0,
        p2winner: 0,
        ties: 0,
    },

    getGameStatus(moves)
    {
        const p1moves = moves.filter(move => move.playerId===1).map(move=>+move.squareId); //still not getting this
        const p2moves = moves.filter(move=>move.playerId===2).map(move=>+move.squareId);
        const winningPatterns = [
            [1, 2, 3],
            [1, 5, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 5, 7],
            [3, 6, 9],
            [4, 5, 6],
            [7, 8, 9],
          ];
          let winner = null;
          let count1=0;
          let count2=0;
          //checking for winning patterns
          winningPatterns.forEach((patterns)=>
        {
            const p1wins = patterns.every((v)=>p1moves.includes(v));
            const p2wins = patterns.every((v)=>p2moves.includes(v));
            if(p1wins) 
                {winner = 1;
                }
            if(p2wins) 
                {winner = 2;
                }
        });
        //updating the counter after every win or tie

        if(winner===1)
        {
            game.state.p1winner+=1;
        }
        else if(winner===2)
        {
            game.state.p2winner+=1;
        }
        else if(moves.length===9){
            game.state.ties+=1;
        }
        //returning the status
            
        return{
            status:moves.length===9||winner!=null?"completed":"in progress",
            winner,
        };

    },

    init() {
        game.registerEvents();
    },

    registerEvents() {
        if (game.$.actionsmenu && game.$.actionbutton) {
            //toggeling the hidden menu  button
            game.$.actionsmenu.addEventListener("click", (event) => {
                game.$.actionbutton.classList.toggle("hidden");
            });
        }
            //triggering the reset button
        if (game.$.resetbutton) {
            game.$.resetbutton.addEventListener("click", (event) => {
                //resetting the counter of wins and ties
                game.state.player1Wins = 0;
                game.state.player2Wins = 0;
                game.state.ties = 0;
                //reseting the moves and updating the turn text
                game.state.moves = [];
                game.$.squarebutton.forEach((square)=>square.replaceChildren());
                const icon = document.createElement("i");
                icon.classList.add("fa-solid", "fa-x");
                const label = document.createElement("p");
                label.textContent="Player 1, You can go!";    
                game.$.turn.replaceChildren(icon,label);
                //updating the scoreboard after reset
                game.$.resultspanp1.textContent="0 Wins";
                game.$.resultspanp2.textContent="0 Wins";
                game.$.resultspantie.textContent="0";
                window.location.reload();

            });
        }
            //triggering the new round
        if (game.$.newroundbutton) {
            game.$.newroundbutton.addEventListener("click", (event) => {
                //reseting only the moves and updating the turn text
                game.state.moves = [];
                game.$.squarebutton.forEach((square)=>square.replaceChildren());
                const icon = document.createElement("i");
                icon.classList.add("fa-solid", "fa-x");
                const label = document.createElement("p");
                label.textContent="Player 1, You can go!";    
                game.$.turn.replaceChildren(icon,label);
            });
        }
        //functioning of the play again button
        if(game.$.modelbutton)
        {
            game.$.modelbutton.addEventListener("click",(event)=>
            {
                //reseting the moves and updating the turn text
                game.state.moves = [];
                game.$.squarebutton.forEach((square)=>square.replaceChildren());
                const icon = document.createElement("i");
                icon.classList.add("fa-solid", "fa-x");
                const label = document.createElement("p");
                label.textContent="Player 1, You can go!";    
                game.$.turn.replaceChildren(icon,label);
                game.$.model.classList.toggle("hidden");

               
            });
        }

        if (game.$.squarebutton) {
            //adding a click event listener to each square
            game.$.squarebutton.forEach((square) => {
                square.addEventListener("click", (event) => {
                    //checking whether there is already any element
                    if (square.hasChildNodes()) {
                        return;
                    }
                    //tracking the current player from the moves object
                    const lastMove = game.state.moves.at(-1);
                    const oppPlayer = (playerId)=> (playerId===1?2:1); //helper function to get the opposite player
                    const currentPlayer = game.state.moves.length===0?1:oppPlayer(lastMove.playerId);
                    const opponent = oppPlayer(currentPlayer);
                    //adding the icons according to the player id
                    const icon = document.createElement("i");
                    const turnicon = document.createElement("i");
                    const turnlabel = document.createElement("p");
                    //after every click this will execute
                    turnlabel.innerText=`Player${opponent}, You can go!`;
                    if (currentPlayer === 1) {
                        icon.classList.add("fa-solid", "fa-x");
                        turnicon.classList.add("fa-solid", "fa-0");
                    } else {
                        icon.classList.add("fa-solid", "fa-o");
                        turnicon.classList.add("fa-solid", "fa-x");
                    }
                    game.$.turn.replaceChildren(turnicon,turnlabel);
                    //updating the moves object after every play

                    game.state.moves.push({
                        squareId : +square.id,
                        playerId : currentPlayer
                    });
                    //finally appending the icon

                    square.replaceChildren(icon);
                    //getting the result from the status function
                    const result = game.getGameStatus(game.state.moves);
                    if(result.status=="completed")
                    {
                        //showing the final model
                        game.$.model.classList.toggle('hidden');
                        let message="";
                        if(result.winner)
                       message= `Player ${result.winner} wins!`;
                    else{
                        message="Tie Game";
                    }
                    game.$.modeltext.textContent=message;
                    }
                    //updating the score board after every win

                    if(result.winner===1)
                    {
                        game.$.resultspanp1.textContent=`${game.state.p1winner}wins`;
                    }
                    else if(result.winner===2)
                    {
                        game.$.resultspanp2.textContent=`${game.state.p2winner}wins`;
                    }
                    else{
                        game.$.resultspantie.textContent=`${game.state.ties}`;
                    }

                      
                });
            });
        }
    },
};

window.addEventListener("load", () => game.init());
