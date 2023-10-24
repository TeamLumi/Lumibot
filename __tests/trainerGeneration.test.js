const { get_trainer_pokemon } = require("../dex/trainerGeneration");

const TrainerTable = {
	TrainerPoke: [
		// Black Belt Kyle (What a guy)
		{
			ID: 38,
			P1MonsNo: 67,
			P1FormNo: 0,
			P1IsRare: 0,
			P1Level: 29,
			P1Sex: 0,
			P1Seikaku: 24,
			P1Tokusei: 62,
			P1Waza1: 0,
			P1Waza2: 0,
			P1Waza3: 0,
			P1Waza4: 0,
			P1Item: 0,
			P1Ball: 28,
			P1Seal: -1,
			P1TalentHp: 25,
			P1TalentAtk: 25,
			P1TalentDef: 25,
			P1TalentSpAtk: 25,
			P1TalentSpDef: 25,
			P1TalentAgi: 25,
			P1EffortHp: 0,
			P1EffortAtk: 0,
			P1EffortDef: 0,
			P1EffortSpAtk: 0,
			P1EffortSpDef: 0,
			P1EffortAgi: 0,
		},
		// Add more trainer data as needed for testing
	],
};

describe("get_trainer_pokemon", () => {
	it("should return an array of Pokémon for a given trainer ID", () => {
		const trainerId = 38; // Black Belt Kyle (I just think he's neat)
		const result = get_trainer_pokemon(trainerId);

		// Assert that the result is an array
		expect(Array.isArray(result)).toBe(true);
	});

	it("should return an empty array if trainer ID is not found", () => {
		const trainerId = 9999; // A trainer ID that is not present in the TrainerTable
		const result = get_trainer_pokemon(trainerId);

		// Assert that the result is an empty array
		expect(result).toEqual([]);
	});

	it("should return all of the corect data for Pokémon for a given trainer ID", () => {
		const trainerId = 38; // Black Belt Kyle (True chad)
		const result = get_trainer_pokemon(trainerId);
		const expectedPokemon = [
			{
				ability: "Guts",
				evatk: 0,
				evdef: 0,
				evhp: 0,
				evspatk: 0,
				evspdef: 0,
				evspeed: 0,
				gender: "MALE",
				id: 67,
				item: null,
				ivatk: 25,
				ivdef: 25,
				ivhp: 25,
				ivspatk: 25,
				ivspdef: 25,
				ivspeed: 25,
				level: 29,
				moves: ["Revenge", "Knock Off", "Vital Throw", "Strength"],
				nature: "Quirky",
			},
		];
		expect(result).toEqual(expectedPokemon);
	});
});
