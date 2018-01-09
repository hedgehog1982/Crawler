

import {Layer, Sprite, Rect, Stage, Group, Circle, Text} from 'react-konva';
import React from "react"
import ReactDOM from "react-dom"
import {Player} from "./components/player.js"
import {Dungeon} from "./components/dungeon.js"
import {Items} from "./components/items.js"
import {Won, Lost} from "./components/endScreens.js"

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
    let enemies = 4
    let enemyArray = genEnemyArray (dungeonArray, enemies)

    //populate power-up
    let objects = 3
    let objectArray = genObjectArray(dungeonArray, objects)

    console.log(objectArray)
    let blankArray = []


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
          objectArray : objectArray,
          graveArray : blankArray
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
      let wrapper = document.getElementById("wrapper")
            wrapper.scrollTop = Math.round(this.state.playerPosition.locationY - viewport.height /2);  //round to smooth movement?
            wrapper.scrollLeft = Math.round(this.state.playerPosition.locationX - viewport.width / 2);

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
    let graveArrayCopy = JSON.parse(JSON.stringify(this.state.graveArray))
    joinedArray.map((enemy) => {

        if (enemy.health[0] !== 0){ //if its alive add it back to array
          cleanedArray.push(enemy)
        } else {  //if its dead add its location to graveArray
          graveArrayCopy.push({
            name : "grave" + enemy.name,
            locationX : Math.round(enemy.locationX),
            locationY : Math.round(enemy.locationY),
            img : graveObject[0]
          })
        }

    })

    //check if touching items
      let cleanedItem = touchingItems(newPlayer, itemArrayCopy)

      this.setState({
       playerPosition : newPlayer,
       enemyArray : cleanedArray,
       objectArray : cleanedItem,
       graveArray : graveArrayCopy
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
         let wrapper = document.getElementById("wrapper")
               wrapper.scrollTop = 0  //round to smooth movement?
               wrapper.scrollLeft = 0
         won = (
            <Won />
         )
       } else if (this.state.playerPosition.health[0] === 0){
         let wrapper = document.getElementById("wrapper")
               wrapper.scrollTop = 0  //round to smooth movement?
               wrapper.scrollLeft = 0
         won = (
           <Lost />
         )
       } else {
         won =
          <Group>
             <Dungeon dungeonArray={this.state.dungeonArray}
                      dungeonFloorArray={this.props.dungeonFloorArray}
               />
             <Items items={this.state.graveArray} />
             <Items items={this.state.objectArray} />
             <Player
                       playerGraphics={this.state.playerPosition.sprite}
                       positionX={Math.round(this.state.playerPosition.locationX)}
                       positionY={Math.round(this.state.playerPosition.locationY)}
                       direction={this.state.playerPosition.direction}
                       health={this.state.playerPosition.health}
               />
             <EnemyDisplay enemyArray={this.state.enemyArray} />
               <Circle
                 x={Math.round(this.state.playerPosition.locationX)}
                 y={Math.round(this.state.playerPosition.locationY)}
                 fillEnabled={false}
                 strokeWidth={1600}
                 stroke={'black'}
                 radius={150}
                />
                <Circle
                  x={Math.round(this.state.playerPosition.locationX)}
                  y={Math.round(this.state.playerPosition.locationY)}
                  fillEnabled={false}
                  strokeWidth={1600}
                  stroke={'black'}
                  radius={500}
                 />
              </Group>
       }

      return (
        <div>
        <h2> DUNGEON CRAWLER </h2>
          <div id={"wrapper"} className={"wrapper"} style={wrapperStyle} >
            <Stage className={"wrapper"} width={maximumX} height={maximumY} >
                <Layer>
            {won}
          </Layer>
        </Stage>
        </div>
        <div>
          <h6>Enemies Alive are {this.state.enemyArray.length}</h6>
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

    if (window.innerWidth > window.innerHeight){
      viewport.width = window.innerWidth <= 1200 ? window.innerWidth -40 : 800
      viewport.height = window.innerHeight <= 1200 ? window.innerHeight -200: 100
    } else {
      viewport.width = 400
      viewport.height = 600
    }

    //set arrays up for cached image arrays using src paths from variables in spritevariables.js
      let dungeonFloorArray = new Array(dungeonFloorImages.length)
      let dungeonWallArray = new Array(dungeonWallImages.length)
      let dungeonLavaArray = new Array(dungeonLavaImages.length)

    this.state = {
        loadedImages : 0,
        amountToLoad : 3,
        dungeonFloorArray : dungeonFloorArray,
        dungeonWallArray : dungeonWallArray,
        dungeonLavaArray : dungeonLavaArray
    }

  }

componentDidMount = () => {

    // cache all images in arrays (do in one pass)
    //store values in setState to allow them to be used when generating images

  //Same thing three times !!!! needs to be a function!!!!!!!!!!!

  let dungeonFloorArray =this.state.dungeonFloorArray
  generateImage(dungeonFloorArray, dungeonFloorImages).then((filledArray) => {
    let loadedImages = this.state.loadedImages + 1;
    console.log("Downloaded dungeon floor array", loadedImages)
    console.log(filledArray)
    this.setState({loadedImages: loadedImages,
                   dungeonFloorArray : filledArray
      })
  });

  let dungeonWallArray = this.state.dungeonWallArray
  generateImage(dungeonWallArray, dungeonWallImages).then((filledArray) => {
    let loadedImages = this.state.loadedImages + 1;
    console.log("Downloaded dungeon Wall array", loadedImages)
    this.setState({loadedImages: loadedImages,
                   dungeonWallArray : filledArray
    })
  });

  let dungeonLavaArray = this.state.dungeonLavaArray
  generateImage(dungeonLavaArray, dungeonLavaImages).then((filledArray) => {
    let loadedImages = this.state.loadedImages + 1;
    console.log("Downloaded dungeon Lava array", loadedImages)
    this.setState({loadedImages: loadedImages,
                  dungeonLavaArray : filledArray
    })
  });

};

  render() {

    let wrapperStyle ={ width : viewport.width + "px",
                        height: viewport.height + "px",
                        overflow : "hidden"
                        }

     // render load screen if finished render game
         let toRender
    if (this.state.amountToLoad === this.state.loadedImages){
      toRender = ( <Game
                      dungeonFloorArray={this.state.dungeonFloorArray}
                  />)
    } else {
      toRender = (
        <div>
          <h1>LOADING CONTENT</h1>
          <h1>LOADED</h1>
          <h1>{this.state.loadedImages} of {this.state.amountToLoad }</h1>
        </div>
      )

    }


    return(
      <div>
          {toRender}
      </div>
    )}
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
