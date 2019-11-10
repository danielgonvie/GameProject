const Game = {
    canvas: undefined,
    ctx: canvas.getContext('2d'),
    width: undefined,
    height: undefined,
    fps: 60,
    framesCounter: 0,
    playerKeys: {
        W_KEY: 87,
        S_KEY: 83,
        D_KEY: 68,
        A_KEY: 65,
        
    },
    score: 0,
    bestScore: 50,
    some: Math.floor(Math.random(100 - 60 + 1) + 60),
    some2: Math.floor(Math.random(700 - 250 + 1) + 250),
    
    imageGame: new Image(),
    
    

    randomPlayer: Math.floor(Math.random() * 3) + 1,

    init: function () {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.score = 0;
        
        this.start();
    },

    start: function () {
        this.reset()
        this.drawPlayer();
        this.interval = setInterval(() => {
            this.framesCounter++;

            this.clear();

            this.drawAll();
            
            this.moveAll();
            
            this.clearObstacles()
            if (this.framesCounter % this.some === 0) this.generateObstacles()
            if (this.framesCounter % this.some2 === 0) this.generateObstacles2()
            if (this.framesCounter % 20 === 0) this.score++;
            if (this.isOver()) this.generateBomb()


            if (this.isCollision() && this.isBreakable()) this.obstacles.shift()
            if (this.player.bullets.length > 0) {
                if (this.isCollisionBulletBomb()) {
                    this.bombs.shift();
                    console.log(this.bombs)
                }
            }
            if (this.isCollision()) this.gameOver()
           
            if (this.framesCounter > 1000) this.framesCounter = 0;

        }, 1000 / this.fps)
    },

    reset: function () {
        this.background = new Background(this.ctx, this.width, this.height*0.75, "img/Background-back.png",0,0, 2);
        this.background2 = new Background(this.ctx, this.width, this.height*0.30, "img/Background-front.png",0,this.height*0.60, 4);
        this.background3 = new Background(this.ctx, this.width, this.height/4, "img/Background-ground.png",0,this.height*0.84, 10);
        
        this.gameOverSound = new Audio("audio/gameover.mp3")
        this.victorySound = new Audio("audio/victory fanfare.mp3")
        

        this.obstacles = [];
        this.obstacles2 = [];
        this.bombs = [];
        
        

        this.isPaused = false;
        this.isResume = true;

        ScoreBoard.init(this.ctx, this.score)
        BestScoreBoard.init(this.ctx, this.bestScore)

    },

    clear: function () {
        this.ctx.clearRect(0, 0, this.width, this.height)
    },

    drawAll: function () {
        this.background.draw();
        this.background2.draw();
        this.background3.draw();
        this.player.draw(this.framesCounter);
        
        this.obstacles.forEach(obstacle => obstacle.draw(this.framesCounter))
        this.obstacles2.forEach(obstacle => obstacle.draw(this.framesCounter))
        this.bombs.forEach(bomb => bomb.draw(this.framesCounter))
        ScoreBoard.draw(this.score)
        BestScoreBoard.draw(this.bestScore)
        
        this.imageGame.src = "imgs/gameoverBIEN.png"
    },

    drawPlayer: function () {
        if (this.randomPlayer == 1) {
            this.player = new Player(this.ctx, this.width * 0.08, this.height * 0.20, 'imgs/run-sito.png', 'imgs/empuuuuuje-sito.png', 'imgs/agacharsecon-sito.png', 'imgs/jump-sito.png', this.width, this.height, this.playerKeys, false, false);
        } else if (this.randomPlayer == 2) {
            this.player = new Player(this.ctx, this.width * 0.08, this.height * 0.20, 'imgs/run-carlos.png', 'imgs/empuuuuuje-carlos.png', 'imgs/agacharsecon-carlos.png', 'imgs/jump-carlos.png', this.width, this.height, this.playerKeys, false, false);
        }
        else {
            this.player = new Player(this.ctx, this.width * 0.08, this.height * 0.20, 'imgs/run-lore.png', 'imgs/empuuuuuje-lore.png', 'imgs/agacharsecon-lore.png', 'imgs/jump-lore.png', this.width, this.height, this.playerKeys, false, false);
        }

       

    },

    moveAll: function () {
        this.background.move()
        this.background2.move()
        this.background3.move()
        this.player.move()
        this.obstacles.forEach(obstacle => obstacle.move())
        this.obstacles2.forEach(obstacle => obstacle.move())
        this.bombs.forEach(bomb => bomb.move())
    },

    randomCharacter: function () {
        this.randomPlayer = Math.floor(Math.random() * 3) + 1;
    },

    generateObstacles: function () { //real
        let randomFactor = 0
        randomFactor = Math.floor(Math.random() * 3) + 1
        if (randomFactor == 1) {
            this.obstacles.push(new Obstacle(this.ctx, this.width * 0.04, this.height * 0.10, 'img/obstaculo-tierra.png', this.width, this.height, this.width, this.height * 0.95 - this.height * 0.10, "unstoppable", 10, 0, 6))
        } else if (randomFactor == 2) {
            this.obstacles.push(new Obstacle(this.ctx, this.width * 0.11, this.height * 0.09, 'img/obstaculo-semiterraneo.png', this.width, this.height, this.width, this.height * 0.95 - this.height * 0.25, "unstoppable", 10, 0, 2))
        }
        else {
            this.obstacles.push(new Obstacle(this.ctx, this.width * 0.11, this.height * 0.25, 'img/obstaculo-muro.png', this.width, this.height, this.width, this.height * 0.70, "breakable", 10, 0, 1))
        }

    },

    generateObstacles2: function () {
        this.obstacles2.push(new Obstacle(this.ctx, this.width * 0.19, this.height * 0.20, 'img/obstaculo-aire.png', this.width, this.height, this.width, this.height * 0.20 - this.height * 0.10, "unstoppable", 5, 0, 2))
    },

    generateBomb: function () {

        if (this.bombs.length < 2) {
            this.bombs.push(new Obstacle(this.ctx, this.width * 0.04, this.height * 0.12, 'img/bulletbomb.png', this.width, this.height, this.width * 0.07, this.height * 0.30 - this.height * 0.10, "destroyable", 0, 5, 2))
            this.archivo.play()
        }
    },

    gameOver: function () {
        if (this.score > this.bestScore) {
            this.victorySound.play()
            this.bestScore = this.score;
            this.victorySound.play()
            setTimeout(function(){ alert("                                        NEW RECORD \n                                   CONGRATULATIONS\n                                          !!!!!!!!!!!!!!!"); }, 500);
        } else {

        this.gameOverSound.play()}

        this.ctx.drawImage(this.imageGame,this.width*0.27,this.height*0.20,700,300)
        
        
        
        
            clearInterval(this.interval)
            
        

    },





    isCollision: function () {

        if (this.obstacles.some(obs => (this.player.posX + (this.player.width - (this.player.width / 4)) > obs.posX && obs.posX + (obs.width - (obs.width/4)) > this.player.posX && this.player.posY + this.player.height > obs.posY && obs.posY + obs.height > this.player.posY)) || this.bombs.some(bomb => (this.player.posX + this.player.width > bomb.posX && bomb.posX + bomb.width > this.player.posX && this.player.posY + this.player.height > bomb.posY && bomb.posY + bomb.height > this.player.posY))) {
            return true
        }

    },
    isCollisionBulletBomb: function () {

        if (this.bombs.some(bomb => (this.player.bullets[0].posX + this.player.bullets[0].width > bomb.posX && bomb.posX + bomb.width > this.player.bullets[0].posX && this.player.bullets[0].posY + this.player.bullets[0].height > bomb.posY && bomb.posY + bomb.height > this.player.bullets[0].posY))
        ) { return true }
    },

    isBreakable: function () {
        if (this.obstacles.some(obs => (this.player.posX + this.player.width > obs.posX && obs.posX + obs.width > this.player.posX && this.player.posY + this.player.height > obs.posY && obs.posY + obs.height > this.player.posY)) && this.player.fury === true && this.obstacles[0].brk === "breakable") {

            return true;
        }
    },



    isOver: function () {
        if (this.obstacles2.some(obs => (obs.posX <= this.player.posX0 + 2))) {

            return true;
        }
    },
    clearObstacles: function () {
        this.obstacles = this.obstacles.filter(obstacle => (obstacle.posX >= -5))
        this.obstacles2 = this.obstacles2.filter(obstacle => (obstacle.posX >= -5))
        this.bombs = this.bombs.filter(bomb => bomb.posY < this.height + 20)
        this.player.bullets = this.player.bullets.filter(bullet => bullet.posY > 0)
    },

    pauseGame: function () {
        if (this.isPaused === false) {
            clearInterval(this.interval);
            this.isPaused = true;
        }
    },

    


    fakeStart: function () {
        if (this.isResume === true && this.isPaused === true) {
            this.isPaused = false
            this.drawPlayer();
            this.interval = setInterval(() => {
                this.framesCounter++;
    
                this.clear();
    
                this.drawAll();
                
                this.moveAll();
    
                this.clearObstacles()
                if (this.framesCounter % this.some === 0) this.generateObstacles()
                if (this.framesCounter % this.some2 === 0) this.generateObstacles2()
                if (this.framesCounter % 20 === 0) this.score++;
                if (this.isOver()) this.generateBomb()
    
    
                if (this.isCollision() && this.isBreakable()) this.obstacles.shift()
                if (this.player.bullets.length > 0) {
                    if (this.isCollisionBulletBomb()) {
                        this.bombs.shift();
                        console.log(this.bombs)
                    }
                }
                if (this.isCollision()) this.gameOver()
    
                if (this.framesCounter > 1000) this.framesCounter = 0;
    
            }, 1000 / this.fps)

        }
    }



}