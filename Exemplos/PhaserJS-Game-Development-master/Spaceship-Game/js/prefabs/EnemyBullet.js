var SpaceHipster = SpaceHipster || {};

SpaceHipster.EnemyBullet = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'bullet');


    this.anchor.setTo(0.5);
    this.checkWorldBounds = true; //mermi taşmasını kontrol etsin mi
    this.outOfBoundsKill = true; //mermi kaldır

}

SpaceHipster.EnemyBullet.prototype = Object.create(Phaser.Sprite.prototype);
SpaceHipster.EnemyBullet.prototype.constructor = SpaceHipster.EnemyBullet;