class Dice {
    constructor(values) {
        this.values = values;
    }

    roll() {
        const index = Math.floor(Math.random() * this.values.length);
        return this.values[index];
    }
}

module.exports = Dice;