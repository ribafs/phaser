// Nathan Altice
// Adapted to Phaser 3: 4/9/20
// Updated: 3/27/21
// A Very Capable Game: a simple mad libs-style text "game" demonstrating Scene management
// Passes state variables from scene to scene
// Uses randomized words and colors for extra fun times 🌈

// be strict 🙊
'use strict';

// Main Menu Scene
class MainMenu extends Phaser.Scene {
    constructor() {
        super('mainMenu');
    }

    create() {
        // player stats
        let stats = {
            level: 0,
            life: 3
        }
        // some debugging info
        console.log(`level: ${stats.level}, life: ${stats.life}`);
        // get our word list ready
        initWordList();
        // change background color
        this.cameras.main.setBackgroundColor(getRandomHexColor());
        // get a random adjective, capitalize it, and print title message
		let adj = getRandomWord(wordList.adjectives, true);
        printMessages(`Welcome to A Very ${adj} Game`, 'Click anywhere to begin', this);
        // setup pointer/touch
        let pointer = this.input.activePointer;
        this.input.on('pointerdown', (pointer) => {
            // start next scene and pass player stat data
            this.scene.start('gamePlay', stats);
        });
    }
}

// Game Play Scene
class GamePlay extends Phaser.Scene {
    constructor() {
        super('gamePlay');
    }

    init(data) {
        // grab player stats from previous scene
        this.stats = data;
        this.stats.level++;
        console.log(`level: ${this.stats.level}, life: ${this.stats.life}`);
    }

    create() {
        // randomize our various parts of speech 🎲
		this.cameras.main.setBackgroundColor(getRandomHexColor());
		let adj = getRandomWord(wordList.adjectives);
        let verb = getRandomWord(wordList.verbs);
        let verbCounter = getRandomWord(wordList.verbs);
		let adv = getRandomWord(wordList.adverbs);
        let noun = getRandomWord(wordList.nouns);

        // make a fighting message
        let result = '';
        if(Math.floor(Math.random()*2)) {
			this.stats.life--;
			result = `Ouch! The ${noun} ${verbCounter} you in return! Lose a life!`;
		} else {
			let adv2 = getRandomWord(wordList.adverbs);
			result = 'And you '+adv2+' avoided the '+noun+'\'s counterattack! Level up!';
		}
        // print it!
        printMessages(`You ${adv} ${verb} the ${adj} ${noun}!`, result, this);

        // setup pointer/touch
        let pointer = this.input.activePointer;
        this.input.on('pointerdown', (pointer) => {
            if(this.stats.life > 0) {
                this.scene.restart(this.stats);             // restart scene if there's still life left
            } else {
                this.scene.start('gameOver', this.stats);   // otherwise go to game over
            }
        });
    }
}

// Game Over Scene
class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOver');
    }

    init(data) {
        // grab player stats from previous scene
        this.stats = data;
    }

    create() {
        // print goodbye message
        let adv = getRandomWord(wordList.adverbs);
        printMessages(`Your life spent, you drift ${adv} into oblivion...`, `You reached level ${this.stats.level}. Click anywhere to play again!`, this);
        
        // setup pointer/touch
        let pointer = this.input.activePointer;
        this.input.on('pointerdown', (pointer) => {
            // start next scene
            this.scene.start('mainMenu');
        });
    }
}

// initialize our variables and the Phaser game
let wordList = {};

let config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    scene: [ MainMenu, GamePlay, GameOver ],
}

let game = new Phaser.Game(config);

/******************************************************************
Beyond these depths be thine sundry utility functions...
(We can put these here due to the magic of JS function hoisting 🧙‍♂️)
*******************************************************************/

// create our word list (words from randomlists.com and my questionable brain)
function initWordList() {
	wordList = {};
	wordList = {
        adjectives: ['nervous', 'oceanic', 'fuzzy', 'sore', 'untidy', 'flowery', 'muddled', 'hellish', 'overwrought', 'abrupt', 'quixotic', 'grumpy', 'enormous', 'capable', 'roomy', 'tender', 'spiky', 'magenta', 'cute', 'dusty', 'hot', 'exultant', 'massive', 'lush', 'aromatic', 'solid', 'wrathful', 'dull', 'grey', 'likeable', 'narrow', 'tall', 'eloquent', 'green', 'ragged', 'random', 'slimy', 'gruesome', 'weaponized', 'pious', 'rancid', 'frothy', 'blank', 'furry', 'lightweight', 'tropical', 'barren', 'studious', 'anxious', 'cloudy', 'plain', 'putrid', 'pink', 'academic', 'rancid', 'rugged', 'rumpled', 'dishonest', 'shaky', 'shady', 'sheltered', 'perfect', 'patchwork', 'salty', 'dark', 'dim', 'delicate', 'massive', 'golden', 'glib', 'gossamer', 'briny', 'jolly', 'artsy', 'dreary', 'hooded', 'chilled', 'expansive', 'sinister', 'dubious', 'troublesome', 'tired', 'exhausted', 'tragic', 'shallow', 'dense', 'dilapidated', 'fireproof', 'brackish', 'scalding', 'anime', 'political', 'turquoise', 'obtuse', 'plastic', 'ceramic', 'furious', 'antique', 'bronze', 'hamstrung', 'repulsive', 'corpulent'],
		nouns: ['fire', 'hydrant', 'spoon', 'frog', 'leg', 'person', 'baseball', 'ghost', 'ocean', 'stranger', 'bulb', 'galaxy', 'government', 'bed', 'giraffe', 'smell', 'oven', 'orange', 'snail', 'parcel', 'wax', 'seashore', 'desk', 'pie', 'crowd', 'toothbrush', 'sink', 'trees', 'cemetery', 'tombstone', 'sky', 'giants', 'apparatus', 'ladybug', 'machine', 'rabbits', 'hill', 'notebook', 'cabbage', 'car', 'trousers', 'bee', 'hippo', 'turnip', 'pillows', 'raven', 'potion', 'zealot', 'curtain', 'espresso', 'professor', 'plant', 'encyclopedia', 'office chair', 'trellis', 'gymnasium', 'sweater', 'whiskey', 'album', 'napkin', 'armoir', 'stew', 'werewolf', 'final exam', 'birthday party', 'poultry', 'prom date', 'painting', 'helicopter', 'pretzel', 'serpent', 'pandemic', 'console', 'shoehorn', 'lantern', 'bake sale', 'rooftops', 'spaghetti', 'tracksuit', 'belt loops', 'breakfast cereal', 'board games', 'Steam library', 'superhero', 'dirt bike', 'sophomores', 'salad', 'hedges', 'jambalaya', 'mascots', 'code', 'dentist', 'cowboy hat', 'trumpet', 'goose', 'DLC', 'streamers', 'spreadsheet', 'harpy', 'clown car', 'shopping mall', 'HDTV', 'dresser drawer', 'vinyl sticker', 'dad', 'Zoom meeting', 'tsunami', 'cremini mushroom', 'shingles', 'game designer'],
		verbs: ['excused', 'carved', 'offended', 'sailed', 'destroyed', 'poured', 'disarmed', 'borrowed', 'expanded', 'burned', 'decorated', 'invented', 'recorded', 'boiled', 'crossed', 'squeezed', 'filmed', 'juggled', 'scratched', 'popped', 'mined', 'pined for', 'prayed for', 'painted', 'annoyed', 'delayed', 'supported', 'challenged', 'broke', 'shaved', 'tossed', 'teased', 'taunted', 'dropped', 'toppled', 'barbequed', 'mirrored', 'trapped', 'wounded', 'hoodwinked', 'perplexed', 'trampled', 'evacuated', 'smooshed', 'sold', 'catapulted', 'halted', 'outbid', 'outraged', 'outran', 'slapped', 'hugged', 'frisked', 'calmed', 'married', 'countered', 'collided with', 'tripped', 'tolerated', 'jumped over', 'disentangled', 'evaporated', 'banished', 'berated', 'reprimanded', 'deleted', 'swindled', 'blamed', 'quarantined', 'deceived', 'detected', 'soothed', 'uncovered', 'outraged', 'uplifted', 'sharpened', 'served', 'shamed', 'sold', 'shocked', 'scolded', 'proposed to', 'censored', 'shoplifted', 'argued with', 'consoled', 'doctored', 'emptied', 'outspent', 'halted', 'dreamed about', 'enunciated', 'piled on', 'disarmed', 'cooked', 'staggered', 'stymied', 'debriefed','bounced', 'catapulted', 'mistreated', 'texted', 'surveyed', 'displayed', 'canceled', 'cremated', 'gargled', 'manicured', 'debugged', 'outspent'],
		adverbs: ['fondly', 'sweetly', 'reluctantly', 'fatally', 'knowingly', 'greedily', 'rapidly', 'blissfully', 'successfully', 'politely', 'elegantly', 'youthfully', 'zestfully', 'busily', 'delightfully', 'gleefully', 'generously', 'helplessly', 'sheepishly', 'calmly', 'honestly', 'daintily', 'keenly', 'mostly', 'hungrily', 'shakily', 'worriedly', 'urgently', 'queasily', 'unnaturally', 'unexpectedly', 'quietly', 'surreptitiously', 'bashfully', 'hungrily', 'promptly', 'jauntily', 'steadily', 'staunchly', 'silently', 'cautiously', 'craftily', 'timelessly', 'mournfully', 'effortlessly', 'prematurely', 'handsomely', 'recklessly', 'cheerfully', 'half-heartedly', 'hopelessly', 'definitively', 'purposefully', 'tactfully', 'fervently', 'triumphantly', 'carelessly', 'unceremoniously', 'unanimously', 'presciently', 'questionably', 'problematically', 'predictably', 'circuitously', 'preemptively', 'barely', 'handily', 'doggedly', 'purposefully', 'crankily', 'briefly', 'pointedly', 'truthfully', 'dourly', 'gloomily', 'tangentially', 'nonchalantly']
	};
}

/* 
Adapted from Anatoliy's answer here:
https://stackoverflow.com/questions/1484506/random-color-generator
Returns a hex color in string format: '#xxxxxx'
*/ 
function getRandomHexColor() {
	let letters = '0123456789ABCDEF';
	let hexColor = '#';
	for(let i = 0; i < 6; i++) {
		hexColor += letters[Math.floor(Math.random() * 16)];
	}
	return hexColor;
}

// pass in an array of words, remove one at random, and optionally capitalize it
// uppercase line from https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
function getRandomWord(wordList, capitalize = false) {
	let word, seed;

	if(wordList.length > 0) {
		seed = Math.floor(Math.random() * wordList.length);
		word = wordList[seed];
		if(capitalize) { word = word.charAt(0).toUpperCase() + word.slice(1); }
		wordList.splice(seed, 1);
	} else {
		word = 'ERROR'; // not good error handling, but shut up :p
	}
	return word;
}

// pass in two lines of text to print on screen
// note that the current Scene is passed in as "scene" since this function lives outside any Phaser.Scene scope
function printMessages(top_msg, btm_msg, scene) {
    // define styles
    let style1 = { font: '28px Helvetica', fill: '#FFF', align: 'center' };
    let style2 = { font: '18px Helvetica', fill: '#FFF', align: 'center' };
    // print messages
	scene.add.text(50, game.config.height/2, top_msg, style1);
	scene.add.text(50, game.config.height/2 + 48, btm_msg, style2);
}