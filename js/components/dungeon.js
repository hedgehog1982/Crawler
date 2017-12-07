import {Layer, Rect, Stage, Group} from 'react-konva';
import React from "react"
import ReactDOM from "react-dom"

class Dungeon extends React.Component {
    constructor(props){
        super(props)
    };

    componentDidMount = () => {
    };

    shouldComponentUpdate(nextProps, nextState) {  //Math.round(
    const differentDungeon= this.props.dungeonArray !== nextProps.dungeonArray;


    return differentDungeon
  };

render() {
    let dungeonArray = this.props.dungeonArray;
    let dungeonRender = dungeonArray.map((dungeon, index) => {
     return (<Dungeons key={"Dungeon" + index} dungeonArray={dungeon} />);
      });
               console.log("renderingDungeonArray") 

    return(
      <Group>
      {dungeonRender}
      </Group>
    )};
  };

  class Dungeons extends React.Component {
        constructor(props){
            super(props)
        };

        componentDidMount = () => {
        };

    render() {
      let img = document.createElement('img'); // use DOM HTMLImageElement
         img.src = 'sprite/dungeon.jpg';
         console.log("renderingDungeon")
        return(
          <Rect
          x={this.props.dungeonArray.x}
          y={this.props.dungeonArray.y}
          width={this.props.dungeonArray.width}
          height={this.props.dungeonArray.height}
          hitGraphEnabled={false}
          fillPatternImage={img}
          />
        )}
      };

module.exports = {
    Dungeon: Dungeon,
    Dungeons : Dungeons
}
