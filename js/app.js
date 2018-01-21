

import {Layer, Sprite, Rect, Stage, Group, Circle, Text} from 'react-konva'; //import from konva-react
import React from "react"
import ReactDOM from "react-dom"
import {Player} from "./components/player.js"  //react component that handles player and enemy sprites
import {Dungeon} from "./components/dungeon.js" // react component that hand dungeon images (Lava, floor and Wall)
import {Items} from "./components/items.js"  //react component that handles health items and eventually weapons
import {Won, Lost} from "./components/endScreens.js" // react component for win / loss screen

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

class Shroud extends React.Component {  //splits enemy array into react component
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
    let selectedSprite = jake     //would like to pass this in as part of loading, maybe make it selectable
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
    let enemies = 6                                           //hardcoded amount of enemies, would like this accesible ( many levels, more enemies per level?)
    let enemyArray = genEnemyArray (dungeonArray, enemies, this.props.spriteArray[1].src )    // pass the src in for cinn, this way its been cached, at the minute this can be placed next to hero, dont want that

    //populate power-up                                         //eventually want to add weapons and armour. function allows this
    let objects = 3
    let objectArray = genObjectArray(dungeonArray, objects)

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
            defense : 10
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
    console.log(Math.round(1000 /  (timeDiff)), "FPS")

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
    console.log("Total players update ", updated)

    let newPlayer = joinedArray.pop()   // new player position is the end of the array

    //update scroll position
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


       let won = null                       //won is dynamically rendered
       if (this.state.enemyArray.length === 0 && this.state.playerPosition.health[0] !==0){     // all enemies dead - array is zero - you have won
         let wrapper = document.getElementById("wrapper")   //move the wrapper to the top left corned
               wrapper.scrollTop = 0
               wrapper.scrollLeft = 0
         won = (
            <Won />
         )
       } else if (this.state.playerPosition.health[0] === 0){             // health at zero. you have lost
         let wrapper = document.getElementById("wrapper")
               wrapper.scrollTop = 0  //round to smooth movement?
               wrapper.scrollLeft = 0
         won = (
           <Lost />
         )
       } else {                                 //otherwise game still going // this is monsterous and needs seperatin ideally
                                                //highest points rendered at bottom // hence dungeon first



         won =
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

              </Group>
       }

       // h6's are temporary, buttons as well, need to be a bit more polished
      return (
        <div>
        <h2> DUNGEON CRAWLER </h2>
          <div id={"wrapper"} className={"wrapper"} style={wrapperStyle}  >
            <Stage className={"wrapper"} width={maximumX} height={maximumY}>
                <Layer hitGraphEnabled={false} listening={false}>
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

    this.state = {
        loadedImages : 0,
        amountToLoad : 4,
        dungeonFloorArray : dungeonFloorArray,
        dungeonWallArray : dungeonWallArray,
        dungeonLavaArray : dungeonLavaArray,
        spriteArray : spriteArray
    }

  }

componentDidMount = () => {

    // cache all images in arrays (do in one pass)
    //store values in setState to allow them to be used when generating images

  //Same thing three times !!!! needs to be a function!!!!!!!!!!!

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
                  />)

    } else {      //else wait
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
