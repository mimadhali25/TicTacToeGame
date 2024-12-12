export default class View {
    $ = {}; //declaring namespaces
    $$ = {};

    constructor() {
        //selecting all the HTML elements
        this.$.actionsmenu = document.querySelector('[data-id="actions"]');
        this.$.actionbutton = document.querySelector('[data-id="actionsitems"]');
        this.$.resetbutton = document.querySelector('[data-id="resetbtn"]');
        this.$.newroundbutton = document.querySelector('[data-id="newround"]');
        this.$.model = document.querySelector('[data-id="model"]');
        this.$.modelcontainer = document.querySelector('[data-id="modelcontainer"]');
        this.$.modeltext = document.querySelector('[data-id="modeltext"]');
        this.$.modelbutton = document.querySelector('[data-id="modelbutton"]');
        this.$.turn = document.querySelector('[data-id="turn"]');
        this.$.turntext = document.querySelector('[data-id="turntext"]');
        this.$.resultp1 = document.querySelector('[data-id="resultp1"]');
        this.$.resultspanp1 = document.querySelector('[data-id="resultspanp1"]');
        this.$.resulttie = document.querySelector('[data-id="resulttie"]');
        this.$.resultspantie = document.querySelector('[data-id="resultspantie"]');
        this.$.resultp2 = document.querySelector('[data-id="resultp2"]');
        this.$.resultspanp2 = document.querySelector('[data-id="resultspanp2"]');
        this.$$.squarebutton = document.querySelectorAll('[data-id="square"]');

        // UI only events
        this.$.actionsmenu.addEventListener("click", (event) => {
            this.#togglemenu();
        });
    }
    //functions that are handled by the controllers in app.js file
    bindResetButton(handler) {
        const handlerWithCheck = (event) => {
            if (event.target === this.$.resetbutton) {
                handler("reset");
            } else if (event.target === this.$.modelbutton) {
                handler("model");
            }
        };
        this.$.resetbutton.addEventListener("click", handlerWithCheck);
        this.$.modelbutton.addEventListener("click", handlerWithCheck);
    }

    bindNewRoundButton(handler) {
        this.$.newroundbutton.addEventListener("click", handler);
    }

    bindEveryMove(handler) {
        this.$$.squarebutton.forEach((square) => {
            square.addEventListener("click", () => handler(square));
        });
    }
    //all the utility functions for updating the UI

    clearBoard() {
        this.$$.squarebutton.forEach((square) => square.replaceChildren());
    }

    closeModel() {
        this.$.model.classList.add('hidden');
    }

    closeAll() {
        this.closeModel();
        this.closeMenu();
    }
    updateScoreboard(resultspanp1, resultspanp2, resultspantie) {
        this.$.resultspanp1.innerText = `${resultspanp1} wins`;
        this.$.resultspanp2.innerText = `${resultspanp2} wins`;
        this.$.resultspantie.innerText = `${resultspantie} ties`;
      }

    showModel(message) {
        this.$.model.classList.toggle('hidden');
        this.$.modeltext.innerText = message;
    }

    closeMenu() {
        this.$.actionbutton.classList.add('hidden');
        this.$.actionbutton.classList.remove('border');
        const icon = this.$.actionsmenu.querySelector("i");
        icon.classList.add("fa-chevron-down");
        icon.classList.remove("fa-chevron-up");
    }

    #togglemenu() {
        this.$.actionbutton.classList.toggle("hidden");
        this.$.actionsmenu.classList.add("border");
        const icon = this.$.actionsmenu.querySelector("i");
        icon.classList.toggle("fa-chevron-down");
        icon.classList.toggle("fa-chevron-up");
    }

    handlePlayerMove(square, player) {
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", player.iconClass);
        square.replaceChildren(icon);
    }

    setturnIndicator(player) {
        const icon = document.createElement("i");
        const label = document.createElement("p");
        icon.classList.add("fa-solid", player.iconClass);
        label.innerText = `${player.name}, You can go!`;
        this.$.turn.replaceChildren(icon, label);
    }
}
