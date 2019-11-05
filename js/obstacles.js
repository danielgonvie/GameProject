class Obstacle {
    constructor(ctx, width, height, image, gameWidth, gameHeight,posX,posY, brk, vx, vy) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
  
      this.image = new Image();
      this.image.src = image;
      
      this.posX = posX 
      this.posY = posY
      this.brk = brk;
     
  
      this.vx = vx;
      this.vy = vy;
    }
  
    draw() {
        this.ctx.drawImage(
            this.image, 
            this.posX, 
            this.posY, 
            this.width, 
            this.height
            )
    }
  
    move() {
      this.posX -= this.vx;
      this.posY += this.vy;
    }
  }