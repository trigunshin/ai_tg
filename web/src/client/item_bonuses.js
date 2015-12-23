const green = {
	'Exp': .5,
  'Coin': 1,
  'Pixel': 1,
  'Reward': .5,  // case fails here
  'Spawn Rate': .2,
  'Drop Rate': 1,
  'Rare Rate': 1,
  'Epic Rate': 2.5
};

const weapon_orange = {
  'Rage Attack': 1.5,
  'Boss Damage': 2,
  'Non-Boss Damage': 2,
};

const orange = {
  'Attack': 1,
  'Mastery': 1,
  'MP': 3,
  'Rage Depletion': -1,  // neg pct
  'Autosteal': 1,  // not a pct
  'Accuracy': 1.5,
  'Ignore Defense': 1,
  'Hit Chance': .5,
  'Dodge Chance': .5,
  'Evasion': 1.5,
  'MP Regen': 25
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