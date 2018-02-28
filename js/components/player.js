import {Layer, Rect, Sprite, Stage, Group} from 'react-konva';
import React from "react"
import ReactDOM from "react-dom"

class Player extends React.Component {
    constructor(props){
      super(props);
    };

    componentDidMount = () => {   //cant cache. need to load at start?
        //this.layer.cache()  //does not work with sprites!!!!!
    };

    shouldComponentUpdate(nextProps, nextState) {  //should only update if moved fully pixel, need to round
    const differentX = this.props.positionX !== nextProps.positionX;
    const differentY = this.props.positionY !== nextProps.positionY;
    const differentDirection = this.props.direction !== nextProps.direction;
    const differentHealth = this.props.health[0] !== nextProps.health[0]

    return differentX || differentY || differentDirection || differentHealth
  };

    componentWillMount = () => {

    };

    render(){
      let playerGraphics = this.props.playerGraphics
      console.log(this.props)
      let img = document.createElement('img'); // use DOM HTMLImageElement
          img.src = playerGraphics.src;   //
        let rectWidth = (playerGraphics.animation[this.props.direction][2]) + 4         //width of animation + 2 pixels either side  /this is for energy bar
        let percentage =  this.props.health[0] / this.props.health[1]   //percentage of health left
        let healthWidth = Math.round(rectWidth * percentage)

        //two rectangles are for health bar. sprite is the sprite  // node running is to start the animation
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
            shadowForStrokeEnabled={false}
            strokeHitEnabled={false}
            perfectDrawEnabled={false}
            listening={false}
            />
            <Rect
              x={this.props.positionX -2 }
              y={this.props.positionY - 7}
              width={healthWidth}
              height={5}
              fill={"green"}
              shadowForStrokeEnabled={false}
              strokeHitEnabled={false}
              perfectDrawEnabled={false}
              listening={false}

              />
          <Sprite image={img} x={this.props.positionX} y={this.props.positionY}
             animations={this.props.playerGraphics.animation}
             animation={this.props.direction}
             frameRate={playerGraphics.frameRate}
             ref={(node => {
               if(node && !node.isRunning()) node.start(); this.layer = node;})}  //to start animation
             perfectDrawEnabled={false}
            listening={false}
             />
           </Group>

      )}
};

class EnemyDisplay extends React.Component {  //splits enemy array into react component
constructor(props) {
  super(props)
}
render () {
  //generate enemy display
  let enemyArray = this.props.enemyArray
   enemyDisplay =[]   //for passing into render         // need to only render enemies that are below visible area. should speed it uo
   let enemyDisplay = enemyArray.map((enemy , key) => {

       return(
         <Player key={"Enemy" + key}
             playerGraphics={enemy.sprite}
             positionX ={enemy.locationX}
             positionY={enemy.locationY}
             direction={enemy.direction}
             health={enemy.health}
         />
     )
     });

return (
  <Group>
        {enemyDisplay}
  </Group>
)}
};

module.exports = {
    Player: Player,
    EnemyDisplay : EnemyDisplay


}
