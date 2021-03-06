class LocationType {
	constructor(name, symbol, description, enterAction, presentAction, reset, nextCost, enterCount, canWorkTogether = true){
		this.name = name;
		this.symbol = symbol;
		this.description = description;
		this.enterAction = enterAction ? Object.create(getAction(enterAction)) : null;
		this.presentAction = presentAction ? Object.create(getAction(presentAction)) : null;
		this.nextCost = nextCost;
		this.enterCount = enterCount || 1;
		if (reset){
			this.extraReset = reset;
		}
		this.canWorkTogether = canWorkTogether;
	}

	getEnterAction(entered) {
		if (entered >= this.enterCount){
			return Object.create(getAction("Walk"));
		}
		return this.enterAction;
	}

	reset(){
		if (this.extraReset) return this.extraReset(...arguments)
		return 0;
	}
}

function storeCompletions(completions, priorCompletions){
	return completions + priorCompletions;
}

function getNextCloneAmountCost(){
	return `${getNextCloneAmount()} gold`;
}

function startCollectManaCost(completions, priorCompletions){
	return `${writeNumber(this.presentAction.getDuration(mineManaRockCost(completions, priorCompletions)) / 1000, 2)}s`;
}

let locationTypes = [
	new LocationType("Solid Rock", "█", "Rock, too hard to dig through.", null, null, null),
	new LocationType("Tunnel", ".", "A bare stone passage, empty of any ornamentation.", "Walk", null, null),
	new LocationType("Rock", "#", "A whole bunch of rock.", "Mine", null, null),
	new LocationType("Gold ore", "+", "Rocks with veins of gold ore.", "Mine Gold", null, null),
	new LocationType("Iron ore", "%", "Rocks with veins of iron ore.", "Mine Iron", null, null),
	new LocationType("Mana-infused Rock", "¤", "A whole bunch of rock.  But this time, it glows!", "Mine", "Collect Mana", storeCompletions, startCollectManaCost),
	new LocationType("Mana Spring", "*", "Pure mana, flowing out of the rock.  Each time you absorb the mana, the cost to do so next time increases.", "Walk", "Collect Mana", storeCompletions, startCollectManaCost),
	new LocationType("Clone Machine", "♥", "A strange machine labelled 'Clone Machine'.  What could it do?", "Walk", "Create Clone", storeCompletions, getNextCloneAmountCost),
	new LocationType("Vaporizer", "=", "A machine for extracting the magic right out of gold.", "Walk", "Turn Gold to Mana", null),
	new LocationType("Fountain", "^", "A healing fountain, activated by the runes around its base.", "Walk", "Heal", null, null, null, false),
	new LocationType("Pit", " ", "A bottomless pit.", "Cross Pit", null, null),
	new LocationType("Lava", "~", "A bottomless pit full of lava.  At least, you're not going to be walking on the bottom, so it's bottomless enough for you.  Your bridges might not last very long here, but probably long enough for one clone.", "Cross Lava", null, null, null, Infinity),
	new LocationType("Runic Book", '"', `A large book sitting open on a pedestal.  It has 4 pages, each with a different rune more complicated than the last.  Runic Lore has a greater effect on this action than normal.`, "Walk", "Read", null),
	new LocationType("Goblin", "g", "An ugly humanoid more likely to try and kill you than to let you by.\n{STATS}", "Attack Creature", null, null),
	new LocationType("Goblin Chieftain", "c", "This one is uglier than the last two.  Probably meaner, too.\n{STATS}", "Attack Creature", null, null),
	new LocationType("Hobgoblin", "h", "A large creature looking something like the goblins.  It looks ready to fight.\n{STATS}", "Attack Creature", null, null),
	new LocationType("Goblin Champion", "m", "The largest of the goblins.  You're going to have to work hard to take him down.\n{STATS}", "Attack Creature", null, null),
	new LocationType("Weaken Rune", "W", "Weakens adjacent creatures.", "Walk", null, null),
	new LocationType("Teleport To Rune", "T", "This rune allows someone or something to come through from another place.", "Walk", null, null),
	new LocationType("Teleport From Rune", "F", "This rune allows someone to slip beyond to another place.", "Walk", null, null),
	new LocationType("Duplication Rune", "D", "This rune increases the yield of mining next to it.", "Walk", null, null),
	new LocationType("Coal", "○", "Bituminous coal is present in these rocks.", "Mine Coal", null, null),
	new LocationType("Furnace", "╬", "A large box full of fire.", "Walk", "Make Iron Bars", null),
	new LocationType("Anvil - Bridge", "⎶", "An anvil on which you can make a bridge out of 2 iron.", "Walk", "Create Bridge", null),
	new LocationType("Anvil - Sword", ")", "An anvil on which you can make a sword out of 3 iron.", "Walk", "Create Sword", null),
	new LocationType("Anvil - Shield", "[", "An anvil on which you can make a shield out of 5 iron.", "Walk", "Create Shield", null),
	new LocationType("Anvil - Armour", "]", "An anvil on which you can make a suit of armour out of 4 iron.", "Walk", "Create Armour", null),
	new LocationType("Steel Furnace", "▣", "A large box full of fire.  This one has a slot for coal and a slot for iron bars.", "Walk", "Make Steel Bars", null),
	new LocationType("Anvil - Upgrade Bridge", "&", "An anvil on which you can upgrade an iron bridge into a steel bridge using 1 steel bar.", "Walk", "Upgrade Bridge", null),
	new LocationType("Anvil - Upgrade Sword", "(", "An anvil on which you can upgrade an iron sword into a steel sword using 2 steel bars.", "Walk", "Upgrade Sword", null),
	new LocationType("Anvil - Upgrade Shield", "{", "An anvil on which you can upgrade an iron shield into a steel shield using 2 steel bars.", "Walk", "Upgrade Shield", null),
	new LocationType("Anvil - Upgrade Armour", "}", "An anvil on which you can upgrade an iron suit of armour into a steel suit of armour using 2 steel bars.", "Walk", "Upgrade Armour", null),
];
