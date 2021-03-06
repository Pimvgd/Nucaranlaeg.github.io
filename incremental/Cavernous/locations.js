class Location {
	constructor(x, y, type){
		this.x = x;
		this.y = y;
		this.type = getLocationType(type);
		let creature = getCreature(type);
		if (creature) {
			this.creature = new Creature(creature, x, y);
			creatures.push(this.creature);
		}
		this.priorCompletions = 0;
		this.completions = 0;
		this.entered = 0;
		this.remainingEnter = 0;
		this.remainingPresent = 0;
		this.enterDuration = 0;
		this.presentDuration = 0;
		this.temporaryPresent = null;
	}
	
	start() {
		if (clones[currentClone].x == this.x && clones[currentClone].y == this.y){
			if (this.type.presentAction){
				this.remainingPresent = this.type.presentAction.start(this.completions, this.priorCompletions);
			} else if (this.temporaryPresent){
				this.remainingPresent = this.temporaryPresent.start(this.completions, this.priorCompletions);
			} else {
				return false;
			}
			this.presentDuration = this.remainingPresent;
			return this.remainingPresent;
		}
		let enterAction = this.type.getEnterAction(this.entered);
		if (!enterAction) return false;
		this.remainingEnter = enterAction.start(this.completions, this.priorCompletions);
		this.enterDuration = this.remainingEnter;
		return this.remainingEnter;
	}
	
	tick(time) {
		let usedTime, percent;
		if (clones[currentClone].x == this.x && clones[currentClone].y == this.y){
			usedTime = Math.min(time, this.remainingPresent);
			(this.type.presentAction || this.temporaryPresent).tick(usedTime);
			this.remainingPresent -= usedTime;
			if (this.remainingPresent == 0){
				if ((this.type.presentAction || this.temporaryPresent).complete(this.x, this.y)){
					// Something got taken away in the middle of completing this.
					this.remainingPresent = 1;
					this.usedTime = time;
				} else {
					if (this.type.canWorkTogether){
						this.completions++;
					}
				}
			}
			percent = this.remainingPresent / (this.presentDuration || 1);
		} else {
			if (this.type.getEnterAction(this.entered).name == "Walk"){
				if (!clones[currentClone].walkTime){
					// Not sure why this is happening... walktime should be set when start() is called the first time.
					this.start();
				}
				this.remainingEnter = clones[currentClone].walkTime;
			}
			usedTime = Math.min(time, this.remainingEnter);
			this.type.getEnterAction(this.entered).tick(usedTime, this.creature);
			this.remainingEnter -= usedTime;
			if (this.remainingEnter == 0){
				if (this.type.getEnterAction(this.entered).complete(this.x, this.y, this.creature)){
					if (this.type == "Goblin") getMessage("Goblin").display();
					if (this.type == "Goblin Champion") getMessage("Won").display();
					// If it was a fight it's not over.
					if (this.creature){
						this.remainingEnter = this.start();
					} else {
						this.remainingEnter = 1;
						this.usedTime = time;
					}
				} else {
					this.entered++;
				}
			}
			percent = this.remainingEnter / (this.enterDuration || 1);
			if (this.type.getEnterAction().name == "Walk") this.remainingEnter = 100;
		}
		return [time - usedTime, percent];
	}

	setTemporaryPresent(rune){
		if (this.type.presentAction) return false;
		this.temporaryPresent = getAction(rune.activateAction);
		return true;
	}

	reset() {
		this.priorCompletions = this.type.reset(this.completions, this.priorCompletions);
		this.completions = 0;
		this.entered = 0;
		this.remainingEnter = 0;
		this.remainingPresent = 0;
		this.temporaryPresent = null;
	}
}
