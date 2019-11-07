class FacePlayer {
    constructor(ctx, width, height, image, posX, posY, text) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
  
      this.image = new Image();
      this.image.src = image;
  
      this.posX = posX
      this.posY = posY
      this.text = text
    }
  
    draw(text) {
      this.ctx.drawImage(
        this.image,
        this.posX,
        this.posY,
        this.width,
        this.height
      )
      /* 
        this.ctx.fillStyle = 'white'
        this.ctx.font = '40px sans-serif'
        this.ctx.fillText(text, 25, 35) */
      
    }
    
  
  }