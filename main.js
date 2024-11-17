const Game = require('./game');
const DiceParser = require('./classes/diceParser');


try {
    const dices = process.argv.slice(2);
    const diceConfigs = DiceParser.parse(dices);
    console.log(diceConfigs);
    
    const game = new Game(diceConfigs);
    game.start();



} catch (error) {
    console.error(error.message);
    console.log("Example usage: node main.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3");
}