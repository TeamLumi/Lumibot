const GENDER = { "0": "MALE", "1": "FEMALE", "2": "NEUTRAL" };
ZONE_ORDER = [
    "Route 201",
    "Route 202",
    "Jubilife City",
    "Route 204 South",
    "Route 203",
    "Oreburgh Gate 1F",
    "Oreburgh Gate B1F",
    "Oreburgh City",
    "Oreburgh Mine",
    "Oreburgh Mine B1F",
    "Oreburgh Gym",
    "Route 204 North",
    "Floaroma Town",
    "Floaroma Meadow",
    "Valley Windworks",
    "Route 205 South",
    "Eterna Forest",
    "Eterna Forest (Cut Tree Path)",
    "Route 205 North",
    "Route 211 West",
    "Route 211 East",
    "Route 216",
    "Route 206",
    "Eterna Gym",
    "Eterna City",
    "Route 207",
    "Wayward Cave",
    "Route 208",
    "Hearthome Gym",
    "Hearthome City",
    "Route 212 North",
    "Route 209",
    "Lost Tower",
    "Lost Tower 1F",
    "Lost Tower 2F",
    "Lost Tower 3F",
    "Lost Tower 4F",
    "Lost Tower 5F",
    "Solaceon Town",
    "Solaceon Ruins",
    "Route 210 South",
    "Route 215",
    "Veilstone Gym",
    "Veilstone City",
    "Route 214",
    "Seven Starts Restaurant",
    "Route 213",
    "Route 212 South",
    "Pastoria City",
    "Pastoria Gym",
    "Route 210 North",
    "Celestic Town",
    "Route 218",
    "Fuego Ironworks (Outside)",
    "Fuego Ironworks (Inside)",
    "Route 219",
    "Route 220",
    "Route 221",
    "Ramanas Park",
    "Canalave City",
    "Iron Island (Outside)",
    "Iron Island 1F",
    "Iron Island B1F Left Cave",
    "Iron Island B1F Right Cave",
    "Iron Island B2F Left Cave",
    "Iron Island B3F Right Cave",
    "Iron Island B3F",
    "Canalave Gym",
    "Valor Lakefront",
    "Lake Valor (Before)",
    "Valor Cavern",
    "Lake Verity (Before)",
    "Lake Verity (After)",    
    "Route 217",
    "Snowpoint City",
    "Snowpoint Gym",
    "Galactic HQ",
    "Team Galactic HQ 1F",
    "Team Galactic HQ 2F",
    "Team Galactic HQ 3F",
    "Team Galactic HQ 4F",
    "Team Galactic HQ B1F",
    "Team Galactic HQ B2F",
    "Mt. Coronet 3F",
    "Mt. Coronet 4F",
    "Mt. Coronet Route 211 Entrance",
    "Mt. Coronet 6F",
    "Mt. Coronet 7F",
    "Mt. Coronet Summit",
    "Spear Pillar",
    "Distortion Room",
    "Route 222",
    "Sunyshore City",
    "Sunyshore Gym",
    "Route 223",
    "Route 224",
    "Victory Road 1F",
    "Victory Road 2F",
    "Victory Road B1F",
    "Victory Road Nat Dex Area",
    "Victory Road Nat Dex Area B1F",
    "Pokemon League",
    "Fight Area",
    "Route 225",
    "Route 226",
    "Route 227",
    "Route 228",
    "Route 229",
    "Route 230",
    "Stark Mountain (Outside)",
    "Stark Mountain (Entrance)",
    "Stark Mountain (Interior)",
]

function get_trainer_pokemon(trainerId) {
  /*
    Requires the get_pokemon_from_trainer_info to function
    Requires the trainerId and returns an an array of objects
    Format can be found in get_pokemon_from_trainer_info
    TRAINER_TABLE comes from TrainerTable.json
*/
  let pokemon_list = [];
  const trainer = TRAINER_TABLE["TrainerPoke"].find((t) => t["ID"] === trainerId);
  pokemon_list = get_pokemon_from_trainer_info(trainer);
  return pokemon_list;
}

function sort_dicts_by_key(dicts_list, sort_key1, sort_key2, sort_key1_order) {
  /*
    Sorts an array of objects by two given keys in ascending order
    The sorting order of the first key is specified by ZONE_ORDER
*/
  return dicts_list.sort((a, b) => {
    const key1A = sort_key1_order.indexOf(a[sort_key1]);
    const key1B = sort_key1_order.indexOf(b[sort_key1]);
    if (key1A < key1B) {
      return -1;
    } else if (key1A > key1B) {
      return 1;
    } else {
      return a[sort_key2] - b[sort_key2];
    }
  });
}

function generate_moves_via_learnset(mons_no, level) {
  /*
    Requires: learnset_data (which is pulled from WazaOboeTable.json), and get_move_string
    This function generates the learnset for a Pokemon by the inputted level.
    It does this by finding the 4 most recent moves in the list and returns them.
  */
  if (!Number.isInteger(mons_no) || mons_no < 0 || !learnset_data['WazaOboe'][mons_no]) {
    throw new Error('Invalid Pokémon number');
  }
  
  if (!Number.isInteger(level) || level < 0) {
    throw new Error('Invalid level');
  }
  
  const moveset = learnset_data['WazaOboe'][mons_no]['ar'];
  const idx = moveset.findIndex((move, index) => index % 2 === 0 && move > level);
  const cutoff_index = learnset_data['WazaOboe'][mons_no]['ar'].findIndex((move, index) => index % 2 === 0 && move > level);
  const moves = learnset_data['WazaOboe'][mons_no]['ar'].slice(0, cutoff_index);
  const move_names = moves.map((move) => get_move_string(move));
  const num_moves = moves.length;

  if (num_moves >= 7) {
    return [move_names[num_moves - 7], move_names[num_moves - 5], move_names[num_moves - 3], move_names[num_moves - 1]];
  } else if (num_moves >= 5) {
    return [move_names[num_moves - 5], move_names[num_moves - 3], move_names[num_moves - 1]];
  } else if (num_moves >= 3) {
    return [move_names[num_moves - 3], move_names[num_moves - 1]];
  } else if (num_moves >= 1) {
    return [move_names[num_moves - 1]];
  } else {
    return [];
  }
}

function get_moves(m1, m2, m3, m4, monsno, level) {
  /*
    Requires: generate_moves_via_learnset
    If all the moves are zero, one should assume their learnset is generated by BDSP
    Otherwise, return moves are per their strings
*/
  if (m1 === m2 && m1 === m3 && m1 === m4) {
    return generate_moves_via_learnset(monsno, level);
  }

  const moves = [
    move_enum[m1],
    move_enum[m2],
    move_enum[m3],
    move_enum[m4]
  ];

  if (moves[0] === null) {
    console.log(`Moves: ${m1}, ${m2}, ${m3}, ${m4}, ${monsno}, ${moves}`);
  }

  return moves;
}

function get_pokemon_from_trainer_info(trainer) {
/*
    Requires the following functions: get_ability_string, get_moves, getPokemonIdFromFormMap, get_item_string, get_nature_name
*/
  const pokemon_list = [];
  for (let poke_num = 1; poke_num <= 6; poke_num++) {
    const level = trainer[`P${poke_num}Level`];
    if (level <= 0) {
      break;
    }
    const ability = get_ability_string(trainer[`P${poke_num}Tokusei`]);
    const gender = trainer[`P${poke_num}Sex`] !== 3 ? GENDER[String(trainer[`P${poke_num}Sex`])] : GENDER["1"]; // Female
    const monsNo = trainer[`P${poke_num}MonsNo`];

    const moves = [trainer[`P${poke_num}Waza1`], trainer[`P${poke_num}Waza2`], trainer[`P${poke_num}Waza3`], trainer[`P${poke_num}Waza4`]];
    const [m1, m2, m3, m4] = moves;
    const movesResult = get_moves(m1, m2, m3, m4, monsNo, level);

    const formNo = trainer[`P${poke_num}FormNo`];
    const pokemonId = getPokemonIdFromFormMap(monsNo, formNo);
    const trainer_item = trainer[`P${poke_num}Item`];
    const item = trainer_item !== 0 ? get_item_string(trainer_item) : null;
    const nature = get_nature_name(trainer[`P${poke_num}Seikaku`]);
    const pokemon = {
      "ability": ability,
      "gender": gender,
      "id": pokemonId,
      "item": item,
      "level": level,
      "moves": movesResult,
      "nature": nature,
      "ivatk": trainer[`P${poke_num}TalentAtk`],
      "ivdef": trainer[`P${poke_num}TalentDef`],
      "ivhp": trainer[`P${poke_num}TalentHp`],
      "ivspatk": trainer[`P${poke_num}TalentSpAtk`],
      "ivspdef": trainer[`P${poke_num}TalentSpDef`],
      "ivspeed": trainer[`P${poke_num}TalentAgi`],
      "evhp": trainer[`P${poke_num}EffortHp`],
      "evatk": trainer[`P${poke_num}EffortAtk`],
      "evdef": trainer[`P${poke_num}EffortDef`],
      "evspatk": trainer[`P${poke_num}EffortSpAtk`],
      "evspdef": trainer[`P${poke_num}EffortSpDef`],
      "evspeed": trainer[`P${poke_num}EffortAgi`]
    };
    pokemon_list.push(pokemon);
  }
  return pokemon_list;
}

function sort_trainers_by_level(trainer_info) {
  /*
    Requires the trainer_info from the trainer_info.json
    Function requirements: get_trainer_pokemon, get_avg_trainer_level, sort_dicts_by_key
    Adds the trainer's team and average level to trainer_info
    Calls the sort_dicts_by_key function and sorts the trainers by zoneName then average level
*/
  for (const trainer of trainer_info) {
    const trainerId = trainer['trainerId'];
    trainer['team'] = get_trainer_pokemon(trainerId);
    trainer['avg_lvl'] = get_avg_trainer_level(trainer['team']);
  }
  const sorted_trainers_by_level = sort_dicts_by_key(trainer_info, 'zoneName', 'avg_lvl', ZONE_ORDER);
  return sorted_trainers_by_level;
}
