

let ScoreOutput = document.querySelector('.cross-output');
let LivesOutput = document.querySelector('.lives-output');
let KillsOutput = document.querySelector('.kills-output');


class GameEntity{
    constructor(x, y, speed){
        this.x = x;
        this.y = y;
        this.speed = 100 + Math.floor(Math.random() * 500);
    }
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}
//Enemy class
class Enemy extends GameEntity{
    constructor(x, y, speed){
        super(x, y, speed);
        this.sprite = 'images/enemy-bug.png';
    }
    update(dt){
        this.x += this.speed * dt;
        //canvas width 505, if enemy reaches end position, returns back to start position
        if (this.x > 505) {
            this.x = -100;
            this.speed = 100 + Math.floor(Math.random() * 500);
        }
        //if enemy and player collide, player resets to start position and loses one life
        if (player.x < this.x + 60 && player.x + 60 > this.x && player.y < this.y + 25 && player.y + 30 > this.y) {
            player.resetPlayer()
            player.lives -= 1;
            player.kills += 1
            gameOver();
            LivesOutput.innerHTML = player.lives;
            KillsOutput.innerHTML = player.kills;       
        }
    }
}
//Heart class
class Heart extends GameEntity{
    constructor(x, y){
        super(x, y);
        this.sprite = 'images/Heart.png';
    }
    update(){
        //if player collects the heart, heart changes position and player gets one life
        if (player.x < this.x + 50 && player.x + 50 > this.x && player.y < this.y + 50 && player.y + 75 > this.y) {
            this.x = Math.floor(Math.random() * 5) * 100;
            this.y = Math.floor(Math.random() * 5) * 90;
            player.lives += 1;
            LivesOutput.innerHTML = player.lives;
        }
    }
}
//Rock class
class Rock extends GameEntity{
    constructor(x, y){
        super(x, y);
        this.sprite = 'images/Rock.png';
    }
    update(){
        //if player hits the rock, rock changes position and player loses one life
        if (player.x < this.x + 50 && player.x + 35 > this.x && player.y < this.y + 50 && player.y + 50 > this.y) {
            this.x = Math.floor(Math.random() * 5) * 100;
            this.y = Math.floor(Math.random() * 5) * 90;
            player.lives -= 1;
            gameOver();
            LivesOutput.innerHTML = player.lives;
        }
    }
}
// class player
class Player extends GameEntity{
    constructor(x , y, score, lives, kills, hidden){
        super(x, y);
        this.sprite = 'images/char-boy.png';
        this.score = 0;
        this.lives = 3;
        this.kills = 0;
        LivesOutput.innerHTML = this.lives;
        KillsOutput.innerHTML = this.kills;
        ScoreOutput.innerHTML = this.score;
        this.hidden = false;
    }
    update(dt){
        if(this.key === 'left' && this.x > 0){
            this.x -= 100;
        }
        if(this.key === 'right' && this.x < 400){
            this.x += 100;
        }
        if(this.key === 'up'){
            this.y -= 85;
            //if player reaches sea, player resets to start position
         if(this.y < 0){
            this.resetPlayer();
            //rock and heart change positions
            heart.x = Math.floor(Math.random() * 5) * 100;
            heart.y = Math.floor(Math.random() * 5) * 90;
            displayRocks();
            this.score += 1;
            ScoreOutput.innerHTML = this.score;
            }
        }
        if(this.key === 'down' && this.y < 340){
            this.y += 85;
        }
        this.key = 0;
    }
    render(){
        if(this.hidden == false){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }
    }
    hidePlayer(){
        this.hidden = true;
    }
    handleInput(e){
        this.key = e;
    }
    // resets the player position
    resetPlayer(){
        this.x = 200;
        this.y = 400; 
        this.hidden = false;  
    }
}
//empty arrays
let allRocks = [];
let allEnemies = [];

//function pushes rock objects to array, and puts them to random positions
function displayRocks() {
    allRocks = [];
    allRocks.push(new Rock(Math.floor(Math.random() * 5) * 100, Math.floor(Math.random() * 5) * 90));
    allRocks.push(new Rock(Math.floor(Math.random() * 5) * 100, Math.floor(Math.random() * 5) * 90));
    
   }
//function pushes all enemy objects to array
function displayEnemy() {
 allEnemies.push(new Enemy(0, 55));
 allEnemies.push(new Enemy(0, 140));
 allEnemies.push(new Enemy(0, 225));
}

//this function triggers when player lost all lives
function gameOver(){
if(player.lives <= 0){
    player.hidePlayer();
    player.lives = 0;
    player.score = 0;
    player.kills = 0;
    ScoreOutput.innerHTML = player.score;
    KillsOutput.innerHTML = player.kills;
    LivesOutput.innerHTML = player.lives;
    //Modal appears
    swal({
		closeOnEsc: false,
		closeOnClickOutside: false,
		title: 'Game Over!',
		text: 'You lost all your lives!',
		icon: 'error',
		button: 'Play again!'
	}).then(function (isConfirm) {
		if (isConfirm) {
            newGame();
		}
	})
}
}
//this function creates new game
function newGame(){
    player.lives = 3;
    player.score = 0;
    ScoreOutput.innerHTML = player.score;
    LivesOutput.innerHTML = player.lives;
    player.resetPlayer();
}

let rock = new Rock();
let heart = new Heart(100, 200);
let player = new Player(200, 400);

displayEnemy();
displayRocks();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. 
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
