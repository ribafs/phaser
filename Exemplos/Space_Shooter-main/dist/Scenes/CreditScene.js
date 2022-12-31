import Phaser from"phaser";export default class CreditScene extends Phaser.Scene{constructor(){super({key:"CreditScene"})}create(){this.creditsText=this.add.text(0,0,"Created by:",{fontSize:"48px",fill:"#fff"}),this.madeByText=this.add.text(0,0,"Aye Daniel",{fontFamily:"monospace",fontSize:48,fontStyle:"bold",color:"#03fc07",align:"center"}),this.zone=this.add.zone(.5*this.game.config.width,.5*this.game.config.height,this.game.config.width,this.game.config.height),Phaser.Display.Align.In.Center(this.creditsText,this.zone),Phaser.Display.Align.In.Center(this.madeByText,this.zone),this.madeByText.setY(1e3),this.creditsTween=this.tweens.add({targets:this.creditsText,y:-100,ease:"Power1",duration:2e3,delay:1e3,onComplete:()=>{this.destroy}}),this.madeByTween=this.tweens.add({targets:this.madeByText,y:-50,ease:"Power1",duration:8e3,delay:1e3,onComplete:()=>{this.madeByTween.destroy,this.scene.start("UserNameScene")}})}}