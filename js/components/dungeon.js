import {Layer, Rect, Stage, Group} from 'react-konva';
import React from "react"
import ReactDOM from "react-dom"

class Dungeon extends React.Component {
    constructor(props){
        super(props)
    };

    componentDidMount = () => {
        this.layer.cache()
    };

   shouldComponentUpdate(nextProps, nextState) {  //Math.round(
    const differentDungeon= this.props.dungeonArray.length !== nextProps.dungeonArray.length;
    return differentDungeon
  };

  componentDidUpdate(oldProps) {
   }

render() {
    let dungeonArray = this.props.dungeonArray;
    let dungeonRender = []  //array to hold dungeon generation

       console.log("renderingDungeon")

    for (let x = 0; x < dungeonArray.length ; x++) {  // check X position from room X pos for whole of width
      for (let y = 0; y < dungeonArray[0].length ; y++) {  // check X position from room X pos for whole of width
        if (dungeonArray[x][y] === "R" || dungeonArray[x][y] === "C" ){  //dungeon room
          dungeonRender.push( <DungeonFloor key={"Dungeon" + x + " " + y}
                    x={x * tileSize}
                    y={y * tileSize}
                    width={tileSize}
                    height={tileSize}
                    dungeonFloorArray={this.props.dungeonFloorArray}
                    hitGraphEnabled={false}
                    listening={false}
                    /> )
        } else if ((dungeonArray[x][y] === "W")) {
          dungeonRender.push( <DungeonWall key={"Dungeon" + x + " " + y}
                    x={x * tileSize}
                    y={y * tileSize}
                    width={tileSize}
                    height={tileSize}
                    dungeonWallArray={this.props.dungeonWallArray}
                    hitGraphEnabled={false}
                    listening={false}
                    /> )

        } else {
          dungeonRender.push( <DungeonLava key={"Dungeon" + x + " " + y}
                    x={x * tileSize}
                    y={y * tileSize}
                    width={tileSize}
                    height={tileSize}
                    dungeonLavaArray={this.props.dungeonLavaArray}
                    hitGraphEnabled={false}
                    listening={false}
                    /> )

        }
      }
    }


    return(
      <Group        ref={node => {this.layer = node;}}>
      {dungeonRender}
    </Group>
    )};
  };

  class DungeonFloor extends React.Component {
        constructor(props){
            super(props)
        };

        componentDidUpdate(oldProps) {
          if (!oldProps && this.props) {
              this.refs.floor.cache();
              }
         }

    render() {
        let fillImage= this.props.dungeonFloorArray[random(0, this.props.dungeonFloorArray.length - 1)]

        return(
          <Rect
          x={this.props.x}
          y={this.props.y}
          width={this.props.width}
          height={this.props.height}
          hitGraphEnabled={false}
          fillPatternImage={fillImage}
          ref="floor"
          />
        )}
      };

      class DungeonWall extends React.Component {
            constructor(props){
                super(props)
            };

        render() {
              let fillImage= this.props.dungeonWallArray[random(0, this.props.dungeonWallArray.length - 1)]
            return(
              <Rect
              x={this.props.x}
              y={this.props.y}
              width={this.props.width}
              height={this.props.height}
              hitGraphEnabled={false}
              fillPatternImage={fillImage}
              ref="wall"
              />
            )}
          };

          class DungeonLava extends React.Component {
                constructor(props){
                    super(props)
                };

            render() {
                  let fillImage= this.props.dungeonLavaArray[random(0, this.props.dungeonLavaArray.length - 1)]
                return(
                  <Rect
                  x={this.props.x}
                  y={this.props.y}
                  width={this.props.width}
                  height={this.props.height}
                  hitGraphEnabled={false}
                  fillPatternImage={fillImage}
                  ref="lava"
                  />
                )}
              };

module.exports = {
    Dungeon: Dungeon,
    DungeonFloor : DungeonFloor
}
