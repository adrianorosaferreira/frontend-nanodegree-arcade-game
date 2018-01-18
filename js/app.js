

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

//This initialize the object 'game' with the star condition
var Game = function() {
    this.message = new Messenger( 130, 430); 
    this.running = true;
    this.allEnemies = createEnemies(3);
    this.player = new Player(200,425);
    this.lifeCounter = new LifeCounter(100, -15, 3);
    this.scoreCounter = new ScoreCounter(450,-15, 0); 
};

// This update enemy and player
Game.prototype.update = function(dt) {
    this.allEnemies.forEach(function(enemy) {
        enemy.update(dt);
    });
};


//check for collision at all time using actual size of entities
Game.prototype.checkForCollision = function() {
    var player = this.player;
    var lifeCounter = this.lifeCounter;
    var game = this;

    this.allEnemies.forEach(function(enemy) {

        //2D collision detection code suggested by MDN 
        if (enemy.x < player.x + player.width &&
           enemy.x + enemy.width > player.x &&
           enemy.y < player.y + player.height &&
           enemy.height + enemy.y > player.y) {

            if (player.getLifeCount() > 0) {
                player.decreaseLifeCount(1);
                lifeCounter.update();
                player.relocatePlayer();
            
            }else{
                game.stopAllEnemies();
                game.finishedGame("You Lose!", 70, 450);

            }
        }
    }); 
}

//Restart the all game
Game.prototype.restart = function() {
    this.message = new Messenger( 130, 430);
    this.running = true;
    this.startAllEnemies();
    this.player.initializePLayer();
    this.lifeCounter.update();
    this.scoreCounter.update();  
};

//It finish the game showing the final screen 
Game.prototype.finishedGame = function(msg, x, y) {
    this.running = false;
    this.message.x = x;
    this.message.y = y;
    this.message.update(msg);
};

//handleInput for reacting space click button
Game.prototype.handleInput = function(key) {
    if (key === "spacebar") {
        this.restart();
    }
};

Game.prototype.render = function(){
    this.allEnemies.forEach(function(enemy) {
        enemy.render();
    });

    this.player.render();
    this.lifeCounter.render();
    this.scoreCounter.render();
    this.message.render();
};

//Function to star all enemies ('restart')
Game.prototype.startAllEnemies = function() {
    for (var i = 0; i < this.allEnemies.length; i++) {
        this.allEnemies[i].speedX = getRandomArbitrary(200,400);
    };
};

//This celebrates a victory or success of the gamer
Game.prototype.celebration = function() {
    this.player.relocatePlayer();
    this.player.addScore(1);
    this.scoreCounter.update();

    if (this.player.getScoreCount() == 3) {
        this.stopAllEnemies();
        this.finishedGame("You Win!", 100, 450);     
    }    
};

//Function to stop all enemies ('pause')
Game.prototype.stopAllEnemies = function() {
    for (var i = 0; i < this.allEnemies.length; i++) {
        this.allEnemies[i].speedX = 0;
    };
};

function Character(x, y, avatar) {
    this.sprite = 'images/' + avatar;
    this.x = x;
    this.y = y;
}

Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//This initialize the object 'enemy'
function Enemy(x, y, speed) {
    this.avatar = 'enemy-bug.png';
    Character.call(this, x, y, this.avatar);
    this.speedX = speed;
    this.width = 90;
    this.height = 60;
};

Enemy.prototype = Object.create(Character.prototype);

//Function to update the enemie
Enemy.prototype.update = function(dt) {
    if (this.x > 500) {
        this.x = -100;
    }
    this.x += this.speedX * dt;

};

//This function create all enemies and initialize 
function createEnemies(qt){
    var quantity = qt;
    var allEnemies = [];
    var x = getRandomArbitrary(1,400);
    var y = 75;
    var speed = getRandomArbitrary(200,400);
    for (var i = quantity - 1; i >= 0; i--) {
        var enemy = new Enemy(x, y, speed);
        allEnemies.push(enemy);
        x = getRandomArbitrary(1,400);
        y += 75;
        speed = getRandomArbitrary(200,400);
    }

    return allEnemies;
}

// Create the object 'player'
function Player(x, y) {
    this.avatar = 'char-boy.png';
    Character.call(this, x, y, this.avatar);
    this.width = 71;
    this.height = 70;
    this.lifeCount = 3;
    this.scoreCount = 0;
};

Player.prototype = Object.create(Character.prototype);

Player.prototype.getLifeCount = function() {
    return this.lifeCount;
};

Player.prototype.getScoreCount = function() {
    return this.scoreCount;
};

Player.prototype.addScore = function(score) {
    return this.scoreCount += score;
};

Player.prototype.decreaseLifeCount = function(score) {
    return this.lifeCount -= score;
};

// This realocate the player to start positin
Player.prototype.relocatePlayer = function() {
    this.x = 200;
    this.y = 400;
};

// This fucntion reset the player object
Player.prototype.initializePLayer = function() {
    this.lifeCount = 3;
    this.scoreCount = 0;
    this.relocatePlayer();
};

Player.prototype.update = function(key) {
    var speed = 50;
    
    switch (key) {
        case 'left':
        this.x -= speed;
        break;

        case 'up':
        this.y -= speed;
        break;

        case 'right':
        this.x += speed;
        break;

        case 'down':
        this.y += speed;
        break;
    }
};

Player.prototype.verifyHorizontalLimit = function() {
    if (this.x <= 0) {
        this.x = 0;
    } else if (this.x > 400) {
        this.x = 400;
    }
};

Player.prototype.verifyVerticalLimit = function() {
    if (this.y <= -30) {
        this.y = -30;
    }else if (this.y > 405) {
        this.y = 405;
    }   
};


//To move the player
Player.prototype.handleInput = (function(key, x, y) {

    if (newGame.running) {
        this.update(key);
        this.verifyHorizontalLimit();
        this.verifyVerticalLimit();
        
    }
    return this.y;
});

//This initialize the object 'life counter'
var LifeCounter = function(x, y, lifes) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/Heart_39x63.png';
    this.count = lifes + " x ";
};

// This update the 'lifeCounter' display with quantity life that the player has
LifeCounter.prototype.update = function() {
    this.count = newGame.player.getLifeCount() + " x ";
};

LifeCounter.prototype.render = function() {
    ctx.font = "40px Arial Black";
    ctx.fillStyle = "red";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.fillText(this.count, this.x - 80, this.y + 50);
    ctx.strokeText(this.count, this.x - 80, this.y + 50);
}

//This initialize the object 'score counter'
var ScoreCounter = function(x, y, score) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/Star_39x66.png';
    this.count = score + " x ";
};

ScoreCounter.prototype.update = function() {
    this.count = newGame.player.getScoreCount() + " x ";
}

ScoreCounter.prototype.render = function() {
    ctx.font = "40px Arial Black";
    ctx.fillStyle = "Black";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.fillText(this.count, this.x - 80, this.y + 50);
    ctx.strokeText(this.count, this.x - 80, this.y + 50);
}

//This initialize the object 'message'
var Messenger = function(x, y) {
    this.x = x;
    this.y = y;
    this.message = "";
};

Messenger.prototype.update = function(msg) {
    this.message = msg;
}

Messenger.prototype.render = function() {
    ctx.font = "70px Arial Black";
    ctx.fillStyle = "Black";
    ctx.fillText(this.message, this.x, this.y);
    ctx.strokeText(this.message, this.x, this.y);
}


// This listens for key presses and sends the keys to your
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'spacebar',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if (e.keyCode === 32){
        newGame.handleInput(allowedKeys[e.keyCode]);
    } else {
        var position = newGame.player.handleInput(allowedKeys[e.keyCode]);
        // Verify if the player has reached the top
        if (position <= -30) {
            // Celebration time!!
            newGame.celebration();
        }
    }
    
})


// This Object will control all the game
var newGame = new Game();

