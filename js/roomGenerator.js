let maximumX = 1920; //maximum horizontal
let maximumY = 1920; //maximum vertical
let canvasArray = [];  //want to access it everywhere. this is for collision differentDirection
let tileArray =[]; // this is for the dungeon to be displayed
let corrupted = false;
let tileSize = 32
const minimumCoords = 1 //to allow wall tile
const maximumCoords = (maximumX / tileSize) -1  //to allow wall tiles

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
      if (tileArray[x][y] === "R"){
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
  let roomWidth = 3   //corridor is 3 x 3
  let roomHeight = 3
 let room1X, room1Y
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
  while (room1Y !== room2Y)




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

      placeRoom(roomWidth, roomHeight, positionX, positionY, "R")

};

generateRooms = (rooms, canvasWidth, canvasHeight) => {  // (32 x 32 tile)  x 40 tiles across grid =1280 grid,   32 pixels per tile ...
  canvasArray = [];  //ensure all arrays are blank if we generate a new dungeonArray
  tileArray = []

  for (let rows = 0; rows < canvasHeight; rows++){  // make a blank array for collision detection
    canvasArray.push(new Array(canvasWidth))
  }

  for (let rows = 0; rows < canvasHeight / tileSize  ; rows++){  // make a blank array for collision detection
    tileArray.push(new Array(canvasWidth / tileSize))
  }

  let currentTime = JSON.stringify(new Date().getTime());

  console.log(canvasWidth, canvasHeight)
  console.log(canvasArray)
  console.log(tileArray)

  for (let i = 0; i < rooms; i++){  //generate rooms
            generateRoom()
  }

   for (let i = 0; i < rooms ; i++){ //generate corridors
       placeCorridors()
   }

   for (let x = 1; x < tileArray.length -1; x++) { //go through each of position in tile array
     for (let y = 1; y < tileArray[0].length -1; y++) {
          placeWall(x, y)
    }
  }


  populateCanvasArray()

return (tileArray)
}
