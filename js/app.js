import {Layer, Sprite, Rect, Stage, Group, Circle, Text} from 'react-konva'; //import from konva-react
import React from "react"
import ReactDOM from "react-dom"
import {Player} from "./components/player.js"  //react component that handles player and enemy sprites
import {Dungeon} from "./components/dungeon.js" // react component that hand dungeon images (Lava, floor and Wall)
import {Items} from "./components/items.js"  //react component that handles health items and eventually weapons
import {Won, Lost, LoadScreen} from "./components/screens.js" // react component for win / loss / loading screen
import {GameTitle, HUD, Shroud} from "./components/onScreen.js" //react component - title screen , HUD and shroud


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




class Game extends React.Component {


  constructor(props) {
    super(props);

    lastUpdate = new Date().getTime()  //last update for working out distance travelled

    //generate dungeon
    let rooms = 6                               //amount of rooms to generate
    let dungeonArray = []
    dungeonArray = generateRooms(rooms,maximumX ,maximumY)  // maximumX and maximumY are a global variable, not sure thats the right thing to do... definitly no need to pass it if it is

    //place hero within dungeon
    let inDungeon = false
    let selectedSprite = jake     //contains sprite map
    selectedSprite.src = this.props.spriteArray[0].src  //pass the loaded source in
    let X, Y
    do {
       X = random(0, maximumX)                //generate random X and Y
       Y = random(0, maximumY)
       let spriteWidth = selectedSprite.animation.walkUp[3]         //widest sprite points
       let spriteHeight = selectedSprite.animation.walkUp[2]
      inDungeon = withinDungeon (X, Y, spriteWidth, spriteHeight)

    } while (inDungeon === false)

    //populate dungeon with enemies
    let playerLocation = {X : X, Y : Y}
    let enemies = 12                                         //hardcoded amount of enemies, would like this accesible ( many levels, more enemies per level?)
    let enemyArray = genEnemyArray (dungeonArray, enemies, this.props.spriteArray, playerLocation)    // pass the src in for cinn, this way its been cached, at the minute this can be placed next to hero, dont want that

    //populate power-up                                         //eventually want to add weapons and armour. function allows this
    let objects = 6
    let objectArray = genObjectArray(dungeonArray, objects, this.props.itemArray)

    let blankGraveArray = []        //doing this here rather than in setstate as eventually want to pull everything out as function (Allow easy set up on new game / new level)


    this.onClick = this.onClick.bind(this);
      this.state = {
           radius : 150,
           dungeonArray : dungeonArray,                   // x , y , width, height
            playerPosition : {
            name : "player",
            locationX : X,
            locationY : Y,
            direction : "walkUp",
            sprite : selectedSprite,
            health : [200 , 200],
            attack : 20,
            defense : 10,
            level : 1
          },

          enemyArray : enemyArray, // enemyArray,
          objectArray : objectArray,
          graveArray : blankGraveArray
    }
  }


 componentDidMount = () => {  //update positions  50 times a second
      this.interval = setInterval(this.updateAllPosition, 20);  //update positions at 50fps (unlikely to happen at this speed)  //

      let wrapper = document.getElementById("wrapper")      //move wrapper above plater
            wrapper.scrollTop = Math.round(this.state.playerPosition.locationY - viewport.height /2);  //round to smooth movement?
            wrapper.scrollLeft = Math.round(this.state.playerPosition.locationX - viewport.width / 2);

  };

  componentWillUnmount = () => {
    clearInterval(this.interval);         //when we unmount clear the function that updates the positions
  };

  componentWillMount = () => {  //if its mounted listen for key presses
    document.addEventListener("keydown", this.handleKeyPress)
    };


  updateAllPosition = () => {  //update position --- needs speeding up
    let currentTime = new Date().getTime();
    let timeDiff = currentTime - lastUpdate;
    //console.log(Math.round(1000 /  (timeDiff)), "FPS")

  //make duplicate of arrays so not altering directly
  let joinedArray = JSON.parse(JSON.stringify(this.state.enemyArray))
  let playerCopy = JSON.parse(JSON.stringify(this.state.playerPosition))
  let itemArrayCopy = JSON.parse(JSON.stringify(this.state.objectArray))
  let updated = 0     //keep track of the amount of updates

    //check if in dungeon or touching enemy
    joinedArray.push(playerCopy)    // make an array that is a combined enemy/ hero array

    let minBoundary = 50; //stop players on the edge of the boundary just popping into existence
    //only check movement of things that have move within player view
    let minimumX = this.state.playerPosition.locationX - minBoundary - (2 * this.state.radius)
    let maximumX = this.state.playerPosition.locationX + minBoundary + (2 * this.state.radius)
    let minimumY = this.state.playerPosition.locationY - minBoundary - (2 * this.state.radius)
    let maximumY = this.state.playerPosition.locationY + minBoundary + (2 * this.state.radius)


    for(let person = 0; person < joinedArray.length ; person++){      // pass into my function to work out distances moved
      //an ideal place to check if within viewport, if its not then no point updating
      let personPosition = joinedArray[person]
      if ((personPosition.locationX < maximumX && personPosition.locationX > minimumX) && (personPosition.locationY < maximumY && personPosition.locationY > minimumY)){
                  updatePos(joinedArray, person ,timeDiff)
                  updated ++
      } else {
      }
    }

  let newPlayer = joinedArray.pop()   // new player position is the end of the array

    //update scroll position  ? move this into game render section?
  //  let wrapper = document.getElementById("wrapper")
  //        wrapper.scrollTop = Math.round(newPlayer.locationY - viewport.height /2);  //round to smooth movement?
  //        wrapper.scrollLeft = Math.round(newPlayer.locationX - viewport.width / 2);

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


          if (graveArrayCopy.length % 4 === 0){  // if we have added a grave and its a multiple of 4 then up the level and give a health boost
            newPlayer.level ++
            newPlayer.health[0] += 50
            newPlayer.health[1] += 50
           }
           newPlayer.health[0] = newPlayer.health[0] <= newPlayer.health[1] - 15 ? newPlayer.health[0] += 10 : newPlayer.health[1]
        }

    })
    //check if touching items
      let cleanedItem = touchingItems(newPlayer, itemArrayCopy)

      //update states
        this.setState({  playerPosition : newPlayer}) //always update player state
      if (graveArrayCopy.length !== this.state.graveArray.length){  //only update graveArray if its changed
        this.setState({graveArray : graveArrayCopy})
      }

      if (cleanedItem.length !==this.state.objectArray.length ){ //only update if its been added to
                this.setState({objectArray : cleanedItem})
      }

      if (updated !== 1) {  //if we updated the enemy array set that state
        this.setState({enemyArray : cleanedArray})
      }
      this.setState({  playerPosition : newPlayer})
      lastUpdate = currentTime

  };

  handleKeyPress = (event) => {  //handle direction from key press
        let playerCopy = JSON.parse(JSON.stringify(this.state.playerPosition))
      if (event.key == "ArrowLeft" ) {
        playerCopy.direction = "walkLeft"
      } else if  (event.key == "ArrowRight") {
          playerCopy.direction = "walkRight"
      } else if  (event.key == "ArrowUp") {
            playerCopy.direction = "walkUp"
      } else if  (event.key == "ArrowDown") {
        playerCopy.direction = "walkDown"
      } else {
        playerCopy.direction = playerPosition.direction
      }
      if (this.state.playerPosition !== playerCopy.direction){ //only update if a different key is pressed
               this.setState({playerPosition : playerCopy })
      }

  };

  onClick = (e) => {    //handle direction from button press
    let playerCopy = JSON.parse(JSON.stringify(this.state.playerPosition))
    playerCopy.direction = e.target.id
    this.setState({
      playerPosition : playerCopy
    })
  };

  render() {

    let wrapperStyle ={ width : viewport.width + "px",            //set style for my wrapper (this is the viewport)
                        height: viewport.height + "px",
                        overflow : "hidden"
                        }


       let gameState = null                       //game state is dynamically rendered
       if (this.state.enemyArray.length === 0 && this.state.playerPosition.health[0] !==0){     // all enemies dead - array is zero - you have won
         //let wrapper = document.getElementById("wrapper")   //move the wrapper to the top left corned
          //     wrapper.scrollTop = 0
          //     wrapper.scrollLeft = 0
       gameState = (
            <Won />
         )
       } else if (this.state.playerPosition.health[0] === 0){             // health at zero. you have lost

         gameState = (
           <Lost />
         )
       } else {                                 //otherwise game still going // this is monsterous and needs seperatin ideally
                                                //highest points rendered at bottom // hence dungeon first
         let wrapper = document.getElementById("wrapper")  //bit hacky
         //  let wrapper = document.getElementById("wrapper")
         if (wrapper !== null) { //gets generated after first call
           wrapper.scrollTop = Math.round(this.state.playerPosition.locationY - viewport.height /2);  //round to smooth movement?
           wrapper.scrollLeft = Math.round(this.state.playerPosition.locationX - viewport.width / 2);
         }
         let wrapperX = wrapper === null ? 0 : wrapper.scrollLeft
         let wrapperY = wrapper === null ? 0 : wrapper.scrollTop



         gameState =
         <div id={"wrapper"} className={"wrapper"} style={wrapperStyle}  >
           <Stage className={"wrapper"} width={maximumX} height={maximumY}>
               <Layer hitGraphEnabled={false} listening={false}>
          <Group>
             <Dungeon dungeonArray={this.state.dungeonArray}
                      dungeonFloorArray={this.props.dungeonFloorArray}
                      dungeonLavaArray={this.props.dungeonLavaArray}
                      dungeonWallArray={this.props.dungeonWallArray}

               />
             <Items items={this.state.graveArray} />
             <Items items={this.state.objectArray} />
             <Player
                       playerGraphics={this.state.playerPosition.sprite}
                       positionX={this.state.playerPosition.locationX}
                       positionY={this.state.playerPosition.locationY}
                       direction={this.state.playerPosition.direction}
                       health={this.state.playerPosition.health}
               />
               <EnemyDisplay enemyArray={this.state.enemyArray} />
               <Shroud radius={this.state.radius}
                 x={this.state.playerPosition.locationX}
                 y={this.state.playerPosition.locationY}
                />
              <HUD wrapperX = {wrapperX}
                   wrapperY= {wrapperY}
                   playerPosition= {this.state.playerPosition}
                   enemyArrayLength={this.state.enemyArray.length}
              />


              </Group>
            </Layer>
          </Stage>
          </div>
       }

       // h6's are temporary, removed buttons as never going to be quick on movile, need to be a bit more polished
      return (
        <div>
            {gameState}
      </div>

    )}

};

class App extends React.Component { //ready for cache
  constructor (props){
    super(props)

    //set viewport based on orientation and screensize
    if (window.innerWidth > window.innerHeight){
      viewport.width = window.innerWidth <= 1200 ? window.innerWidth -40 : 800
      viewport.height = window.innerHeight <= 1200 ? window.innerHeight -300: 1200
    } else {
      viewport.width = 400
      viewport.height = 600
    }

    //set arrays up for cached image arrays using src paths from variables in spritevariables.js,
    // crash on mobile i think is something to do with here, need to cache hero and enemy variables before rendering
      let dungeonFloorArray = new Array(dungeonFloorImages.length)
      let dungeonWallArray = new Array(dungeonWallImages.length)
      let dungeonLavaArray = new Array(dungeonLavaImages.length)
      let spriteArray = new Array(spriteArrayImages.length)
      let itemArray = new Array(itemImages.length)

    this.state = {
        loadedImages : 0,
        amountToLoad : 5,
        dungeonFloorArray : dungeonFloorArray,
        dungeonWallArray : dungeonWallArray,
        dungeonLavaArray : dungeonLavaArray,
        spriteArray : spriteArray,
        itemArray : itemArray
    }

  }

componentDidMount = () => {

  let dungeonFloorArray =this.state.dungeonFloorArray
  generateImage(dungeonFloorArray, dungeonFloorImages).then((filledArray) => {
    let loadedImages = this.state.loadedImages + 1; //add 1 to state
    console.log("Downloaded dungeon floor array", loadedImages)
    this.setState({loadedImages: loadedImages,
                   dungeonFloorArray : filledArray
      })
      this.forceUpdate()      //not sure i need this but not updating eitherway so have left it in
  });

  let dungeonWallArray = this.state.dungeonWallArray
  generateImage(dungeonWallArray, dungeonWallImages).then((filledArray) => {
    let loadedImages = this.state.loadedImages + 1;
    console.log("Downloaded dungeon Wall array", loadedImages)
    this.setState({loadedImages: loadedImages,
                   dungeonWallArray : filledArray
    })
    this.forceUpdate()
  });

  let dungeonLavaArray = this.state.dungeonLavaArray
  generateImage(dungeonLavaArray, dungeonLavaImages).then((filledArray) => {
    let loadedImages = this.state.loadedImages + 1;
    console.log("Downloaded dungeon Lava array", loadedImages)
    this.setState({loadedImages: loadedImages,
                  dungeonLavaArray : filledArray
    })
    this.forceUpdate()
  });

  let spriteArray = this.state.spriteArray
  generateImage(spriteArray, spriteArrayImages).then((filledArray) => {
    let loadedImages = this.state.loadedImages + 1;
    console.log("Downloaded Sprites", loadedImages)
    this.setState({loadedImages: loadedImages,
                  spriteArray : filledArray
    })
    this.forceUpdate()
  });

  let itemArray = this.state.itemArray
  generateImage(itemArray, itemImages).then((filledArray) => {
    let loadedImages = this.state.loadedImages + 1;
    console.log("Downloaded Items", loadedImages)
    this.setState({loadedImages: loadedImages,
                  itemArray : filledArray
    })
    this.forceUpdate()
  });


};

  render() {

    let wrapperStyle ={ width : viewport.width + "px",      //not using this here
                        height: viewport.height + "px",
                        overflow : "hidden"
                        }

     // render load screen if finished render game
         let toRender
    if (this.state.amountToLoad === this.state.loadedImages){       //all fully cached render game
      toRender = ( <Game
                      dungeonFloorArray={this.state.dungeonFloorArray}
                      dungeonWallArray={this.state.dungeonWallArray}
                      dungeonLavaArray={this.state.dungeonLavaArray}
                      spriteArray={this.state.spriteArray}
                      itemArray={this.state.itemArray}
                  />)

    } else {      //else wait
      toRender = (
         <LoadScreen
            loadedImages = {this.state.loadedImages}
            amountToLoad ={this.state.amountToLoad}
           />
       )}

    return(
      <div>
        <GameTitle />
          {toRender}
      </div>
    )}
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
