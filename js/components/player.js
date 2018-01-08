import {Layer, Rect, Sprite, Stage, Group} from 'react-konva';
import React from "react"
import ReactDOM from "react-dom"

class Player extends React.Component {
    constructor(props){
      super(props);
    };

    shouldComponentUpdate(nextProps, nextState) {  //Math.round(
    const differentX = this.props.positionX !== nextProps.positionX;
    const differentY = this.props.positionY !== nextProps.positionY;
    const differentDirection = this.props.direction !== nextProps.direction;
    const differentHealth = this.props.health[0] !== nextProps.health[0]

    return differentX || differentY || differentDirection || differentHealth
  };

    componentWillMount = () => {  //if its mounted listen for key presses

      console.log("jake is ", this.props.positionX, this.props.positionY)
    };

    render(){
      let playerGraphics = this.props.playerGraphics
      let img = document.createElement('img'); // use DOM HTMLImageElement
          img.src = playerGraphics.src;
        let rectWidth = (playerGraphics.animation[this.props.direction][2]) + 4         //width of animation + 2 pixels either side
        let percentage =  this.props.health[0] / this.props.health[1]
        let healthWidth = Math.round(rectWidth * percentage)

        return (
          <Group>
          <Rect
            x={this.props.positionX -2 }
            y={this.props.positionY - 7}
            width={rectWidth}
            height={5}
            strokeWidth={1}
            stroke={"black"}
            fill={"white"}
            hitGraphEnabled={false}
            />
            <Rect
              x={this.props.positionX -2 }
              y={this.props.positionY - 7}
              width={healthWidth}
              height={5}
              fill={"green"}
              hitGraphEnabled={false}

              />
          <Sprite image={img} x={this.props.positionX} y={this.props.positionY}
             animations={this.props.playerGraphics.animation}
             animation={this.props.direction}
             frameRate={playerGraphics.frameRate}
             ref={(node => {if(node && !node.isRunning()) node.start()})}  //to start animation
             hitGraphEnabled={false}
             />
           </Group>

      )}
};



module.exports = {
    Player: Player


}
