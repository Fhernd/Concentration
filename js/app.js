document.addEventListener('DOMContentLoaded', () => {
    /**
     * Represents the model for the game.
     */
    let cards = [];

    /**
     * Represents the controller/octupus.
     */
    let octupus = {
        /**
         * @description Initializes a new games once the application run.
         */
        init() {
            view.init();
        },
        /**
         * @description Generates cards for the game.
         */
        generateCards() {
            const FIGURES = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt',
                'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb']

            cards = [];

            for (let i = 0; i < 8; ++i) {
                cards.push({ image: FIGURES[i] });
            }

            cards = [...cards, ...cards];
        },
        /**
         * @description Shuffles (randomizes) the position of the 16 cards.
         * @param {*} array An array with 16 cards.
         * @returns {*} An array with 16 cards with position randomized.
         */
        shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            while (currentIndex !== 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        },
        /**
         * @description Get a new set of cards with randomized positions.
         * @returns {*} An array of cards.
         */
        getNewCards() {
            this.generateCards();
            cards = this.shuffle(cards);

            return cards;
        }
    };

    /**
     * Represents the view.
     */
    let view = {
        /**
         * @description Initializes the view (DOM structure).
         */
        init() {
            this.moves = 0;
            this.initGame();
            document.querySelector('.deck')
                .addEventListener('click', (event) => { this.cardClicked(event) });
            document.querySelector('.restart').addEventListener('click', () => {
                this.initGame();
            });
        },
        /**
         * @description Creates a new game.
         */
        initGame() {
            this.matches = 0;
            this.stars = 3;
            this.card1 = null;
            this.card2 = null;
            const cards = octupus.getNewCards();
            const icons = document.querySelectorAll('.card > i');
            this.time = 0;
            this.timer = setInterval(() => {
                ++this.time;
                document.querySelector('.time').innerText = this.time;
            }, 1000);

            for (let i = 0; i < icons.length; ++i) {
                const icon = icons[i];
                icon.className = "fa";
                icon.classList.add(cards[i].image);
            }

            if (this.moves != 0) {
                const cardsDeck = document.querySelector('.deck').children;

                for (let card of cardsDeck) {
                    card.className = "card";
                };

                this.showStars();
            }

            this.moves = 0;
            document.querySelector('.moves').innerText = this.moves;
        },
        /**
         * @description Event handls to manipulate the user interaction over cards.
         * @param {Event} event Event information about the user's click.
         */
        cardClicked(event) {
            const target = event.target;

            if (this.card2 != null) {
                this.card1.classList.remove('open');
                this.card1.classList.remove('show');
                this.card2.classList.remove('open');
                this.card2.classList.remove('show');
                this.card1 = null;
                this.card2 = null;
            }

            if (target.className == 'card' && !target.classList.contains('open')) {
                if (this.card1 == null) {
                    this.card1 = target;
                    this.card1.classList.add('open');
                    this.card1.classList.add('show');
                } else {
                    this.card2 = target;
                    this.card2.classList.add('open');
                    this.card2.classList.add('show');
                    document.querySelector('.moves').innerText = ++this.moves;
                    this.hideStars();

                    if (this.card1.children[0].classList[1] ==
                        this.card2.children[0].classList[1]) {
                        this.completeMovement();
                    }
                }
            }
        },
        /**
         * @description Marks the the cards once a match is achieved.
         */
        completeMovement() {
            document.querySelector('.moves').innerText = ++this.moves;
            this.card1.classList.add('match');
            this.card2.classList.add('match');
            this.matches += 1;
            this.hasWon();
            this.card1 = null;
            this.card2 = null;
        },
        /**
         * @description Validates if the user has won.
         */
        hasWon() {
            if (this.matches == 8) {
                clearInterval(this.timer);
                Swal.fire({
                    title: "You've won!",
                    text: `You have made ${this.moves} movements. Stars: ${this.stars}. Total time: ${this.time}s`,
                    type: 'success',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Play again!'
                }).then((result) => {
                    if (result.value) {
                        this.initGame();
                    }
                });
            }
        },
        /**
         * @description Checks if the user has lost an star.
         */
        hideStars() {
            if (this.moves >= 8 && this.moves < 16) {
                document.querySelectorAll('.fa-star')[0].style.display = 'none';
                --this.stars;
            } else if (this.moves >= 16 && this.moves < 24) {
                document.querySelectorAll('.fa-star')[1].style.display = 'none';
                --this.stars;
            } else if (this.moves >= 24 && this.moves <= 32) {
                document.querySelectorAll('.fa-star')[2].style.display = 'none';
                --this.stars;
            }
        },
        /**
         * @description Shows the stars if they are hidden.
         */
        showStars() {
            document.querySelectorAll('.fa-star')[0].style.display = 'inline';
            document.querySelectorAll('.fa-star')[1].style.display = 'inline';
            document.querySelectorAll('.fa-star')[2].style.display = 'inline';
        }
    };

    octupus.init();
});
