var SpaceHipster = SpaceHipster || {};

SpaceHipster.GameState = {
    
    init:function(currentLevel) {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.PLAYER_SPEED = 750;
        this.BULLET_SPEED = -700;
        
        this.numLevels = 10;
        this.currentLevel = currentLevel ? currentLevel : 1;
        alert('Niveau ' + this.currentLevel);
        
        
        
    },
    
    preload: function() {
        
        // load images 
        
        this.load.image('space','vendors/assets/images/back.png');       
        this.load.image('player','vendors/assets/images/ship/player.png');
        this.load.image('bullet','vendors/assets/images/bullet/bullet.png');
        this.load.image('enemy_bullet','vendors/assets/images/bullet/bullet_red.png');
        this.load.image('enemyParticle','vendors/assets/images/particle/2.png');
        this.load.image('playerParticle','vendors/assets/images/particle/4.png'); 
        this.load.image('enemyTouch','vendors/assets/images/particle/1.png'); 
        this.load.image('smallEnemy','vendors/assets/images/ship/enemy-red.png');
        this.load.image('boss','vendors/assets/images/ship/alien_ship.png');
        this.load.image('bigEnemy','vendors/assets/images/ship/bigEnemy.png');
        
        // load data level
        
        this.load.text('Niveau1','resources/json/level1.json');
        this.load.text('Niveau2','resources/json/level2.json');
        this.load.text('Niveau3','resources/json/level3.json');
        this.load.text('Niveau4','resources/json/level4.json');
        this.load.text('Niveau5','resources/json/level5.json');
        this.load.text('Niveau6','resources/json/level6.json');
        this.load.text('Niveau7','resources/json/level7.json');
        this.load.text('Niveau8','resources/json/level8.json');
        this.load.text('Niveau9','resources/json/level9.json');
        this.load.text('Niveau10','resources/json/level10.json');
        
        //load sound
        this.load.audio('touch',['vendors/assets/sounds/Explosion13.ogg']);
        this.load.audio('backsound',['vendors/assets/sounds/boss.ogg']);
        this.load.audio('gameover',['vendors/assets/sounds/Explosion18.ogg']);
    },
       
    create: function () {
        
        
        // background
        this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height,'space');
    
        
        this.background.autoScroll(0,60);
        
        // player 
        this.player = this.add.sprite(this.game.world.centerX, this.game.world.height ,'player');
        this.player.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
        
        //player bullet
        this.initBullets();
        this.shootingTimer = this.game.time.events.loop(Phaser.Timer.SECOND/7,this.createPlayerBullet, this);
        
        //enemies
        this.initEnemies();
        
        //load level
        this.loadLevel();
            this.backsound = this.add.audio('backsound');
        this.backsound.play();
        
        
       
    },
    update: function() {
        
        this.game.physics.arcade.overlap(this.playerBullets, this.enemies, this.damageEnemy, null , this);this.game.physics.arcade.overlap(this.enemyBullets, this.player, this.killPlayer, null , this);
        
        this.player.body.velocity.x = 0;
        
        if(this.game.input.activePointer.isDown) {
            var targetX = this.game.input.activePointer.position.x;
            
            var direction = targetX >= this.game.world.centerX ? 1: -1;
            
            this.player.body.velocity.x = direction * this.PLAYER_SPEED;
        }
        
    },
    initBullets: function() {
        this.playerBullets = this.add.group();
        this.playerBullets.enableBody = true;
    },
    
    createPlayerBullet: function(){
        var bullet = this.playerBullets.getFirstExists(false);
       
        
        if (!bullet) {
           bullet = new SpaceHipster.PlayerBullet(this.game, this.player.x, this.player.top/0.98);
            this.playerBullets.add(bullet);
        }
        else {
            bullet.reset(this.player.x, this.player.top/0.98);
        }
        
        bullet.body.velocity.y = this.BULLET_SPEED;
},
    
    initEnemies: function(){
          
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
        
        
        this.enemyBullets = this.add.group();
        this.enemyBullets.enableBody = true;
      
     
        
    },
    
    damageEnemy: function(bullet, enemy) {
        enemy.damage(1);
        bullet.kill();
        this.touch = this.add.audio('touch');
        this.touch.volume = 0.1;
        this.touch.play();
    },
    
    killPlayer: function() {
        var emitter = this.game.add.emitter( this.player.body.x, this.game.world.height - this.player.height);
        emitter.makeParticles('playerParticle');
        emitter.start(true, 250,null,100);
        this.player.kill();
        this.backsound.stop();
        this.gameover = this.add.audio('gameover');
        this.gameover.volume = 0.8;
        this.gameover.play();
        setTimeout(function(){
            alert('Game Over!');
         SpaceHipster.game.state.start('GameState');
        },2000);
       
        
    },
    
    createEnemy: function(x, y, health, key , scale , speedX, speedY){
        var enemy = this.enemies.getFirstExists(false);
        
        if(!enemy){
            enemy = new SpaceHipster.Enemy(this.game, x, y, key, health, this.enemyBullets);
            this.enemies.add(enemy);
        }
            enemy.reset(x, y, health, key,scale, speedX, speedY);
    },
    
    loadLevel: function() {
        
        this.currentEnemyIndex = 0;
        
        this.levelData = JSON.parse(this.game.cache.getText('Niveau' + this.currentLevel));
        

    this.endOfLevelTimer = this.game.time.events.add(this.levelData.duration * 1000,function(){
        alert('Fin du niveau ' + this.currentLevel + " !");
        this.backsound.stop();
        
        if(this.currentLevel < this.numLevels) {
            this.currentLevel++;
        }
        else {
            this.currentLevel= this.currentLevel;
            alert('Bravo ! tu a fini le jeu .');
            document.location.href="play.html";
        }
        
        this.game.state.start('GameState', true, false, this.currentLevel);
    },this);
        
    this.scheduleNextEnemy();
  },
    
    scheduleNextEnemy: function() {
        var nextEnemy = this.levelData.enemies[this.currentEnemyIndex];
        
        if(nextEnemy) {
            var nextTime = 1000 * (nextEnemy.time -(this.currentEnemyIndex ==0 ? 0: this.levelData.enemies[this.currentEnemyIndex-1].time));
            
            this.nextEnemyTimer = this.game.time.events.add(nextTime,function(){
                this.createEnemy(nextEnemy.x * this.game.world.width, -100 , nextEnemy.health, nextEnemy.key , nextEnemy.scale , nextEnemy.speedX , nextEnemy.speedY);
                
                this.currentEnemyIndex++;
                this.scheduleNextEnemy();
            },this);
        };
        
        }
};
