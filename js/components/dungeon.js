import {Layer, Rect, Stage, Group} from 'react-konva';
import React from "react"
import ReactDOM from "react-dom"

class Dungeon extends React.Component {
    constructor(props){
        super(props)
    };

    componentDidMount = () => {
        this.interval = setTimeout(() => {this.layer.cache()}, 500);

    };

    shouldComponentUpdate(nextProps, nextState) {  //Math.round(
    const differentDungeon= this.props.dungeonArray !== nextProps.dungeonArray;


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
        if (dungeonArray[x][y] === "R"){  //dungeon room
          dungeonRender.push( <DungeonFloor key={"Dungeon" + x + " " + y}
                    x={x * tileSize}
                    y={y * tileSize}
                    width={tileSize}
                    height={tileSize}
                    hitGraphEnabled={false}
                    /> )
        } else if ((dungeonArray[x][y] === "W")) {
          dungeonRender.push( <DungeonWall key={"Dungeon" + x + " " + y}
                    x={x * tileSize}
                    y={y * tileSize}
                    width={tileSize}
                    height={tileSize}
                    hitGraphEnabled={false}
                    /> )

        }else if ((dungeonArray[x][y] === "C")) {
          dungeonRender.push( <DungeonFloor key={"Dungeon" + x + " " + y}
                    x={x * tileSize}
                    y={y * tileSize}
                    width={tileSize}
                    height={tileSize}
                    hitGraphEnabled={false}
                    /> )

        } else {
          dungeonRender.push( <DungeonLava key={"Dungeon" + x + " " + y}
                    x={x * tileSize}
                    y={y * tileSize}
                    width={tileSize}
                    height={tileSize}
                    hitGraphEnabled={false}
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

        return(
          <Rect
          x={this.props.x}
          y={this.props.y}
          width={this.props.width}
          height={this.props.height}
          hitGraphEnabled={false}
          fillPatternImage={dungeonSprite[random(0,dungeonSprite.length - 1)]}
          ref="floor"
          />
        )}
      };

      class DungeonWall extends React.Component {
            constructor(props){
                super(props)
            };

        render() {

            return(
              <Rect
              x={this.props.x}
              y={this.props.y}
              width={this.props.width}
              height={this.props.height}
              hitGraphEnabled={false}
              fillPatternImage={dungeonWall[random(0,dungeonWall.length - 1)]}
              ref="wall"
              />
            )}
          };

          class DungeonLava extends React.Component {
                constructor(props){
                    super(props)
                };



            render() {
            //  let img = document.createElement('img'); // use DOM HTMLImageElement
            //    img.src = dungeonLava[random(0,dungeonLava.length - 1)]
                return(
                  <Rect
                  x={this.props.x}
                  y={this.props.y}
                  width={this.props.width}
                  height={this.props.height}
                  hitGraphEnabled={false}
                  fillPatternImage={dungeonLava[random(0,dungeonLava.length - 1)]}
                  ref="lava"
                  />
                )}
              };

module.exports = {
    Dungeon: Dungeon,
    DungeonFloor : DungeonFloor
}
