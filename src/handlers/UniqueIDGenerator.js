function generateUUID(length) {
	if (length < 3 || length > 18) {
		throw new Error('Length must be between 3 and 18');
	}

	const characters = 'abcdef123456789';
	let uuid = '';

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		uuid += characters.charAt(randomIndex);
	}
	uuid.replace(/-/g, '');
	return uuid;
}

module.exports = { generateUUID };
