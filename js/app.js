import React from "react"
import ReactDOM from "react-dom"
import {drawSprite, healthBar, genEnemyArray} from "./components/player.js"  //react component that handles player and enemy sprites and generation
import {dungeonCanvas} from "./components/dungeon.js" // react component that hand dungeon images (Lava, floor and Wall)
import {itemsCanvas, genObjectArray} from "./components/items.js"  //render items to canvas, generate items
import {Won, Lost, LoadScreen, PlayerSelect} from "./components/screens.js" // react component for win / loss / loading screen
import {GameTitle, Buttons,  preDrawShroud, HUDCanvas} from "./components/onScreen.js" //react component - title screen , HUD and shroud
import {touchingItems, touchingOthers, randomDirection, withinDungeon, updatePos} from "./components/collision.js" //for collision detection of players, enemies and items

//canvas caches to speed up rendering (well thats the theory)
let cachedDungeon,  // cached dungeon canvas to speed up render
    cachedHUDCanvas = document.createElement('canvas'),  //cached HUD
    cachedShroud = preDrawShroud(),
    cachedHealthBar = healthBar({width : 40, height : 10})

let newEnemy,   //enemy array for new rendering
    newObject, //new object array
    canvasPlayer, //player
    newGraveArray = []  //graves

let lastUpdate;  //when we last ran updates on movement


let frameNum = 0
let globalID //for request animationFrame

class Game extends React.Component {

  constructor(props) {
    super(props);
    let {dungeonFloorArray, dungeonLavaArray, dungeonWallArray, itemArray, spriteArray} = this.props
        console.log(itemArray)

    lastUpdate = new Date().getTime()  //last update for working out distance travelled
    let canvasDimension = {height : 1920 , width : 1920}

    let dungeonArray = generateRooms({rooms  : 6, canvasDimension})  //     //generate dungeon maximumX and maximumY are a global variable, not sure thats the right thing to do... definitly no need to pass it if it is

    //going to start to use canvas without a framework over the top, will draw both at same time for now
    cachedDungeon = dungeonCanvas ({dungeonArray, dungeonFloorArray, dungeonLavaArray, dungeonWallArray,canvasDimension})

    console.log(cachedDungeon)

    let selectedSprite
    //place hero within dungeon // check to see if
    let inDungeon = false
    if (this.props.selectedPlayer === "jake"){
      selectedSprite = jake
      selectedSprite.img = 0
          selectedSprite.src = spriteArray[0].src  //pass the loaded source in
    } else {
      selectedSprite = JSON.parse(JSON.stringify(finn))
      selectedSprite.img = 3
      selectedSprite.src = spriteArray[3].src  //pass the loaded source in
    }

    let X, Y
    do {
       X = random(0, canvasDimension.width)                //generate random X and Y
       Y = random(0, canvasDimension.height)
       let spriteWidth = selectedSprite.animation.walkUp[3]         //widest sprite points
       let spriteHeight = selectedSprite.animation.walkUp[2]
      inDungeon = withinDungeon (X, Y, spriteWidth, spriteHeight)

    } while (inDungeon === false)

    canvasPlayer =             {
                                      name : "player",
                                      locationX : X,
                                      locationY : Y,
                                      direction : "walkUp",
                                      sprite : selectedSprite,
                                      health : [200 , 200],
                                      attack : 20,
                                      defense : 10,
                                      level : 1
                                    }

    //hardcoded amount of enemies, would like this accesible ( many levels, more enemies per level?)
    newEnemy = genEnemyArray ({dungeonArray, enemies : 12, spriteArray : this.props.spriteArray, playerLocation: {X : X, Y : Y}, canvasDimension : canvasDimension})    // generate enemies
    newObject = genObjectArray({dungeonArray, objects : 6, objectPicArray : this.props.itemArray, canvasDimension })  //generate objects

    // pre render canvas
      cachedHUDCanvas =  HUDCanvas({newPlayer: canvasPlayer, enemyQTY : newEnemy.length, fps : 0})
    this.onClick = this.onClick.bind(this);

      this.state = {
           radius : 150,
           playerState : "playing",
          canvasDimension : canvasDimension
    }
  }

 componentDidMount = () => {  //update positions  50 times a second
      //this.interval = setInterval(this.updateAllPosition, 20);  //update positions at 50fps (unlikely to happen at this speed)  //
      globalID = requestAnimationFrame(this.updateAllPosition);
      this.interval = setInterval(this.keyFrame, 250)

      //rendered divs at this point
      let can = document.getElementById("canvasBackground");
      let ctx = can.getContext('2d');
      ctx.drawImage(cachedDungeon, 0, 0);
  };

  componentWillMount = () => {  //if its mounted listen for key presses
    document.addEventListener("keydown", this.handleKeyPress)
    };

  keyFrame = () => {  // keep track of current frame. sure their an easier way. ternary
      if (frameNum === 3) {
        frameNum = 0
      } else {
        frameNum++
      }
  }


  updateAllPosition = () => {
    let newWrapper = document.getElementById("divCanvas")
    let wrapperX = newWrapper === null ? 0 : newWrapper.scrollLeft
    let wrapperY = newWrapper === null ? 0 : newWrapper.scrollTop
    newWrapper.scrollTop = Math.round(canvasPlayer.locationY - newWrapper.offsetHeight /2);  //round to smooth movement?
    newWrapper.scrollLeft = Math.round(canvasPlayer.locationX - newWrapper.offsetWidth / 2);

          let  can = document.getElementById("canvasForeground");
          let  ctx = can.getContext("2d")

           //fill canvas black and cut out a rectangle where the player is
           ctx.fillStyle="black"
           ctx.fillRect(0,0,1920,1920)

           //new method for quick shroud?
           ctx.save();
           ctx.beginPath();
           ctx.arc(Math.round(canvasPlayer.locationX), Math.round(canvasPlayer.locationY), 250, 0, Math.PI*2, true);
           ctx.closePath();
           ctx.clip();
           ctx.clearRect(Math.round(canvasPlayer.locationX - 250),Math.round(canvasPlayer.locationY -250),500,500)

           //draw Items
           itemsCanvas({ctx, itemImages : this.props.itemArray, itemList : newObject , canvasDimension : this.state.canvasDimension})

           //draw sprites
           drawSprite({   ctx,
                           cleanedArray : newEnemy,
                           newPlayer : canvasPlayer ,
                           cachedHealthBar,
                           spriteArray : this.props.spriteArray,
                           animation : canvasPlayer.sprite.animation,
                           keyFrame : frameNum * 4,
                           canvasDimension : this.state.canvasDimension});

         // draw shroud, 2 circles.
            if (shroud === true){
            ctx.drawImage(cachedShroud, -1000 + canvasPlayer.locationX, -1000 + canvasPlayer.locationY);
          }

           ctx.restore();

     //draw HUD on top

           //ensure it stays top left when in the uppermost top or left of screeny
           let HUDX = Math.round(canvasPlayer.locationX - (newWrapper.offsetWidth /2)) < 0 ? 0 : Math.round(canvasPlayer.locationX - (newWrapper.offsetWidth /2))
           let HUDY = Math.round(canvasPlayer.locationY - (newWrapper.offsetHeight /2)) < 0 ? 0 : Math.round(canvasPlayer.locationY - (newWrapper.offsetHeight /2))

          //ensure it stays top left when in the uppermost bottom or right of screen
           HUDX = newWrapper.scrollLeft == newWrapper.scrollWidth - newWrapper.offsetWidth ? newWrapper.scrollWidth - newWrapper.offsetWidth  : HUDX
           HUDY = newWrapper.scrollTop == newWrapper.scrollHeight - newWrapper.offsetHeight ? newWrapper.scrollHeight - newWrapper.offsetHeight : HUDY

           //draw the HUD
           ctx.drawImage(cachedHUDCanvas, HUDX , HUDY);  // draw cached items in one go from an offscreen canvas

            // do this here after all rendering?
            globalID = requestAnimationFrame(this.updateAllPosition);

    //get new positions
    let currentTime = new Date().getTime();
    let timeDiff = currentTime - lastUpdate;
    let fps = (Math.round(1000 /  (timeDiff)) + "FPS")
    //console.log(fps)

  //make duplicate of arrays so not altering directly
    let  joinedArray = JSON.parse(JSON.stringify(newEnemy))
    let  playerCopy = JSON.parse(JSON.stringify(canvasPlayer))
    let  itemArrayCopy = JSON.parse(JSON.stringify(newObject))
    let  graveArrayCopy = JSON.parse(JSON.stringify(newGraveArray))

  //for using new canvasDimension
    let updated = 0     //keep track of the amount of updates

    //check if in dungeon or touching enemy
    joinedArray.push(playerCopy)    // make an array that is a combined enemy/ hero array

    let minBoundary = 50; //stop players on the edge of the boundary just popping into existence
    //only check movement of things that have move within player view
    let minimumX = playerCopy.locationX - minBoundary - (2 * this.state.radius)
    let maximumX = playerCopy.locationX + minBoundary + (2 * this.state.radius)
    let minimumY = playerCopy.locationY - minBoundary - (2 * this.state.radius)
    let maximumY = playerCopy.locationY + minBoundary + (2 * this.state.radius)

    //work out where the players have moved in the time
    for(let person = 0; person < joinedArray.length ; person++){
      let personPosition = joinedArray[person]

      //only update if position close to player
      if ((personPosition.locationX < maximumX && personPosition.locationX > minimumX) && (personPosition.locationY < maximumY && personPosition.locationY > minimumY)){
                  updatePos(joinedArray, person ,timeDiff)
                  updated ++
      }
    }

  let newPlayer = joinedArray.pop()   // new player position is the end of the array

    //remove dead players (eventually check player is dead?)
    let cleanedArray = []

    //if we have a dead player we are going to add the grave to the background canvas
     can = document.getElementById("canvasBackground");
     ctx = can.getContext('2d');

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

          //draw grave on canvasBackground, do it here as we then only do it once and then its done
          console.log("draw Grave")
          ctx.drawImage(graveObject[0], Math.round(enemy.locationX), Math.round(enemy.locationY));


          if (graveArrayCopy.length % 4 === 0){  // if we have added a grave and its a multiple of 4 then up the level and give a health boost
            newPlayer.level ++
            newPlayer.health[0] += 50
            newPlayer.health[1] += 50
           }
           newPlayer.health[0] = newPlayer.health[0] <= newPlayer.health[1] - 15 ? newPlayer.health[0] += 10 : newPlayer.health[1]
        }

    })
    //check if player is touching items
      let cleanedItem = touchingItems(newPlayer, itemArrayCopy)

      //draw Text fill in red only draw if changed //cached new image
      if (newPlayer.health[0] != canvasPlayer.health[0] ||
           newPlayer.health[0] != canvasPlayer.health[0] ||
         newPlayer.attack != canvasPlayer.attack ||
       newPlayer.defense != canvasPlayer.defense ||
       newPlayer.level != canvasPlayer.level ||
       cleanedArray.length != newEnemy.length ) {
       cachedHUDCanvas =  HUDCanvas({newPlayer, enemyQTY : cleanedArray.length, fps})
     }

         //overwrite states
         newEnemy  = cleanedArray
         newObject = cleanedItem
         canvasPlayer = newPlayer
         newGraveArray = graveArrayCopy
         lastUpdate = currentTime

  };

  handleKeyPress = (event) => {  //handle direction from key press
    let  playerCopy = JSON.parse(JSON.stringify(canvasPlayer))

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
        canvasPlayer.direction = playerCopy.direction
  };

  onClick = (direction) => {    //handle direction from button press
    canvasPlayer.direction = direction
  };



  render() {
     let {canvasDimension, radius, playerState} = this.state
     let {dungeonFloorArray, dungeonLavaArray, dungeonWallArray} = this.props
    //   let wrapper = document.getElementById("wrapper"),   // this wrapper is what gets moved around
      let  newWrapper = document.getElementById("divCanvas"),
          viewport = {},
          gameState = null                       //game state is dynamically rendered
       if (playerState === 'won'){     // all enemies dead - array is zero - you have won
          clearInterval(this.interval); //not sure this is the bext place for it
       gameState = (
            <Won />
         )
       } else if (playerState === 'lost'){             // health at zero. you have lost
         clearInterval(this.interval);
         gameState = (
           <Lost />
         )
       } else {
         gameState =   (
           <div>
           <div id="divCanvas" className="wrapper">
           <div id="canvasContainer">
             <canvas id="canvasBackground" width="1920" height="1920" />
             <canvas id="canvasForeground" width="1920" height="1920" />
          </div>
           </div>
          <Buttons buttonPress={this.onClick} />
          </div>
         )
       }

       // h6's are temporary, removed buttons as never going to be quick on movile, need to be a bit more polished
      return (
       <div id="game">
            {gameState}
      </div>

    )}

};

class App extends React.Component { //ready for cache
  constructor (props){
    super(props)

    this.selectAPlayer = this.selectAPlayer.bind(this);


    //forcing download of text file
    let canvas = document.createElement('canvas');
        canvas.width = 200
        canvas.height = 200
    let ctx = canvas.getContext('2d');
            ctx.clearRect(0,0,300,300)
            ctx.font = "20px creepy";
            ctx.fillText("to get the ttf file all ready?!", 0 ,0)


    this.state = {
        loadedImages : 0,
        amountToLoad : 5,
        dungeonFloorArray : new Array(dungeonFloorImages.length),
        dungeonWallArray : new Array(dungeonWallImages.length),
        dungeonLavaArray : new Array(dungeonLavaImages.length),
        spriteArray : new Array(spriteArrayImages.length),
        itemArray : new Array(itemImages.length),
        selectedPlayer : false

    }
  }

componentDidMount = () => {  ///THIS IS NOT DRY,,, UGH
  let {dungeonFloorArray, dungeonWallArray, dungeonLavaArray, spriteArray, itemArray, loadedImages} = this.state
  let currentLoaded = 0

  generateImage(dungeonFloorArray, dungeonFloorImages).then((filledArray) => {
    currentLoaded ++; //add 1 to state
    console.log("Downloaded dungeon floor array", currentLoaded)
    this.setState({loadedImages: currentLoaded,
                   dungeonFloorArray : filledArray
      })
      this.forceUpdate()      //not sure i need this but not updating eitherway so have left it in
  });

  generateImage(dungeonWallArray, dungeonWallImages).then((filledArray) => {
    //let loadedImages = this.state.loadedImages + 1;
    currentLoaded ++;
    console.log("Downloaded dungeon Wall array", currentLoaded)
    this.setState({loadedImages: currentLoaded,
                   dungeonWallArray : filledArray
    })
    this.forceUpdate()
  });

  generateImage(dungeonLavaArray, dungeonLavaImages).then((filledArray) => {
    //let loadedImages = this.state.loadedImages + 1;
    currentLoaded ++;
    console.log("Downloaded dungeon Lava array", currentLoaded)
    this.setState({loadedImages: currentLoaded,
                  dungeonLavaArray : filledArray
    })
    this.forceUpdate()
  });

  generateImage(spriteArray, spriteArrayImages).then((filledArray) => {
    //let loadedImages = this.state.loadedImages + 1;
    currentLoaded ++;
    console.log("Downloaded Sprites", currentLoaded)
    this.setState({loadedImages: currentLoaded,
                  spriteArray : filledArray
    })
    this.forceUpdate()
  });

  generateImage(itemArray, itemImages).then((filledArray) => {
    //let loadedImages = this.state.loadedImages + 1;
    currentLoaded ++;
    console.log("Downloaded Items", currentLoaded )
    this.setState({loadedImages:  currentLoaded,
                  itemArray : filledArray
    })
    this.forceUpdate()
  });
};

 selectAPlayer = (player) => {
        console.log("You clicked ", player)
        this.setState({selectedPlayer : player})
  };

  render() {

         let toRender
    if (this.state.amountToLoad === this.state.loadedImages){       //all fully cached render game
      if (this.state.selectedPlayer === false){
        toRender = <PlayerSelect selectAPlayer={this.selectAPlayer} />
      } else {
        toRender =  <Game {...this.state} />
      }

    } else {      //else wait
      toRender = (
         <LoadScreen
            loadedImages = {this.state.loadedImages}
            amountToLoad = {this.state.amountToLoad}
           />
       )}

    return(
      <div id="appDiv">
        <GameTitle />
          {toRender}
      </div>
    )}
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
