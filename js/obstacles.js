class Obstacle {
    constructor(ctx, width, height, image, gameWidth, gameHeight,posX,posY, brk) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
  
      this.image = new Image();
      this.image.src = image;
      
      this.posX = posX 
      this.posY = posY
      this.brk = brk;
     
  
      this.vx = 10;
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
    }
  }