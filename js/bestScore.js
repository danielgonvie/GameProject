const BestScoreBoard = {
    ctx: undefined,
    score:undefined,
  
    init: function(ctx, score) {
      this.ctx = ctx;
      this.score = score;
    },
  
    draw: function(score) {

      this.ctx.fillStyle = 'yellow'
      this.ctx.font = '40px sans-serif'
      this.ctx.fillText("Record: " + score, 300, 35)
      
    }
        
  }