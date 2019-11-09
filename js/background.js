class Background {
    constructor(ctx, width, height, image,posX,posY, vx) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
  
      this.image = new Image();
      this.image.src = image;
  
      this.posX = posX;
      this.posY = posY;
  
      this.vx = vx;
    }
  
    draw() {
      this.ctx.drawImage(this.image, this.posX, this.posY, this.width, this.height);
      this.ctx.drawImage(this.image, this.posX + this.width, this.posY, this.width, this.height)
    }
  
    move() {
      this.posX -= this.vx;
  
      if(this.posX <= -this.width) this.posX = 0;
    }
  }