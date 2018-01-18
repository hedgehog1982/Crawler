////////////////////////////// need to remove these global variables!!!!!!!!!!!!!!!!//////////////////////////////



let maximumX = 1920; //maximum horizontal
let maximumY = 1920; //maximum vertical
let canvasArray = [];  //want to access it everywhere. this is for fast collision detection for dungeon floors.
let tileArray =[]; // this is for the dungeon to be displayed and is a list of what tiles are being used
let tileSize = 32
const minimumCoords = 2 //to allow wall tile on edges
const maximumCoords = (maximumX / tileSize) -2 //to allow wall tiles
let roomArray =[]   //keep track of where rooms have been placed for generating corridors. no need to be a globale

random = (min, max) => {
return Math.floor(Math.random()*(max-min+1)+min);
};

populateCanvasArray = () => {       //populate ca

  for (let x = 0; x < tileArray.length; x++) { //go through each of position in tile array
    for (let y = 0; y < tileArray[0].length; y++) {

      if (tileArray[x][y] === "R" || tileArray[x][y] === "C") { //if it is a corridor or a room then put a corresponding 1 in canvasArray chunk (tile size squared)
        for (let canvasX = x * tileSize; canvasX < (x + 1) * tileSize; canvasX++) {
          for (let canvasY = y * tileSize; canvasY < (y + 1) * tileSize; canvasY++) {
            canvasArray[canvasX][canvasY] = 1;
          }
        }
      }
    }
  }
};

roomOccupied = (roomWidth, roomHeight, positionX, positionY) => {     //check if the room / corridor can be placed
  let occupied = false;
  for (let x = positionX; x < positionX + roomWidth ; x++) {  // check X position from room X pos for whole of width
    for (let y = positionY; y < positionY + roomHeight ; y++) {  // check X position from room X pos for whole of width
      if ((tileArray[x][y] === "R") || (tileArray[x][y] === "C")) {
        occupied = true;
        break; // small speed up?
      }
    }
  }
  return occupied
};

placeRoom = (roomWidth, roomHeight, positionX, positionY, letter) => {      //letter is 'C' for corridor, 'W' for wall, "R for room" , blank is assumed lava
  for (let x = positionX; x < positionX + roomWidth ; x++) {  // check X position from room X pos for whole of width
    for (let y = positionY; y < positionY + roomHeight ; y++) {  // check X position from room X pos for whole of width
        tileArray[x][y] = letter
    }
  }
};

placeWall = (x, y) => {     // go round whole tile and see if a wall needs adding
      if (tileArray[x][y] ==="R" || tileArray[x][y] ==="C")
      {
        if (tileArray[x-1][y] === undefined){ //place walls on sides
          placeRoom(1, 1, x - 1, y , "W")
        }
        if (tileArray[x+1][y] === undefined){ //
          placeRoom(1, 1, x + 1, y , "W")
        }
        if (tileArray[x][y-1] === undefined){ //
          placeRoom(1, 1, x, y -1, "W")
        }
        if (tileArray[x][y+1] === undefined){ //
          placeRoom(1, 1, x , y +1 , "W")
        }

        if (tileArray[x-1][y -1] === undefined){ //place corner walls
          placeRoom(1, 1, x - 1, y -1 , "W")
        }
        if (tileArray[x-1][y +1] === undefined){ //
          placeRoom(1, 1, x - 1, y + 1 , "W")
        }
        if (tileArray[x +1 ][y-1] === undefined){ //
          placeRoom(1, 1, x + 1 , y -1, "W")
        }
        if (tileArray[x+ 1][y+1] === undefined){ //
          placeRoom(1, 1, x+ 1 , y +1 , "W")
        }

      }
};

placeCorridors = () => {
  let roomWidth = 2   //corridor is 3 x 3 so corridors will be 3 x 2 x 32px
  let roomHeight = 2

   //for room 1  to second to last room
   for (let startRoom = 0; startRoom < roomArray.length - 1; startRoom ++ ) {  // start at first room and try and connect it to every other room1
     for (let endRoom = startRoom + 1; endRoom < roomArray.length; endRoom++ ) { //look at next adjacent room and loop through for every room

                //make the rest of the code a little more readable
                let startTop = roomArray[startRoom].positionY  //top of room 1
                let startBottom = roomArray[startRoom].positionY + roomArray[startRoom].roomHeight //bottom of room 1
                let startMiddle = roomArray[startRoom].positionY + (roomArray[startRoom].roomHeight / 2) //middle of room for the unlikely event the room is slightly bigger on same axis, you never know
                let startLeft = roomArray[startRoom].positionX
                let startRight = roomArray[startRoom].positionX + roomArray[startRoom].roomWidth
                let startCentre = roomArray[startRoom].positionX + (roomArray[startRoom].roomWidth /2)

                let endTop = roomArray[endRoom].positionY //top of room 2
                let endBottom = roomArray[endRoom].positionY + roomArray[endRoom].roomHeight //bottom of room 2
                let endLeft = roomArray[endRoom].positionX
                let endRight = roomArray[endRoom].positionX + roomArray[endRoom].roomWidth

              //for working out the where to place the corridor, this is the shared axis
              let minimumX = startLeft  < endLeft ?  endLeft : startLeft
              let maximumX = startRight <  endRight ? startRight - roomHeight : endRight -roomHeight

              let minimumY = startTop  < endTop  ?  endTop : startTop  //biggest y value
              let maximumY = startBottom <  endBottom ? startBottom - roomHeight : endBottom -roomHeight

              //values are used for where we are drawing from and to
              let startX
              let endX
              let startY
              let endY

              //horizontally aligned
              if ((startTop - roomHeight >= endTop  && startTop <= endBottom - roomHeight ) || (startBottom - roomHeight >= endTop && startBottom <= endBottom - roomHeight ) || (startMiddle >= endTop && startMiddle<= endBottom - roomHeight )) { //if the top / bottom or middle of room 1 is between the other rooms or the                console.log("minimum Y is ", minimumY)

                if (roomArray[startRoom].positionX < roomArray[endRoom].positionX){  //work out where we drawing X axis from and to, RHS of one to LHS of other
                      startX = roomArray[startRoom].positionX + roomArray[startRoom].roomWidth
                      endX = roomArray[endRoom].positionX

                } else {
                    startX = roomArray[endRoom].positionX + roomArray[endRoom].roomWidth
                    endX = roomArray[startRoom].positionX

                }

                let boundY = random(minimumY, maximumY)       //pick a y starting point within the bound Y points

                if (!roomOccupied(endX - startX, roomHeight, startX, boundY)){      // should add a bit of a buffer round here so corridors not placed close to other rooms
                              placeRoom(endX - startX, roomHeight, startX, boundY, "C")
                }

             //vertically aligned
           } else if ((startLeft - roomWidth >= endLeft  && startLeft <= endRight - roomWidth ) || (startRight- roomWidth >= endLeft && startRight <= endRight - roomWidth ) || (startCentre >= endLeft && startCentre<= endRight - roomWidth )) {

             if (roomArray[startRoom].positionY < roomArray[endRoom].positionY){  //work out where we drawing X axis from and to, RHS of one to LHS of other
                   startY = roomArray[startRoom].positionY + roomArray[startRoom].roomHeight
                   endY = roomArray[endRoom].positionY

             } else {
                 startY = roomArray[endRoom].positionY + roomArray[endRoom].roomHeight
                 endY = roomArray[startRoom].positionY

             }

             //if its on the same y plane draw a straight line
             //DRAW THE CORRIDOR (NEED TO CHECK IF OCCUPIED RATHER THAN JUST DRAWING WILLY NILLY)
             let boundX = random(minimumX, maximumX)       //pick a y starting point within the bound Y points

             if (!roomOccupied( roomWidth, endY - startY,  boundX, startY)){
                           placeRoom( roomWidth, endY - startY,  boundX, startY, "C")
             }
           } else {     //not on same plane
              //if the bottom of one is higher than top of another than that is where we start the x drawing down. we are drawing this for the length
                    //should be a function... duplicating it is LAZY!!!!!!

                   let boundX    //place corridor within allowed room boundaries
                       let leftMinimumX = startLeft < endLeft ? startLeft : endLeft
                       let leftMaximumX  = startLeft < endLeft ? startRight : endRight
                       let rightMinimumX = startLeft > endLeft ? startLeft : endLeft
                       let rightMaximumX  = startLeft > endLeft ? startRight : endRight
                       let topMinimumY = startTop < endTop ? startTop : endTop
                       let topMaximumY = startTop < endTop ? startBottom : endBottom
                       let bottomMinimumY = startTop > endTop ? startTop : endTop
                       let bottomMaximumY = startTop > endTop ? startBottom : endBottom

                     if ((startTop < endTop &&  startLeft < endLeft ) || ( endTop < startTop && endLeft < startLeft)){ // if the rooms are in the drirection upper left to lower right

                       //draw corridor down then to the right
                       let topBoundX = random(leftMinimumX, leftMaximumX - roomWidth)
                       let topBoundY = random(bottomMinimumY, bottomMaximumY - roomHeight)
                        //draw a corridor right and then down if not occupied
                       if (!roomOccupied(roomWidth + 2, topBoundY - topMaximumY, topBoundX -1 , topMaximumY) && !roomOccupied(rightMinimumX - topBoundX, roomHeight + 2, topBoundX, topBoundY -1)){
                         placeRoom(roomWidth, topBoundY - topMaximumY, topBoundX, topMaximumY, "C")
                         placeRoom(rightMinimumX - topBoundX, roomHeight, topBoundX, topBoundY, "C")
                       }

                       //draw a corridor right and then down
                     } else {
                       let topBoundX = random(rightMinimumX, rightMaximumX - roomWidth)
                       let topBoundY = random(bottomMinimumY, bottomMaximumY - roomHeight)
                       if (!roomOccupied(roomWidth + 2, topBoundY - topMaximumY, topBoundX - 1) && !roomOccupied(topBoundX - leftMaximumX + roomWidth, roomHeight + 2, leftMaximumX, topBoundY -1)){
                           placeRoom(roomWidth, topBoundY - topMaximumY, topBoundX, topMaximumY, "C")
                           placeRoom(topBoundX - leftMaximumX + roomWidth, roomHeight, leftMaximumX, topBoundY, "C")
                        }
                     }
           }
     }
   }
};


generateRoom = () => {
      const minimumSize = 8    // 7 tiles is 224 pixels wide
      const maximumSize = 15//


      let occupied = true
      let roomWidth, roomHeight, positionX, positionY;

      do {

      roomWidth = random(minimumSize, maximumSize)   //generate rooms between minimum and maximume
      roomHeight = random(minimumSize, maximumSize)

      positionX = random(minimumCoords , maximumCoords - roomWidth)
      positionY = random(minimumCoords , maximumCoords - roomHeight)

      occupied = roomOccupied(roomWidth + 4, roomHeight + 4, positionX -2 , positionY -2)  //i think i want this altering so rooms arent place next to each other so ive added an extra square round it
      }
      while (occupied === true)

      roomArray.push({
        positionX : positionX,
        roomWidth : roomWidth,
        positionY : positionY,
        roomHeight : roomHeight,

      })
      placeRoom(roomWidth, roomHeight, positionX, positionY, "R")

};

//passing in canvas height and width her but a global variable?!?!?!?!
generateRooms = (rooms, canvasWidth, canvasHeight) => {  // (32 x 32 tile)  x 40 tiles across grid =1280 grid,   32 pixels per tile ...
  canvasArray = [];  //ensure all arrays are blank if we generate a new dungeonArray

  tileArray = []  //blanking tile array (only really useful when generating a new level or resetting )
  roomArray= []   //will be storing room size and dimensions here for corridor

  for (let rows = 0; rows < canvasHeight; rows++){  // make a blank array for collision detection
    canvasArray.push(new Array(canvasWidth))
  }

  for (let rows = 0; rows < canvasHeight / tileSize  ; rows++){  // make a blank array for displaying tiles
    tileArray.push(new Array(canvasWidth / tileSize))
  }

  let currentTime = JSON.stringify(new Date().getTime());  // dont use this anywhere?

  for (let i = 0; i < rooms; i++){  //generate all our rooms before out corridors
            generateRoom()
  }

       placeCorridors()

   for (let x = 1; x < tileArray.length -1; x++) { //go through each of position in tile array and place walls.
     for (let y = 1; y < tileArray[0].length -1; y++) {
          placeWall(x, y)
    }
  }

  populateCanvasArray()  //update canvas array for collision detection //

return (tileArray)
}
