function getCurrentUnixTimeStamp() {
	const timestampMillis = Date.now();
	return Math.floor(timestampMillis / 1000);
}

module.exports = { getCurrentUnixTimeStamp };
