import React from "react"
import ReactDOM from "react-dom"
//import {Player, EnemyDisplay} from "./components/player.js"  //react component that handles player and enemy sprites
import {dungeonCanvas} from "./components/dungeon.js" // react component that hand dungeon images (Lava, floor and Wall)
//import {Items} from "./components/items.js"  //react component that handles health items and eventually weapons
import {Won, Lost, LoadScreen, PlayerSelect} from "./components/screens.js" // react component for win / loss / loading screen
import {GameTitle,  preDrawShroud} from "./components/onScreen.js" //react component - title screen , HUD and shroud

let cachedDungeon  // cached dungeon background to speed up render

let newEnemy   //enemy array for new rendering
let newObject //new object array
let canvasPlayer
let newGraveArray = []

let cachedShroud
let frameNum = 0

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

    cachedShroud = preDrawShroud()


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

    // for new Canvas Rendeing


    this.onClick = this.onClick.bind(this);
      this.state = {
           radius : 150,
           dungeonArray : dungeonArray,                   // x , y , width, height
          playerPosition : canvasPlayer,
          enemyArray : newEnemy, // enemyArray,
          objectArray : newObject,
          graveArray : newGraveArray,  //a blank array
          canvasDimension : canvasDimension
    }
  }


 componentDidMount = () => {  //update positions  50 times a second
      this.interval = setInterval(this.updateAllPosition, 20);  //update positions at 50fps (unlikely to happen at this speed)  //
      this.interval = setInterval(this.keyFrame, 250)

      //rendered divs at this point
      let can = document.getElementById("canvasBackground");
      let ctx = can.getContext('2d');
      ctx.drawImage(cachedDungeon, 0, 0);

     let title = document.getElementById('gameTitle')

      document.getElementById('canvasHUD').style.top = (title.offsetHeight + 40) + "px"
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


  updateAllPosition = () => {  //update position --- needs speeding up

    let currentTime = new Date().getTime();
    let timeDiff = currentTime - lastUpdate;
    let fps = (Math.round(1000 /  (timeDiff)) + "FPS")

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


    for(let person = 0; person < joinedArray.length ; person++){      // pass into my function to work out distances moved
      let personPosition = joinedArray[person]
      if ((personPosition.locationX < maximumX && personPosition.locationX > minimumX) && (personPosition.locationY < maximumY && personPosition.locationY > minimumY)){
                  updatePos(joinedArray, person ,timeDiff)
                  updated ++
      } else {  //what was i going to put in here?

      }
    }

  let newPlayer = joinedArray.pop()   // new player position is the end of the array

    //remove dead players (eventually check player is dead?)
    let cleanedArray = []
    let can = document.getElementById("canvasBackground");
    let ctx = can.getContext('2d');

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
    //check if touching items
      let cleanedItem = touchingItems(newPlayer, itemArrayCopy)

      //update states
      newEnemy  = cleanedArray
      newObject = cleanedItem
      canvasPlayer = newPlayer
      newGraveArray = graveArrayCopy
      lastUpdate = currentTime

  // get where we are currently scrolled to
      let newWrapper = document.getElementById("divCanvas")
      let wrapperX = newWrapper === null ? 0 : newWrapper.scrollLeft
      let wrapperY = newWrapper === null ? 0 : newWrapper.scrollTop

   ////  for updating our new shiny canvas //drawing bottom to top
       can = document.getElementById("canvasForeground");
       ctx = can.getContext('2d');

      ctx.clearRect(0,0,1920,1920)   // draw our cached dungeon rather than re-rendering


      //draw Items  //cache these at some point?
      cleanedItem.forEach(item => {
        ctx.drawImage(this.props.itemArray[item.imgItem], item.locationX, item.locationY);
      })

      //draw player
      //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
      let {spriteArray} = this.props
      let {animation} = newPlayer.sprite
      let keyFrame = frameNum * 4

      //draw health bar
      //ctx.fillStyle= "white"
      //ctx.fillRect(20,20,150,100);
      //ctx.fillStyle = "green"


      //draw sprite
      let sx = animation[newPlayer.direction][keyFrame + 0] ,
          sy = animation[newPlayer.direction][keyFrame + 1],
          sWidth = animation[newPlayer.direction][keyFrame + 2],
          sHeight = animation[newPlayer.direction][keyFrame + 3]

      ctx.drawImage(spriteArray[newPlayer.sprite.img],
              sx, sy, sWidth, sHeight,
               newPlayer.locationX,
               newPlayer.locationY,
              sWidth, sHeight  );  // keep aspect ration

    // draw enemies
          cleanedArray.forEach(enemy => {
            let animation = enemy.sprite.animation
            let sx = animation[enemy.direction][keyFrame + 0] ,
                sy = animation[enemy.direction][keyFrame + 1],
                sWidth = animation[enemy.direction][keyFrame + 2],
                sHeight = animation[enemy.direction][keyFrame + 3]

            ctx.drawImage(spriteArray[enemy.sprite.img],
                    sx, sy, sWidth, sHeight,
                     enemy.locationX,
                     enemy.locationY,
                    sWidth, sHeight  );  // keep aspect ration

          })

    // draw shroud, 2 circles.
           if (shroud === true){
       ctx.drawImage(cachedShroud, -1000 + newPlayer.locationX, -1000 + newPlayer.locationY);
     }

       //draw Text fill in red
       can = document.getElementById("canvasHUD");
       ctx = can.getContext('2d');
       ctx.clearRect(0,0,300,300)
       ctx.font = "20px creepy";
       ctx.fillStyle = "#6d0606";
       ctx.fillText(newPlayer.health[1] + " / " + newPlayer.health[0] + "HP" ,0, 15);
       ctx.fillText(newPlayer.attack + "AP",0, 40);
       ctx.fillText(newPlayer.defense +"DP",0, 65);
       ctx.fillText(cleanedArray.length + "Enemies",0, 90);
       ctx.fillText("Current Level" + newPlayer.level ,0, 115);
       ctx.fillText(fps ,0, 140);




      /*   ctx.font = "20px creepy";
         ctx.fillStyle = "#6d0606";
         ctx.fillText(newPlayer.health[1] + " / " + newPlayer.health[0] + "HP" ,wrapperX, wrapperY + 15);
         ctx.fillText(newPlayer.attack + "AP",wrapperX, wrapperY + 40);
         ctx.fillText(newPlayer.defense +"DP",wrapperX, wrapperY + 65);
         ctx.fillText(cleanedArray.length + "Enemies",wrapperX, wrapperY + 90);
         ctx.fillText("Current Level" + newPlayer.level ,wrapperX, wrapperY + 115);
         ctx.fillText(fps ,wrapperX, wrapperY + 140);
        */


         newWrapper.scrollTop = Math.round(newPlayer.locationY - newWrapper.offsetHeight /2);  //round to smooth movement?
         newWrapper.scrollLeft = Math.round(newPlayer.locationX - newWrapper.offsetWidth / 2);


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

  onClick = (e) => {    //handle direction from button press
    canvasPlayer.direction = e.target.id
  //  let playerCopy = JSON.parse(JSON.stringify(canvasPlayer))
  //  playerCopy.direction = e.target.id
  //  canvasPlayer = playerCopy
  };

  render() {
     let {enemyArray, playerPosition, canvasDimension, dungeonArray, graveArray, objectArray, radius} = this.state
     let {dungeonFloorArray, dungeonLavaArray, dungeonWallArray} = this.props
       let wrapper = document.getElementById("wrapper"),   // this wrapper is what gets moved around
           newWrapper = document.getElementById("divCanvas"),
          viewport = {},
          gameState = null                       //game state is dynamically rendered
       if (enemyArray.length === 0 && playerPosition.health[0] !==0){     // all enemies dead - array is zero - you have won
          clearInterval(this.interval); //not sure this is the bext place for it
       gameState = (
            <Won />
         )
       } else if (playerPosition.health[0] === 0){             // health at zero. you have lost
         clearInterval(this.interval);
         gameState = (
           <Lost />
         )
       } else {
          //otherwise game still going
                                                     if (wrapper !== null) { //gets generated after first call
           viewport.width = wrapper.offsetWidth
           viewport.height = wrapper.offsetHeight
           wrapper.scrollTop = Math.round(playerPosition.locationY - viewport.height /2);  //round to smooth movement?
           wrapper.scrollLeft = Math.round(playerPosition.locationX - viewport.width / 2);
           divCanvas.scrollTop = Math.round(playerPosition.locationY - viewport.height /2);  //round to smooth movement?
           divCanvas.scrollLeft = Math.round(playerPosition.locationX - viewport.width / 2);
         }

         let wrapperX = wrapper === null ? 0 : wrapper.scrollLeft
         let wrapperY = wrapper === null ? 0 : wrapper.scrollTop

         gameState =   (
           <div>
           <div id="divCanvas" className="wrapper">
           <div id="canvasContainer">
             <canvas id="canvasBackground" width="1920" height="1920" />
             <canvas id="canvasForeground" width="1920" height="1920" />
             <canvas id="canvasHUD" width="300" height="300" />
             </div>
           </div>
              <div>
               <button onClick={this.onClick} id="walkUp">UP</button>
               <button onClick={this.onClick} id="walkDown">DOWN</button>
               <button onClick={this.onClick} id="walkLeft">LEFT</button>
               <button onClick={this.onClick} id="walkRight">RIGHT</button>
              </div>
          </div>
         )
       }

       // h6's are temporary, removed buttons as never going to be quick on movile, need to be a bit more polished
      return (
       <div   >
            {gameState}
      </div>

    )}

};

class App extends React.Component { //ready for cache
  constructor (props){
    super(props)

    this.selectAPlayer = this.selectAPlayer.bind(this);

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
