class Bullet {
    constructor(ctx, radius, playerX, playerY, playerWidth, playerHeight, floor) {
      this.ctx = ctx;
      this.radius = radius;
  
      this.posX = playerX + playerWidth;
      this.posY = playerY + playerHeight/2;
      this.playerHeight= playerHeight;
      this.floor = floor;
  
      this.vx = 10;
      this.vy = 1;
      this.gravity = 0.9;
    }
  
    draw() {
      this.ctx.beginPath();
      this.ctx.fillStyle = 'red'
      this.ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.closePath();
    }
  
    move() {
      this.posX += this.vx;
      this.posY += this.vy;
      this.vy += this.gravity;
  
      //Accelerate > 1 &&  Decelerate < 1
      if(this.posY >= this.floor + this.playerHeight) this.vy *= -1
    }
    
  
  }


//////////////////////////////////////////////////////////////////////////////////

/* 
let canvasElem = document.querySelector("canvas"); 


    this.canvas.addEventListener("mousedown", function(e) 
    { 
        getMousePosition(canvasElem, e); 
    })
    } */

