import React from "react"
import ReactDOM from "react-dom"
import {Text, Group, Circle} from 'react-konva'; //import from konva-react

const GameTitle = props => {                                        //title
    return <h1 className={"gameTitle"} >DUNGEON CRAWLER!!!!!!</h1>;
};

const HUD = ({wrapperX, wrapperY, playerPosition, enemyArrayLength}) => {  //health, enemy etc on screen display

    return (
      <Group>
              <Text   x={wrapperX}
              y={wrapperY}
              text={playerPosition.health[1] + " / " + playerPosition.health[0] + "HP" }
              fontSize={20}
              fill={"green"} />
              <Text   x={wrapperX}
              y={wrapperY + 30}
              text={playerPosition.attack + " AP"}
              fontSize={20}
              fill={"green"} />
              <Text   x={wrapperX}
              y={wrapperY + 60}
              text={playerPosition.defense + " DP"}
              fontSize={20}
              fill={"green"} />
              <Text   x={wrapperX}
              y={wrapperY + 90}
              text={enemyArrayLength + " Enemies"}
              fontSize={20}
              fill={"red"} />
              <Text   x={wrapperX}
              y={wrapperY + 120}
              text={"Current Level = " + playerPosition.level }
              fontSize={20}
              fill={"green"} />
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
                 }

        render () {

        return (
          <Group>
            <Circle
                 x={this.props.x}
                 y={this.props.y}
                 fillEnabled={false}
                 shadowForStrokeEnabled={false}
                 strokeHitEnabled={false}
                 perfectDrawEnabled={false}
                 strokeWidth={1600}
                 stroke={'black'}
                 radius={this.props.radius}
                 listening={false}
                 ref={node => {this.innerCircle = node;}}
                />
                <Circle
                  x={this.props.x}
                  y={this.props.y}
                  fillEnabled={false}
                  shadowForStrokeEnabled={false}
                  strokeHitEnabled={false}
                  perfectDrawEnabled={false}
                  strokeWidth={1600}
                  stroke={'black'}
                  radius={this.props.radius + 350}
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
