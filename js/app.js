

import {Layer, Sprite, Rect, Stage, Group} from 'react-konva';
import React from "react"
import ReactDOM from "react-dom"
import {Player} from "./components/player.js"
import {Dungeon} from "./components/dungeon.js"



class App extends React.Component {


  constructor(props) {
    super(props);

    if (window.innerWidth > window.innerHeight){
      viewport.width = window.innerWidth <= 1200 ? window.innerWidth -40 : 1200
      viewport.height = window.innerHeight <= 1200 ? window.innerHeight -200: 100
    } else {
      viewport.width = 400
      viewport.height = 600
    }

    lastUpdate = new Date().getTime()

    let rooms = 6
    let dungeonArray = []
    do {
       dungeonArray = []
       dungeonArray = generateRooms(rooms,1280 ,1280)  // 32 x 40 tile grid =1280 grid
    } while (corrupted === true)

    let enemyArray = genEnemyArray (dungeonArray)
    this.onClick = this.onClick.bind(this);

    this.state = {
          dungeonArray : dungeonArray,                   // x , y , width, height
          playerPosition : {
            name : "player",
            locationX : dungeonArray[0].x + dungeonArray[0].width /2,
            locationY : dungeonArray[0].y + dungeonArray[0].height /2,
            direction : "walkUp",
            sprite : jake,
            health : [200 , 200]
          },
          enemyArray : enemyArray
    }
  }

  shouldComponentUpdate(nextProps, nextState) {  //Math.round(
  const differentX = Math.round(this.state.playerPosition.locationX) !== Math.round(nextState.playerPosition.locationX);
  const differentY = Math.round(this.state.playerPosition.locationY) !== Math.round(nextState.playerPosition.locationY);
  const differentDirection = this.state.playerPosition.direction !== nextState.playerPosition.direction;
  const arrayDiff = this.state.enemyArray !== nextState.enemyArray

  return differentX || differentY || differentDirection || arrayDiff;
};

  componentDidMount = () => {  //update position  50 times a second
      this.interval = setInterval(this.updateAllPosition, 20);
  };

  componentWillUnmount = () => {
    clearInterval(this.interval);
  };

  componentWillMount = () => {  //if its mounted listen for key presses
    document.addEventListener("keydown", this.handleKeyPress)
    this.setState({

    })
  };

  updateAllPosition = () => {  //update position --- needs speeding up
    let currentTime = new Date().getTime();
    let timeDiff = currentTime - lastUpdate;
    console.log(Math.round(1000 /  (timeDiff)), "FPS")

    //check if in dungeon or touching enemy
    let joinedArray = JSON.parse(JSON.stringify(this.state.enemyArray))
    let playerCopy = JSON.parse(JSON.stringify(this.state.playerPosition))
    joinedArray.push(playerCopy)
    for(let person = 0; person < joinedArray.length ; person++){
          updatePos(joinedArray, person ,timeDiff)
    }

    //update scroll position
    let newPlayer = joinedArray.pop()
    wrapper.scrollTop = newPlayer.locationY - viewport.height /2;
    wrapper.scrollLeft = newPlayer.locationX - viewport.width / 2;

    //remove dead players (eventually check player is dead?)
    let cleanedArray = []
    joinedArray.map((enemy) => {

        if (enemy.health[0] !== 0){
          cleanedArray.push(enemy)
        }

    })

      this.setState({
       playerPosition : newPlayer,
       enemyArray : cleanedArray

      })
      lastUpdate = currentTime

  };

  handleKeyPress = (event) => {  //handle direction
        let playerCopy = JSON.parse(JSON.stringify(this.state.playerPosition))
      if (event.key == "ArrowLeft" ) {
        console.log("walking Left")
        playerCopy.direction = "walkLeft"
      } else if  (event.key == "ArrowRight") {
        console.log("you have right")
          playerCopy.direction = "walkRight"
      //  this.setState({direction : "walkRight"})
      } else if  (event.key == "ArrowUp") {
            playerCopy.direction = "walkUp"
        console.log("you have up")
      } else if  (event.key == "ArrowDown") {
        console.log("you have down")
        playerCopy.direction = "walkDown"
      } else {
        console.log("not pressed direction key, assume old key ")
        playerCopy.direction = playerPosition.direction
      }

       this.setState({
            playerPosition : playerCopy
       })
  };

  onClick = (e) => {
    let playerCopy = JSON.parse(JSON.stringify(this.state.playerPosition))
    playerCopy.direction = e.target.id

    this.setState({
      playerPosition : playerCopy
    })
  };


  render() {
    let enemyArray = this.state.enemyArray
    let wrapperStyle ={ width : viewport.width + "px",
                        height: viewport.height + "px",
                        overflow : "hidden"
                        }

  let img = document.createElement('img'); // use DOM HTMLImageElement
      img.src = 'sprite/lava.jpg';
      enemyDisplay =[]
  let enemyDisplay = enemyArray.map((enemy , key) => {

         return(

           <Player key={"Enemy" + key}
               playerGraphics={enemy.sprite}
               positionX ={Math.round(enemy.locationX)}
               positionY={Math.round(enemy.locationY)}
               direction={enemy.direction}
               health={enemy.health}
           />

       )
       });
       //style={wrapperStyle}
    return (
      <div>
      <h2> DUNGEON CRAWLER </h2>
       <div id={"wrapper"} className={"wrapper"}   >
      <Stage width={1800} height={1800} >
        <Layer hitGraphEnabled={false} >
          <Rect x={0} y={0} width={1800} height={1800} hitGraphEnabled={false} fillPatternImage={img} />
          <Dungeon dungeonArray={this.state.dungeonArray} />
        </Layer>
        <Layer>
          <Player
                  playerGraphics={this.state.playerPosition.sprite}
                  positionX={Math.round(this.state.playerPosition.locationX)}
                  positionY={Math.round(this.state.playerPosition.locationY)}
                  direction={this.state.playerPosition.direction}
                  health={this.state.playerPosition.health}
          />
        {enemyDisplay}
        </Layer>
      </Stage>
      </div>
      <div>
                <button onClick={this.onClick} id="walkUp">UP</button>
                 <button onClick={this.onClick} id="walkDown">DOWN</button>
                 <button onClick={this.onClick} id="walkLeft">LEFT</button>
                 <button onClick={this.onClick} id="walkRight">RIGHT</button>


      </div>
    </div>


  )}

};

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
