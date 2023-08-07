const { findClosestString } = require("../../lumibot/dex/fuzzy");
const { DISPLAY_POKEMON_NAME_MAP } = require("../../lumibot/dex/name");
const POKEMON_NAME_LIST = [...new Set(Object.values(DISPLAY_POKEMON_NAME_MAP))];

describe("findClosestString Fuzzy for Pokedex searches", () => {
	it("should return a single match for an exact Pokemon with default return limit", () => {
		const input = "Bulbasaur"; // Exact Pokemon name without forms.
		const result = findClosestString(POKEMON_NAME_LIST, input);
		const expected = ["Bulbasaur"];
		expect(result).toEqual(expected);
	});

	it("should return an array of closest matches with a custom return limit", () => {
		const input = "Kyurem"; // Partial match for all of Kyurem's forms.
		const result = findClosestString(POKEMON_NAME_LIST, input, 3);
		const expected = ["Kyurem", "White Kyurem", "Black Kyurem"];
		expect(result).toEqual(expected);
	});

	it("should return results for our custom Luminescent Pokemon forms", () => {
		const input = "Stitched Gengar"; // Exact Pokemon name for a custom form.
		const result = findClosestString(POKEMON_NAME_LIST, input, 1);
		const expected = ["Stitched Gengar"];
		expect(result).toEqual(expected);
	});

	it("should handle special characters and return exact match", () => {
		const input = "Hitmonch@n"; // Contains special character @, but still an exact match for Hitmonchan.
		const result = findClosestString(POKEMON_NAME_LIST, input, 1);
		const expected = ["Hitmonchan"];
		expect(result).toEqual(expected);
	});
});
