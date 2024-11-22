const FairRandom = require('./classes/fairRandom');
const Dice = require('./classes/dice');
const ProbabilityCalculator = require('./classes/probabilityCalculator');
const readline = require('readline');
const Table = require('cli-table3');

class Game {
    constructor(diceConfigs) {
        this.diceConfigs = diceConfigs;
        this.dice = diceConfigs.map(config => new Dice(config));
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    start() {
        console.log("Let's determine who makes the first move.");
        const { key, number, hmac } = FairRandom.generateRandomNumber(2);
        console.log(`I selected a random value in the range 0..1 (HMAC=${hmac}).`);
        console.log("Try to guess my selection.");
        console.log("0 - 0");
        console.log("1 - 1");
        console.log("X - exit");
        console.log("? - help");

        this.rl.question('Your selection: ', (userGuess) => {
            if (userGuess.toLowerCase() === 'x') {
                console.log('Exiting the game.');
                this.rl.close();
                return;
            }
            if (userGuess === '?') {
                this.displayHelp();
                this.start();
                return;
            }
            const userNumber = parseInt(userGuess, 10);

            if (isNaN(userNumber) || userNumber < 0 || userNumber > 1) {
                console.log('Invalid selection. Please enter 0 or 1.');
                this.start();
                return;
            }

            console.log(`My selection: ${number} (KEY=${key}).`);

            if (userNumber === number) {
                console.log('You guessed correctly! You make the first move.');
                this.userSelectDice(true);

            } else {
                console.log('I make the first move.');
                this.computerSelectDice(true);
            }
        });
    }

    userSelectDice(isFirstMove = false) {
        console.log('Choose your dice:');
        this.diceConfigs.forEach((config, index) => {
            if (!isFirstMove && index === this.computerDiceIndex) return;
            console.log(`${index} - ${config.join(',')}`);
        });
        console.log('X - exit');
        console.log('? - help');
        this.rl.question('Your selection: ', (userChoice) => {
            if (userChoice.toLowerCase() === 'x') {
                console.log('Exiting the game.');
                this.rl.close();
                return;
            }
            if (userChoice === '?') {
                this.displayHelp();
                this.userSelectDice(isFirstMove);
                return;
            }
            const userIndex = parseInt(userChoice, 10);
            if (isNaN(userIndex) || userIndex < 0 || userIndex >= this.diceConfigs.length || (!isFirstMove && userIndex === this.computerDiceIndex)) {
                console.log('Invalid selection. Please choose a valid dice.');
                this.userSelectDice(isFirstMove);
                return;
            }
            console.log(`You chose the dice: ${this.diceConfigs[userIndex].join(',')}`);
            this.userDice = this.dice[userIndex];
            if (isFirstMove) {
                this.computerSelectDice(false, userIndex);
            } else {
                this.userThrow();
            }
        });
    }

    computerSelectDice(isFirstMove = false, userIndex = null) {
        const availableDice = this.dice.filter((_, index) => index !== userIndex);
        const computerIndex = Math.floor(Math.random() * availableDice.length);
        this.computerDice = availableDice[computerIndex];
        this.computerDiceIndex = this.dice.findIndex(d => d === this.computerDice); // Guardar el índice original del dado seleccionado por la computadora
        console.log(`I make the first move and choose the [${this.computerDice.values.join(',')}] dice.`);
        if (isFirstMove) {
            this.userSelectDice(false);
        } else {
            this.userThrow();
        }
    }

    userThrow() {
        console.log("It's time for your throw.");
        const { key, number, hmac } = FairRandom.generateRandomNumber(6);
        console.log(`I selected a random value in the range 0..5 (HMAC=${hmac}).`);
        console.log("Add your number modulo 6.");
        console.log("0 - 0");
        console.log("1 - 1");
        console.log("2 - 2");
        console.log("3 - 3");
        console.log("4 - 4");
        console.log("5 - 5");
        console.log("X - exit");
        console.log("? - help");
        this.rl.question('Your selection: ', (userNumber) => {
            if (userNumber.toLowerCase() === 'x') {
                console.log('Exiting the game.');
                this.rl.close();
                return;
            }
            if (userNumber === '?') {
                this.displayHelp();
                this.userThrow();
                return;
            }
            const userValue = parseInt(userNumber, 10);
            if (isNaN(userValue) || userValue < 0 || userValue > 5) {
                console.log('Invalid selection. Please enter a number between 0 and 5.');
                this.userThrow();
                return;
            }
            console.log(`My number is ${number} (KEY=${key}).`);
            const result = (number + userValue) % 6;
            console.log(`The result is ${number} + ${userValue} = ${result} (mod 6).`);
            const userRoll = this.userDice.values[result];
            console.log(`Your throw is ${userRoll}.`);
            this.computerThrow(userRoll);
        });
    }

    computerThrow(userRoll) {
        console.log("It's time for my throw.");
        const { key, number, hmac } = FairRandom.generateRandomNumber(6);
        console.log(`I selected a random value in the range 0..5 (HMAC=${hmac}).`);
        console.log("Add your number modulo 6.");
        console.log("0 - 0");
        console.log("1 - 1");
        console.log("2 - 2");
        console.log("3 - 3");
        console.log("4 - 4");
        console.log("5 - 5");
        console.log("X - exit");
        console.log("? - help");
        this.rl.question('Your selection: ', (userNumber) => {
            if (userNumber.toLowerCase() === 'x') {
                console.log('Exiting the game.');
                this.rl.close();
                return;
            }
            if (userNumber === '?') {
                this.displayHelp();
                this.computerThrow(userRoll);
                return;
            }
            const userValue = parseInt(userNumber, 10);
            if (isNaN(userValue) || userValue < 0 || userValue > 5) {
                console.log('Invalid selection. Please enter a number between 0 and 5.');
                this.computerThrow(userRoll);
                return;
            }
            console.log(`My number is ${number} (KEY=${key}).`);
            const result = (number + userValue) % 6;
            console.log(`The result is ${number} + ${userValue} = ${result} (mod 6).`);
            const computerRoll = this.computerDice.values[result];
            console.log(`My throw is ${computerRoll}.`);
            this.determineWinner(userRoll, computerRoll);
        });
    }

    determineWinner(userRoll, computerRoll) {
        if (userRoll > computerRoll) {
            console.log(`You win (${userRoll} > ${computerRoll})!`);
        } else if (userRoll < computerRoll) {
            console.log(`I win (${computerRoll} > ${userRoll})!`);
        } else {
            console.log(`It's a tie (${userRoll} = ${computerRoll})!`);
        }
        this.rl.close();
    }

    displayHelp() {
        const probabilities = ProbabilityCalculator.calculateProbabilities(this.diceConfigs);

        // Create a new table for the probabilities
        const table = new Table({
            head: ['User dice v', ...this.diceConfigs.map(config => config.join(','))],
            colWidths: [15, ...this.diceConfigs.map(() => 15)]
        });

        // Add rows to the table
        probabilities.forEach((row, i) => {
            table.push([this.diceConfigs[i].join(','), ...row.map(prob => prob === '-' ? '0.0000' : prob.toFixed(4))]);
        });

        console.log("Probability of the win for the user:");
        console.log(table.toString());
    }
}

module.exports = Game;