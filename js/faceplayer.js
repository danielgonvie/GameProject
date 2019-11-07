class FacePlayer {
    constructor(ctx, width, height, image, posX, posY) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
  
      this.image = new Image();
      this.image.src = image;
  
      this.posX = posX
      this.posY = posY
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
  
  }