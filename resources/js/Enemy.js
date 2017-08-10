var SpaceHipster = SpaceHipster || {};

SpaceHipster.Enemy = function (game, x, y, key, health, enemyBullets){
    Phaser.Sprite.call(this, game, x, y, key);
    
    
    
    this.anchor.setTo(0.5);
    this.health = health;
    
    this.enemyBullets = enemyBullets;
    
    this.enemyTimer = this.game.time.create(false);
    this.enemyTimer.start();
    
    this.scheduleShooting();
    
};

SpaceHipster.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
SpaceHipster.Enemy.prototype.constructor = SpaceHipster.Enemy;

SpaceHipster.Enemy.prototype.update = function(player) {
    if(this.x <0.05 * this.game.world.width) {
        this.x =0.05 * this.game.world.width +2;
        this.body.velocity.x *=-1;
    }
    else if(this.x >0.95 * this.game.world.width){
        this.x =0.95 * this.game.world.width -2;
        this.body.velocity.x *=-1;
    }
    
    if(this.y >this.game.world.height) {
        this.kill();
        SpaceHipster.GameState.killPlayer();
    }
};

SpaceHipster.Enemy.prototype.damage = function(amount) {
    Phaser.Sprite.prototype.damage.call(this, amount );
    
    
    if(this.health -1){
        var emitter = this.game.add.emitter(this.x, this.y ,50);
        emitter.makeParticles('enemyTouch');
          emitter.minParticleSpeed.setTo(-100,-100);
        emitter.maxParticleSpeed.setTo(100,100);
        emitter.gravity = 0;
       emitter.start(true, 10,null,1000);
   }
    //explosion 
    
    if(this.health <= 0) {
        var emitter = this.game.add.emitter(this.x, this.y ,50);
        emitter.makeParticles('enemyParticle');
        emitter.start(true, 250,null,100);
        
        this.enemyTimer.pause();
        
    }
    
};
SpaceHipster.Enemy.prototype.reset = function(x , y , health, key , scale, speedX , speedY){
    Phaser.Sprite.prototype.reset.call(this, x, y, health);
    
    this.loadTexture(key);
    this.scale.setTo(scale);
    this.body.velocity.x = speedX;
    this.body.velocity.y = speedY;
    
    this.enemyTimer.resume();
};

SpaceHipster.Enemy.prototype.scheduleShooting = function(){
    this.shoot();
    this.enemyTimer.add(Phaser.Timer.SECOND * 3.5, this.scheduleShooting,this)
};

SpaceHipster.Enemy.prototype.shoot = function () {
    var bullet = this.enemyBullets.getFirstExists(false);
    
    if(!bullet) {
        bullet = new SpaceHipster.EnemyBullet(this.game,this.x, this.bottom/0.97);
        this.enemyBullets.add(bullet);
    }else{
        bullet.reset(this.x, this.y);
    }
    
    bullet.body.velocity.y = 100;
}