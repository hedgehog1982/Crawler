let maximumX = 1920; //maximum horizontal
let maximumY = 1920; //maximum vertical
let canvasArray = [];  //want to access it everywhere. this is for collision differentDirection
let tileArray =[]; // this is for the dungeon to be displayed
let corrupted = false;
let tileSize = 32
const minimumCoords = 1 //to allow wall tile
const maximumCoords = (maximumX / tileSize) -1  //to allow wall tiles
let roomArray =[]

random = (min, max) => {
return Math.floor(Math.random()*(max-min+1)+min);
};

populateCanvasArray = () => {

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

roomOccupied = (roomWidth, roomHeight, positionX, positionY) => {
  let occupied = false;
  for (let x = positionX; x < positionX + roomWidth ; x++) {  // check X position from room X pos for whole of width
    for (let y = positionY; y < positionY + roomHeight ; y++) {  // check X position from room X pos for whole of width
      if ((tileArray[x][y] === "R") || (tileArray[x][y] === "C")) {
        occupied = true;
      }
    }
  }
  return occupied
};

placeRoom = (roomWidth, roomHeight, positionX, positionY, letter) => {
  for (let x = positionX; x < positionX + roomWidth ; x++) {  // check X position from room X pos for whole of width
    for (let y = positionY; y < positionY + roomHeight ; y++) {  // check X position from room X pos for whole of width
        tileArray[x][y] = letter
    }
  }
};

placeWall = (x, y) => {
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
  console.log("placing corridors")
  let roomWidth = 2   //corridor is 3 x 3
  let roomHeight = 2

   //for room 1  to second to last room
   for (let startRoom = 0; startRoom < roomArray.length - 1; startRoom ++ ) {  // start at first room and try and connect it to every other room1
     for (let endRoom = startRoom + 1; endRoom < roomArray.length; endRoom++ ) { //look at next adjacent room and loop through for every room
              //console.log("logging loops", startRoom, endRoom)
                let startTop = roomArray[startRoom].positionY  //top of room 1
                let startBottom = roomArray[startRoom].positionY + roomArray[startRoom].roomHeight //bottom of room 1
                let startMiddle = roomArray[startRoom].positionY + (roomArray[startRoom].roomHeight / 2) //middle of room for the unlikely event the room is slightly bigger on same axis, you never know

                let endTop = roomArray[endRoom].positionY //top of room 2
                let endBottom = roomArray[endRoom].positionY + roomArray[endRoom].roomHeight //bottom of room 2

              let minimumY = startTop  < endTop  ?  endTop : startTop  //biggest y value

              let startX
              let endX

                //smallest y+height value - roomheight
              let maximumY = startBottom <  endBottom ? startBottom - roomHeight : endBottom -roomHeight

              if ((startTop >= endTop && startTop <= endBottom - roomHeight) || (startBottom >= endTop && startBottom <= endBottom - roomHeight) || (startMiddle >= endTop && startMiddle<= endBottom - roomHeight)) { //if the top / bottom or middle of room 1 is between the other rooms or the                console.log("minimum Y is ", minimumY)
                console.log("maximum Y is" , maximumY)

                if (roomArray[startRoom].positionX < roomArray[endRoom].positionX){  //work out where we drawing X axis from and to
                      startX = roomArray[startRoom].positionX + roomArray[startRoom].roomWidth
                      endX = roomArray[endRoom].positionX

                } else {
                    startX = roomArray[endRoom].positionX + roomArray[endRoom].roomWidth
                    endX = roomArray[startRoom].positionX

                }
                console.log(startRoom, "and" , endRoom, "are on same plane")
                console.log("going from ", startX, " to ", endX)
                console.log("minimum Y is ",minimumY)

              }
            //if its on the same y plane draw a straight line
            //DRAW THE CORRIDOR (NEED TO CHECK IF OCCUPIED RATHER THAN JUST DRAWING WILLY NILLY)
            let boundY = random(minimumY, maximumY)       //pick a y starting point within the bound Y points

            if (!roomOccupied(endX - startX, roomHeight, startX, boundY)){
                          placeRoom(endX - startX, roomHeight, startX, boundY, "C")
            }


     }
   }
/* let room1X, room1Y
 do {
    room1X = random(minimumCoords , maximumCoords - roomWidth)
    room1Y = random(minimumCoords , maximumCoords - roomHeight)
    occupied = roomOccupied(1, 1, room1X, room1Y)

  }
  while (occupied === false)

  let room2X, room2Y


  do {
     room2X = random(minimumCoords , maximumCoords - roomWidth)
     room2Y = random(minimumCoords , maximumCoords - roomHeight)
     occupied = roomOccupied(1, 1, room2X, room2Y)

   }
   while (occupied === false)

  do {
    occupied = roomOccupied(roomWidth, roomHeight, room1X, room1Y)
        if (occupied === false){
          placeRoom(roomWidth, roomHeight, room1X, room1Y, "C")
        } else {
          placeRoom(roomWidth, roomHeight, room1X, room1Y, "R")
        }

    if (room1X < room2X){  //this is a riduculous bit of code???
          room1X += 1
    } else if (room1X > room2X){
          room1X -= 1
    } else {

      if  (room1Y < room2Y){
        room1Y +=1
      } else {
        room1Y -=1
      }

    }

  }
  while (room1Y !== room2Y) */
   console.log("finished placing corridors")
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

      occupied = roomOccupied(roomWidth, roomHeight, positionX, positionY)
      }
      while (occupied === true)

      roomArray.push({
        roomWidth : roomWidth,
        roomHeight : roomHeight,
        positionX : positionX,
        positionY : positionY
      })
      placeRoom(roomWidth, roomHeight, positionX, positionY, "R")

};

generateRooms = (rooms, canvasWidth, canvasHeight) => {  // (32 x 32 tile)  x 40 tiles across grid =1280 grid,   32 pixels per tile ...
  canvasArray = [];  //ensure all arrays are blank if we generate a new dungeonArray
  tileArray = []
  roomArray= []   //will be storing room size and dimensions here for corridor

  for (let rows = 0; rows < canvasHeight; rows++){  // make a blank array for collision detection
    canvasArray.push(new Array(canvasWidth))
  }

  for (let rows = 0; rows < canvasHeight / tileSize  ; rows++){  // make a blank array for displaying tiles
    tileArray.push(new Array(canvasWidth / tileSize))
  }

  let currentTime = JSON.stringify(new Date().getTime());  // dont use this anywhere?

  //console.log(canvasWidth, canvasHeight)
  //console.log(canvasArray)
  //console.log(tileArray)

  for (let i = 0; i < rooms; i++){  //generate rooms
            generateRoom()
  }

  // for (let i = 0; i < rooms ; i++){ //generate corridors  // does not guarantee a corridor to every rooms
        //i think i should keep track of all room sizes. then see if i can generate a corridor to every other room
       placeCorridors()
  // }

   for (let x = 1; x < tileArray.length -1; x++) { //go through each of position in tile array and place walls.
     for (let y = 1; y < tileArray[0].length -1; y++) {
          placeWall(x, y)
    }
  }
  console.log(roomArray)


  populateCanvasArray()  //update canvas array for collision detection

return (tileArray)
}
