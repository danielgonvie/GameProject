class Obstacle {
  constructor(ctx, width, height, image, gameWidth, gameHeight, posX, posY, brk, vx, vy, frames) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    this.image = new Image();
    this.image.src = image;

    this.posX = posX
    this.posY = posY
    this.brk = brk;

    this.frames = frames;
    this.framesIndex = 0;

    this.vx = vx;
    this.vy = vy;
  }


  draw(framesCounter) {
    this.ctx.drawImage(
      this.image,
      this.framesIndex * Math.floor(this.image.width / this.frames) ,
      0,
      Math.floor(this.image.width/this.frames),
      this.image.height,
      this.posX,
      this.posY,
      this.width,
      this.height
    )
    
    this.animate(framesCounter)
  }


  move() {
    this.posX -= this.vx;
    this.posY += this.vy;
  }


  animate(framesCounter) {
    if (framesCounter % 10 === 0) {
      this.framesIndex++;

      if (this.framesIndex == this.frames) this.framesIndex = 0;
    }
  }
}