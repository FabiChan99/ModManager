class ProgressBar {
	constructor(total) {
		this.total = total;
		this.current = 0;
		this.barLength = 30;
		this.update();
	}

	increment() {
		this.current++;
		this.update();
	}

	update() {
		const progress = (this.current / this.total);
		const filledLength = Math.floor(progress * this.barLength);
		const emptyLength = this.barLength - filledLength;
		const bar = '█'.repeat(filledLength) + '░'.repeat(emptyLength);
		process.stdout.write(`\r[${bar}] ${Math.floor(progress * 100)}%`);
	}
}
module.exports = ProgressBar;