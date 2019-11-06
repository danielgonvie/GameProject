const Game = {
    canvas: undefined,
    ctx: undefined,
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
            this.moveAll();

             this.clearObstacles()
            if (this.framesCounter % 70 === 0) this.generateObstacles()
            if (this.framesCounter % 150 === 0) this.generateObstacles2()
            if (this.framesCounter % 20 === 0) this.score++;
            if ( this.isOver()) this.generateBomb()

           
           if (this.isCollision() && this.isBreakable()) this.obstacles.shift() 
           if (this.isCollisionBulletBomb()) {
               this.bombs.shift();
                console.log(this.bombs)
           }    
            if (this.isCollision()) this.gameOver() 
            if (this.framesCounter > 1000) this.framesCounter = 0;
            
        }, 1000 / this.fps)
    },

    reset: function () {
        this.background = new Background(this.ctx, this.width, this.height);
        this.player = new Player(this.ctx, this.width * 0.08, this.height * 0.20, 'imgs/black-square.png', this.width, this.height, this.playerKeys, false, false);
        this.obstacles = [];
        this.obstacles2 = [];
        this.bombs =[];
        this.isPaused = false;
        this.isResume = true;
        
        ScoreBoard.init(this.ctx, this.score)
        BestScoreBoard.init(this.ctx,this.bestScore)
        
    },

    clear: function () {
        this.ctx.clearRect(0, 0, this.width, this.height)
    },

    drawAll: function () {
        this.background.draw();
        this.player.draw(this.framesCounter);
        this.obstacles.forEach(obstacle => obstacle.draw())
        this.obstacles2.forEach(obstacle => obstacle.draw())
        this.bombs.forEach(bomb => bomb.draw())
        ScoreBoard.draw(this.score)
        BestScoreBoard.draw(this.bestScore)
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
       if (randomFactor == 1){
       this.obstacles.push(new Obstacle(this.ctx, this.width * 0.04, this.height * 0.10, 'imgs/green-square.png',  this.width, this.height,this.width,this.height * 0.95 - this.height * 0.10,"unstoppable", 10, 0 ))
       } else if (randomFactor == 2){
       this.obstacles.push(new Obstacle(this.ctx, this.width * 0.04, this.height * 0.10, 'imgs/yellow-square.png', this.width, this.height,this.width,this.height * 0.95 - this.height * 0.25,"unstoppable", 10, 0 ))
       } 
       else {
        this.obstacles.push(new Obstacle(this.ctx, this.width * 0.04, this.height * 0.30, 'imgs/red-square.png', this.width, this.height,this.width,this.height * 0.95 - this.height * 0.30, "breakable",10, 0 ))
       }
      
   }, 

   generateObstacles2: function(){
    this.obstacles2.push(new Obstacle(this.ctx, this.width * 0.04, this.height * 0.10, 'imgs/green-square.png',  this.width, this.height,this.width,this.height * 0.20 - this.height * 0.10, "unstoppable",5, 0 )) 
   },

   generateBomb: function(){
       
       if (this.bombs.length < 1){
    this.bombs.push(new Obstacle(this.ctx, this.width * 0.04, this.height * 0.10, 'imgs/yellow-square.png',  this.width, this.height,this.width * 0.05,this.height * 0.30 - this.height * 0.10, "destroyable",0, 10 ))
       }   
},

     gameOver: function () {
        if (this.score > this.bestScore){
            this.bestScore = this.score;
            alert ("NEW RECORD")}
        clearInterval(this.interval)
        
    }, 

     isCollision: function () {
        // colisiones genéricas
        // (p.x + p.w > o.x && o.x + o.w > p.x && p.y + p.h > o.y && o.y + o.h > p.y )
        let obstacleHitted = this.obstacles.some(obs => (this.player.posX + this.player.width > obs.posX && obs.posX + obs.width > this.player.posX && this.player.posY + this.player.height > obs.posY && obs.posY + obs.height > this.player.posY))
        return obstacleHitted
        
    }, 
    isCollisionBulletBomb: function () {
        // colisiones genéricas
        // (p.x + p.w > o.x && o.x + o.w > p.x && p.y + p.h > o.y && o.y + o.h > p.y )
        if( this.bombs.some(bomb => (this.player.bullets[0].posX + this.player.bullets[0].width > bomb.posX && bomb.posX + bomb.width > this.player.bullets[0].posX && this.player.bullets[0].posY + this.player.bullets[0].height > bomb.posY && bomb.posY + bomb.height > this.player.bullets[0].posY))
        ){return true}
    },

        isBreakable: function () {
            if (this.obstacles.some(obs => (this.player.posX + this.player.width > obs.posX && obs.posX + obs.width > this.player.posX && this.player.posY + this.player.height > obs.posY && obs.posY + obs.height > this.player.posY)) && this.player.fury === true && this.obstacles[0].brk === "breakable"){
                
                return true;
            }
        },

        isDestroyable: function () {
            if (this.bombs.some(bomb => (this.player.posX + this.player.width > bomb.posX && bomb.posX + bomb.width > this.player.posX && this.player.posY + this.player.height > bomb.posY && bomb.posY + bomb.height > this.player.posY)) && this.bombs[0].brk === "destroyable"){
                
                return true;
            }
        },

        isOver: function (){
            if (this.obstacles2.some(obs => (obs.posX <= this.player.posX0 + 2))){
                
                return true;
            }
        },
     clearObstacles: function () {
        this.obstacles = this.obstacles.filter(obstacle => (obstacle.posX >= -5))
        this.obstacles2 = this.obstacles2.filter(obstacle => (obstacle.posX >= -5))
        this.bombs = this.bombs.filter(bomb => bomb.posY < this.height +20)
    },

    pauseGame: function () {
        if (this.isPaused === false){
          clearInterval(this.interval);
          this.isPaused = true;
        }
      },

      

      fakeStart: function () {
        if (this.isResume === true && this.isPaused === true){
        this.interval = setInterval(() => {
            this.framesCounter++;

            this.clear();
            
            this.drawAll();
            this.moveAll();

             this.clearObstacles()
            if (this.framesCounter % 70 === 0) this.generateObstacles()
            if (this.framesCounter % 150 === 0) this.generateObstacles2()
            if (this.framesCounter % 20 === 0) this.score++;


           
           if (this.isCollision() && this.isBreakable()) this.obstacles.shift() 
            if (this.isCollision()) this.gameOver() 
            if (this.framesCounter > 1000) this.framesCounter = 0;
            
        }, 1000 / this.fps)
        this.isResume = true;
        this.isPaused = false;
    }
    
},  



}