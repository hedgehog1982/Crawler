

import {Layer, Sprite, Rect, Stage, Group} from 'react-konva';
import React from "react"
import ReactDOM from "react-dom"
import {Player} from "./components/player.js"
import {Dungeon} from "./components/dungeon.js"
import {Items} from "./components/items.js"

class EnemyDisplay extends React.Component {
constructor(props) {
  super(props)
}
render () {
  //generate enemy display
  let enemyArray = this.props.enemyArray
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

return (
  <Group>
        {enemyDisplay}
  </Group>


)}
};



class Game extends React.Component {


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

    //generate dungeon
    let rooms = 6
    let dungeonArray = dungeonArray = generateRooms(rooms,maximumX ,maximumY)
    dungeonArray = generateRooms(rooms,maximumX ,maximumY)
    console.log(dungeonArray)

    //place hero
    let inDungeon = false
    let selectedSprite = jake
    let X, Y
    do {
       X = random(0, maximumX)
       Y = random(0, maximumY)
       console.log("generated",X,Y)
       let spriteWidth = selectedSprite.animation.walkUp[3]
       let spriteHeight = selectedSprite.animation.walkUp[2]
      inDungeon = withinDungeon (X, Y, spriteWidth, spriteHeight)

    } while (inDungeon === false)

    //populate dungeon with enemies
    let enemies = 6
    let enemyArray = genEnemyArray (dungeonArray, enemies)

    //populate power-up
    let objects = 3
    let objectArray = genObjectArray(dungeonArray, objects)

    console.log(objectArray)


    this.onClick = this.onClick.bind(this);
      this.state = {
           dungeonArray : dungeonArray,                   // x , y , width, height
            playerPosition : {
            name : "player",
            locationX : X,
            locationY : Y,
            direction : "walkUp",
            sprite : selectedSprite,
            health : [200 , 200],
            attack : 20,
            defense : 10
          },

          enemyArray : enemyArray, // enemyArray,
          objectArray : objectArray
    }
  }

  shouldComponentUpdate(nextProps, nextState) {  //only update if position change whole number
  const differentX = Math.round(this.state.playerPosition.locationX) !== Math.round(nextState.playerPosition.locationX);
  const differentY = Math.round(this.state.playerPosition.locationY) !== Math.round(nextState.playerPosition.locationY);
  const differentDirection = this.state.playerPosition.direction !== nextState.playerPosition.direction;
  const arrayDiff = this.state.enemyArray !== nextState.enemyArray

  return differentX || differentY || differentDirection || arrayDiff;
};

 componentDidMount = () => {  //update positions  50 times a second
      this.interval = setInterval(this.updateAllPosition, 20);
  };

  componentWillUnmount = () => {
    clearInterval(this.interval);
  };

  componentWillMount = () => {  //if its mounted listen for key presses
    document.addEventListener("keydown", this.handleKeyPress)
    //this.setState({

    //})
    };

  updateAllPosition = () => {  //update position --- needs speeding up
    let currentTime = new Date().getTime();
    let timeDiff = currentTime - lastUpdate;
  //  console.log(Math.round(1000 /  (timeDiff)), "FPS")

  //make duplicate of arrays so not altering directly
  let joinedArray = JSON.parse(JSON.stringify(this.state.enemyArray))
  let playerCopy = JSON.parse(JSON.stringify(this.state.playerPosition))
  let itemArrayCopy = JSON.parse(JSON.stringify(this.state.objectArray))

    //check if in dungeon or touching enemy

    joinedArray.push(playerCopy)
    for(let person = 0; person < joinedArray.length ; person++){
          updatePos(joinedArray, person ,timeDiff)
    }

    //update scroll position
    let newPlayer = joinedArray.pop()
    let wrapper = document.getElementById("wrapper")
          wrapper.scrollTop = Math.round(newPlayer.locationY - viewport.height /2);  //round to smooth movement?
          wrapper.scrollLeft = Math.round(newPlayer.locationX - viewport.width / 2);

    //remove dead players (eventually check player is dead?)
    let cleanedArray = []
    joinedArray.map((enemy) => {

        if (enemy.health[0] !== 0){
          cleanedArray.push(enemy)
        }

    })

    //check if touching items
      let cleanedItem = touchingItems(newPlayer, itemArrayCopy)

      this.setState({
       playerPosition : newPlayer,
       enemyArray : cleanedArray,
       objectArray : cleanedItem
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

  componentDidUpdate(oldProps, oldState) {

};


  render() {

    let wrapperStyle ={ width : viewport.width + "px",
                        height: viewport.height + "px",
                        overflow : "hidden"
                        }


       let won = null
       if (this.state.enemyArray.length === 0 && this.state.playerPosition.health[0] !==0){
         won = (
           <div>
              WON!
           </div>
         )
       } else if (this.state.playerPosition.health[0] === 0){
         won = (
           <div>
              LOST!
           </div>
         )
       } else {
         won =
           <Stage className={"wrapper"} width={maximumX} height={maximumY} >
               <Layer>
               <Dungeon dungeonArray={this.state.dungeonArray} />
               <Items items={this.state.objectArray} />
               <Player
                         playerGraphics={this.state.playerPosition.sprite}
                         positionX={Math.round(this.state.playerPosition.locationX)}
                         positionY={Math.round(this.state.playerPosition.locationY)}
                         direction={this.state.playerPosition.direction}
                         health={this.state.playerPosition.health}
                 />
               <EnemyDisplay enemyArray={this.state.enemyArray} />

             </Layer>
           </Stage>

       }

      return (
        <div>
        <h2> DUNGEON CRAWLER </h2>
         <div id={"wrapper"} className={"wrapper"} style={wrapperStyle} >
          {won}
        </div>
        <div>
          <h6>Enemies Alive  is {this.state.enemyArray.length}</h6>
          <h6>Attack is {this.state.playerPosition.attack} </h6>
          <h6>Defence is {this.state.playerPosition.defense}</h6>
          <h6>Health is {this.state.playerPosition.health[1]} / {this.state.playerPosition.health[0]} </h6>


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

class App extends React.Component { //ready for cache
  constructor (props){
    super(props)
    this.state = {

        loadedImages : 0,
        amountToLoad : 4
    }

  }
  // cache all images in arrays (do in one pass)
  componentDidMount = () => {

    //Same thing three times !!!! needs to be a function!!!!!!!!!!!

    let dungeonFloorArray = new Array(dungeonFloorImages.length)
  generateImage (dungeonFloorArray, dungeonFloorImages ).then(() => {
    let loadedImages = this.state.loadedImages + 1;
    console.log("Downloaded dungeon floor array",loadedImages)
    this.setState({
         loadedImages : loadedImages
    })
    console.log()
  });

  let dungeonWallArray = new Array(dungeonWallImages.length)
generateImage (dungeonWallArray, dungeonWallImages ).then(() => {
  let loadedImages = this.state.loadedImages + 1;
    console.log("Downloaded dungeon Wall array",loadedImages)
  this.setState({
       loadedImages : loadedImages
  })
});

let dungeonLavaArray = new Array(dungeonLavaImages.length)
generateImage (dungeonLavaArray, dungeonLavaImages ).then(() => {
let loadedImages = this.state.loadedImages + 1;
console.log("Downloaded dungeon Lava array",loadedImages)
this.setState({
     loadedImages : loadedImages
})
});







};

  render() {
    return(
      <Game />
    )}
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
