const green = {
	'Exp': .005,
  'Coin': .01,
  'Pixel': .01,
  'Reward': .005,  // case fails here
  'Spawn Rate': .002,
  'Drop Rate': .01,
  'Rare Rate': .01,
  'Epic Rate': .025
};

const weapon_orange = {
  'Rage Attack': .015,
  'Boss Damage': .02,
  'Non-Boss Damage': .02,
};

const orange = {
  'Attack': .01,
  'Mastery': .01,
  'MP': .03,
  'Rage Depletion': -1,  // neg pct
  'Autosteal': 1,  // not a pct
  'Accuracy': .015,
  'Ignore Defense': .01,
  'Hit Chance': .005,
  'Dodge Chance': .005,
  'Evasion': .015,
  'MP Regen': .025
};

const purple = {
  'Attack Power': 4,
  'Defense Power': 6,
  'Equipment Attack': .1,
  'Equipment Defense': .15,
  'MaxMP': 100,
  'MaxHP': 100,
  'Accuracy': 4,
  'Evasion': 6
};

export {
  green,
  weapon_orange,
  orange,
  purple
};