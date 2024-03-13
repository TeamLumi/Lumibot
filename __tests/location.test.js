const { getRoutesFromPokemonId } = require("../dex/location");

describe("Dex utils encounter Location getter tests", () => {
	it("should throw an empty array for an invalid pokemonId number", () => {
		const input = "9999";
		const result = getRoutesFromPokemonId(input);
		expect(result).toHaveLength(0);
	});

	// need to write tests
});
