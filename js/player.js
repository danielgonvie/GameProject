class Player {
  constructor(ctx, width, height, image, imageTackle, imageCrouch,imageJump, gameWidth, gameHeight, keys, fury, unstoppable) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;


    this.image = new Image();
    this.image.src = image;
    this.imageTackle = new Image();
    this.imageTackle.src = imageTackle;
    this.imageCrouch = new Image();
    this.imageCrouch.src = imageCrouch;
    this.imageJump = new Image();
    this.imageJump.src = imageJump;
    


    this.posX = 50;
    this.posY = gameHeight * 0.95 - this.height;
    this.posX0 = 50;
    this.posY0 = gameHeight * 0.95 - this.height;
    this.vx = 8;
    this.vy = 1;
    this.gravity = 0.8;
    this.backForce = 0.8;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.fury = fury; // Player is tackling
    this.unstoppable = unstoppable;

    this.frames = 6;
    this.framesIndex = 0;

    this.size = this.height / 2
    this.newSize = this.height / 2

    this.keys = keys;
    this.bullets = [];
    this.setListeners()

  }

  draw(framesCounter) {
    if(this.fury){
    this.ctx.drawImage(
      
      this.imageTackle,
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
    else if (this.jump){
      this.ctx.drawImage(
        this.imageJump,
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
    else if (this.crouch){
      this.ctx.drawImage(
        this.imageCrouch,
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
    } else {
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




    this.clearBullets()
    this.bullets.forEach(bullet => bullet.draw())
    
  }

  move() {
    if (this.posY <= this.posY0) {
      this.posY += this.vy;
      this.vy += this.gravity;
    } else {
      this.vy = 1;
      this.posY = this.posY0;
    }

    if (this.posX >= this.posX0) {
      this.posX = this.posX += this.vx
      this.vx -= this.backForce
    } else {
      this.vx = 0;
      this.posX = this.posX0;
    }
    this.bullets.forEach(bullet => bullet.move())
  }

  unstoppable() {
    this.unstoppable = true;
  }

  clearBullets() {
    this.bullets = this.bullets.filter(bullet => (bullet.posY >= 0))
  }
   animate(framesCounter) {
    if(framesCounter % 10 === 0) {
      this.framesIndex++;
 
      if(this.framesIndex > 5) this.framesIndex = 0;
    }
  } 

  setListeners() {
    document.addEventListener('keydown', (e) => {
      switch (e.keyCode) {
        case this.keys.W_KEY: //Jump
        this.jump = true
          if (this.posY >= this.posY0) {
            this.posY -= this.vy;
            this.vy -= 15;
          }
          break;
        case this.keys.S_KEY: //Crouch
          this.crouch = true
          if (this.size === this.newSize) {
            this.height = this.height / 2;
            this.posY = this.gameHeight * 0.95 - this.height;
            this.posY0 = this.gameHeight * 0.95 - this.height;
            this.newSize = 0;
          }
          break;

        case this.keys.D_KEY: //Tackle
        
          if (this.fury === false && this.posX <= this.posX0 + 5) {
            this.vx += 15;
            this.posX += this.vx;
           
            this.fury = true;
            setTimeout(this.tackle=false, 2000)
            
          }
          
          break;

        case this.keys.A_KEY: //fire up
          if (this.bullets.length < 3) {
            this.bullets.push(new Bullet(this.ctx, 100, 50, "imgs/NOPE.png", this.posX + this.width / 2, this.posY, "bullet", 0, 10));
          }
          break;



      }

    })




    document.addEventListener('keyup', (e) => {
      switch (e.keyCode) {

        case this.keys.S_KEY: //Crouch Up
        this.crouch=false;
          this.height = this.height * 2
          this.posY = this.gameHeight * 0.95 - this.height
          this.posY0 = this.gameHeight * 0.95 - this.height
          this.newSize = this.height / 2
          break;

        case this.keys.D_KEY:

          this.fury = false;


          break;
          case this.keys.W_KEY:

              this.jump = false;
    
    
              break;


      }
    })
  }


}