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
        A_KEY: 65
    },
    score: 0,
    bestScore: 10,
    some: Math.floor( Math.random( 100 - 60 + 1) + 60),
    some2: Math.floor( Math.random( 700 - 250 + 1) + 250) ,
    
    randomPlayer: Math.floor(Math.random() * 3) + 1 ,

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
        this.interval = setInterval(() => {
            this.framesCounter++;

            this.clear();

            this.drawAll();
            this.drawPlayer();
            this.moveAll();

            this.clearObstacles()
            if (this.framesCounter % this.some === 0) this.generateObstacles()
            if (this.framesCounter % this.some2 === 0) this.generateObstacles2()
            if (this.framesCounter % 20 === 0) this.score++;
            if (this.isOver()) this.generateBomb()


            if (this.isCollision() && this.isBreakable()) this.obstacles.shift()
            if (this.player.bullets.length > 0){
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
        this.background = new Background(this.ctx, this.width, this.height);
        
        if (this.randomPlayer == 1) {
            this.player = new Player(this.ctx, this.width * 0.08, this.height * 0.20, 'imgs/run-sito.png','imgs/empuuuuuje-sito.png','imgs/agacharsecon-sito.png','imgs/jump-sito.png', this.width, this.height, this.playerKeys, false, false);
        } else if (this.randomPlayer == 2) {
            this.player = new Player(this.ctx, this.width * 0.08, this.height * 0.20, 'imgs/run-carlos.png','imgs/empuuuuuje-carlos.png','imgs/agacharsecon-carlos.png','imgs/jump-carlos.png', this.width, this.height, this.playerKeys, false, false);
        }
        else {
            this.player = new Player(this.ctx, this.width * 0.08, this.height * 0.20, 'imgs/run.png','imgs/empuuuuuje-lore.png','imgs/agacharsecon-lore.png','imgs/jump-lore.png', this.width, this.height, this.playerKeys, false, false);
        }
        
        this.obstacles = [];
        this.obstacles2 = [];
        this.bombs = [];
        this.facePlayer=[];

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
        this.player.draw(this.framesCounter);
        this.facePlayer.forEach(face => face.draw())
        this.obstacles.forEach(obstacle => obstacle.draw())
        this.obstacles2.forEach(obstacle => obstacle.draw())
        this.bombs.forEach(bomb => bomb.draw())
        ScoreBoard.draw(this.score)
        BestScoreBoard.draw(this.bestScore)
    },

    drawPlayer: function(){
        if (this.randomPlayer == 1) {
            this.facePlayer.push(new FacePlayer(this.ctx, this.width * 0.05, this.height * 0.10, 'imgs/sitoface.png', this.width * 0.50, this.height * 0.01))
        } else if (this.randomPlayer == 2) {
            this.facePlayer.push(new FacePlayer(this.ctx, this.width * 0.05, this.height * 0.10, 'imgs/carlosface.png', this.width * 0.50, this.height * 0.01))
        }
        else {
            this.facePlayer.push(new FacePlayer(this.ctx, this.width * 0.05, this.height * 0.10, 'imgs/face-lore.png', this.width * 0.50, this.height * 0.01))
        }
          
    },

    moveAll: function () {
        this.background.move()
        this.player.move()
        this.obstacles.forEach(obstacle => obstacle.move())
        this.obstacles2.forEach(obstacle => obstacle.move())
        this.bombs.forEach(bomb => bomb.move())
    },

    /*  generateObstacles: function () { //fake
        
        this.obstacles.push(new Obstacle(this.ctx, this.width * 0.04, this.height * 0.30, 'imgs/yellow-square.png', this.width, this.height,this.width,this.height * 0.98 - this.height * 0.30, "breakable" ))
        
    },  */

    generateObstacles: function () { //real
        let randomFactor = 0
        randomFactor = Math.floor(Math.random() * 3) + 1
        if (randomFactor == 1) {
            this.obstacles.push(new Obstacle(this.ctx, this.width * 0.06, this.height * 0.10, 'imgs/fran.png', this.width, this.height, this.width, this.height * 0.95 - this.height * 0.10, "unstoppable", 10, 0))
        } else if (randomFactor == 2) {
            this.obstacles.push(new Obstacle(this.ctx, this.width * 0.06, this.height * 0.10, 'imgs/hector.png', this.width, this.height, this.width, this.height * 0.95 - this.height * 0.25, "unstoppable", 10, 0))
        }
        else {
            this.obstacles.push(new Obstacle(this.ctx, this.width * 0.06, this.height * 0.30, 'imgs/muro.png', this.width, this.height, this.width, this.height * 0.95 - this.height * 0.30, "breakable", 10, 0))
        }

    },

    generateObstacles2: function () {
        this.obstacles2.push(new Obstacle(this.ctx, this.width * 0.06, this.height * 0.12, 'imgs/dani.png', this.width, this.height, this.width, this.height * 0.20 - this.height * 0.10, "unstoppable", 5, 0))
    },

    generateBomb: function () {

        if (this.bombs.length < 2) {
            this.bombs.push(new Obstacle(this.ctx, this.width * 0.06, this.height * 0.10, 'imgs/filedrop.png', this.width, this.height, this.width * 0.07, this.height * 0.30 - this.height * 0.10, "destroyable", 0, 5))
        }
    },

    gameOver: function () {
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            alert("NEW RECORD")
        }
        clearInterval(this.interval)

    },

    
    
    

    isCollision: function () {
        // colisiones genéricas
        // (p.x + p.w > o.x && o.x + o.w > p.x && p.y + p.h > o.y && o.y + o.h > p.y )
        if (this.obstacles.some(obs => (this.player.posX + (this.player.width - (this.player.width/4)) > obs.posX && obs.posX + obs.width > this.player.posX && this.player.posY + this.player.height > obs.posY && obs.posY + obs.height > this.player.posY)) || this.bombs.some(bomb => (this.player.posX + this.player.width > bomb.posX && bomb.posX + bomb.width > this.player.posX && this.player.posY + this.player.height > bomb.posY && bomb.posY + bomb.height > this.player.posY))) {
            return true
        }

    },
    isCollisionBulletBomb: function () {
        // colisiones genéricas
        // (p.x + p.w > o.x && o.x + o.w > p.x && p.y + p.h > o.y && o.y + o.h > p.y )
        if (this.bombs.some(bomb => (this.player.bullets[0].posX + this.player.bullets[0].width > bomb.posX && bomb.posX + bomb.width > this.player.bullets[0].posX && this.player.bullets[0].posY + this.player.bullets[0].height > bomb.posY && bomb.posY + bomb.height > this.player.bullets[0].posY))
        ) { return true }
        else if (this.bombs.some(bomb => (this.player.bullets[1].posX + this.player.bullets[1].width > bomb.posX && bomb.posX + bomb.width > this.player.bullets[1].posX && this.player.bullets[1].posY + this.player.bullets[1].height > bomb.posY && bomb.posY + bomb.height > this.player.bullets[1].posY))) { return true }
        else if (this.bombs.some(bomb => (this.player.bullets[2].posX + this.player.bullets[2].width > bomb.posX && bomb.posX + bomb.width > this.player.bullets[2].posX && this.player.bullets[2].posY + this.player.bullets[2].height > bomb.posY && bomb.posY + bomb.height > this.player.bullets[2].posY))) { return true }
        else { return false }
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
    },

    pauseGame: function () {
        if (this.isPaused === false) {
            clearInterval(this.interval);
            this.isPaused = true;
        }
    },



    fakeStart: function () {
        if (this.isResume === true && this.isPaused === true) {
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
                if (this.player.bullets.length > 0){
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