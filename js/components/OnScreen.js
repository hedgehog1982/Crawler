import React from "react"
import ReactDOM from "react-dom"

const GameTitle = props => {                                        //title
    return <div className={"gameTitle"} id="gameTitle" ><h1 className={"moveRight"} >DUNGEON </h1><h1 className={"moveLeft"}> CRAWLER!!!!!!</h1></div>;
};

const preDrawShroud = () => {
  let canvas = document.createElement('canvas');
      canvas.width = 4000
      canvas.height = 4000
   let ctx = canvas.getContext("2d");
   ctx.lineWidth= 800;
   ctx.beginPath()
   ctx.arc(1000, 1000, 150, 0 , 2 * Math.PI)
   ctx.stroke()
   ctx.beginPath()
   ctx.arc(1000, 1000, 750 , 0 , 2 * Math.PI)
   ctx.stroke()
   ctx.beginPath()
      ctx.arc(1000, 1000, 1250 , 0 , 2 * Math.PI)
      ctx.stroke
   return canvas
}

const HUDCanvas =({newPlayer, enemyQTY,fps}) =>{
  let offset = 20
  let canvas = document.createElement('canvas');
      canvas.width = 200
      canvas.height = 200


  let  ctx = canvas.getContext('2d');
          ctx.clearRect(0,0,300,300)
          ctx.font = "20px creepy";
          ctx.fillStyle = "#6d0606";
          ctx.fillText(newPlayer.health[1] + " / " + newPlayer.health[0] + "HP" ,offset, 15);
          ctx.fillText(newPlayer.attack + "AP",offset, 40);
          ctx.fillText(newPlayer.defense +"DP",offset, 65);
          ctx.fillText(enemyQTY + "Enemies",offset, 90);
          ctx.fillText("Current Level" + newPlayer.level ,offset, 115);
          ctx.fillText(fps ,offset, 140);
          return canvas

}




class Buttons extends React.Component {
    constructor(props){
      super(props);
    };
    handleClick = (button) => {
      console.log(button.target.id)
     this.props.buttonPress(button.target.id)
     };

  render(){
    return(
        <div id="buttonDiv">
         <div id="topRow">
            <button onClick={this.handleClick} id="walkUp">⮝</button>
         </div>
         <div id="bottomRow">
           <button onClick={this.handleClick} id="walkLeft">⮜</button>
           <button onClick={this.handleClick} id="walkDown">⮟</button>
           <button onClick={this.handleClick} id="walkRight">⮞</button>
         </div>
      </div>
    )}
  };

module.exports = {
    GameTitle : GameTitle,
    Buttons : Buttons,
    preDrawShroud : preDrawShroud,
    HUDCanvas : HUDCanvas
};
