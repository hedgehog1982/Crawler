import React from "react"
import ReactDOM from "react-dom"
import {Text, Group, Circle} from 'react-konva'; //import from konva-react

const GameTitle = props => {                                        //title
    return <div className={"gameTitle"}><h1 className={"moveRight"} >DUNGEON </h1><h1 className={"moveLeft"}> CRAWLER!!!!!!</h1></div>;
};

const HUD = ({wrapperX, wrapperY, playerPosition, enemyArrayLength, viewport}) => {  //health, enemy etc on screen display
    if (wrapperX < 100){
        console.log(viewport)
    }
    return (
      <Group>
              <Text   x={wrapperX}
                      y={wrapperY}
                      text={playerPosition.health[1] + " / " + playerPosition.health[0] + "HP" }
                      fontFamily={"Creepy"}
                      fontSize={20}
                      fill={"#6d0606"}
              />
              <Text   x={wrapperX}
                      y={wrapperY + 30}
                      text={playerPosition.attack + " AP"}
                      fontSize={20}
                      fontFamily={"Creepy"}
                      fill={"#6d0606"} />
              <Text   x={wrapperX}
                      y={wrapperY + 60}
                      text={playerPosition.defense + " DP"}
                      fontSize={20}
                      fontFamily={"Creepy"}
                      fill={"#6d0606"} />
              <Text   x={wrapperX}
                      y={wrapperY + 90}
                      text={enemyArrayLength + " Enemies"}
                      fontSize={20}
                      fontFamily={"Creepy"}
                      fill={"#6d0606"} />
              <Text   x={wrapperX}
                      y={wrapperY + 120}
                      text={"Current Level = " + playerPosition.level }
                      fontFamily={"Creepy"}
                      fontSize={20}
                      fill={"#6d0606"} />
        </Group >
            )
        };

      class Shroud extends React.Component {  //shroud to cover field of view. 2 big circles with thick lines. seems to do the trick
      constructor(props) {
        super(props)
      }

        componentDidMount = () => {  //update positions  50 times a second
                   this.innerCircle.cache(); //cache two circles for speedups? hopefully works
                   this.outerCircle.cache();
                //   this.outerouterCircle.cache();
                 }

        render () {
          let {x, y, radius} = this.props

        return (
          <Group>
            <Circle  x={x}
                     y={y}
                     fillEnabled={false}
                     shadowForStrokeEnabled={false}
                     strokeHitEnabled={false}
                     perfectDrawEnabled={false}
                     strokeWidth={1600}
                     stroke={'black'}
                     radius={radius}
                     listening={false}
                     ref={node => {this.innerCircle = node;}}
                     />
            <Circle   x={x}
                      y={y}
                      fillEnabled={false}
                      shadowForStrokeEnabled={false}
                      strokeHitEnabled={false}
                      perfectDrawEnabled={false}
                      strokeWidth={1600}
                      stroke={'black'}
                      radius={radius + 350}
                      listening={false}
                      ref={node => {this.outerCircle = node;}}
                      />

          </Group>

        )}
        };


module.exports = {
    GameTitle : GameTitle,
    HUD : HUD,
    Shroud : Shroud
};
