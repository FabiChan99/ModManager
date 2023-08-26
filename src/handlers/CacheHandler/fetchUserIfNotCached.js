const fetchUserIfNotCached = async (client, id) => {
	if (!client.users.cache.get(id)) {
		return await client.users.fetch(id);
	}
	return client.users.cache.get(id);
};

module.exports = fetchUserIfNotCached;
