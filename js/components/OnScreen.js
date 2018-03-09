import React from "react"
import ReactDOM from "react-dom"
import {Text, Group, Circle} from 'react-konva'; //import from konva-react

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

module.exports = {
    GameTitle : GameTitle,

    preDrawShroud : preDrawShroud
};
