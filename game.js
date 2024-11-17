const FairRandom = require('./classes/fairRandom');
const Dice = require('./classes/dice');
const ProbabilityCalculator = require('./classes/probailityCalculator');
const readline = require('readline');

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
        console.log(`I selected a random value in the range 0..1.`);
        console.log(`(HMAC=${hmac})`);


        this.rl.question('Try to guess my selection (0 or 1): ', (userGuess) => {
            const userNumber = parseInt(userGuess, 10);
            if (isNaN(userNumber) || userNumber < 0 || userNumber > 1) {
                console.log('Invalid selection. Please enter 0 or 1.');
                this.rl.close();
                return;
            }
            console.log(`My selection: ${number} (KEY=${key}).`);
            if (userNumber === number) {
                console.log('You guessed correctly! You make the first move.');
                this.userSelectDice();
            } else {
                console.log('I make the first move.');
                this.computerSelectDice();
            }
        });
    }

    userSelectDice() {
        console.log('Choose your dice:');
        this.diceConfigs.forEach((config, index) => {
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
                this.userSelectDice();
                return;
            }
            const userIndex = parseInt(userChoice, 10);
            if (isNaN(userIndex) || userIndex < 0 || userIndex >= this.diceConfigs.length) {
                console.log('Invalid selection. Please choose a valid dice.');
                this.userSelectDice();
                return;
            }
            console.log(`You chose the dice: ${this.diceConfigs[userIndex].join(',')}`);
            this.userDice = this.dice[userIndex];
            this.computerSelectDice(userIndex);
        });
    }

    computerSelectDice(userIndex) {
        const availableDice = this.dice.filter((_, index) => index !== userIndex);
        const computerIndex = Math.floor(Math.random() * availableDice.length);
        this.computerDice = availableDice[computerIndex];
        console.log(`I chose the dice: ${this.computerDice.values.join(',')}`);
        this.userThrow();
    }

    userThrow() {
        console.log("It's time for your throw.");
        const { key, number, hmac } = FairRandom.generateRandomNumber(6);
        console.log(`I selected a random value in the range 0..5 (HMAC=${hmac}).`);
        this.rl.question('Add your number modulo 6 (0-5): ', (userNumber) => {
            const userValue = parseInt(userNumber, 10);
            if (isNaN(userValue) || userValue < 0 || userValue > 5) {
                console.log('Invalid selection. Please enter a number between 0 and 5.');
                this.rl.close();
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
        this.rl.question('Add your number modulo 6 (0-5): ', (userNumber) => {
            const userValue = parseInt(userNumber, 10);
            if (isNaN(userValue) || userValue < 0 || userValue > 5) {
                console.log('Invalid selection. Please enter a number between 0 and 5.');
                this.rl.close();
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
        console.log("Probabilities of winning for each dice pair:");
        console.log("User\\Computer");
        this.diceConfigs.forEach((_, i) => {
            console.log(`Dice ${i}: ${this.diceConfigs[i].join(',')}`);
        });
        probabilities.forEach((row, i) => {
            console.log(`Dice ${i}: ${row.join(' ')}`);
        });
    }
}

module.exports = Game;