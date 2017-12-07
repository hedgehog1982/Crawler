let maximumX = 1600; //maximum horizontal
let maximumY = 1600; //maximum vertical
let canvasArray = [];  //want to access it everywhere
let corrupted = false;

random = (min, max) => {
return Math.floor(Math.random()*(max-min+1)+min);
}

addRoomCanvas = (roomObject) => {   //{"x" : 0, "y" : 0 , "width" : 400, "height": 400}
  let previousTime = JSON.stringify(new Date().getTime());
  for (let x = roomObject.x; x < (roomObject.x + roomObject.width); x++){
    for (let y = roomObject.y; y < (roomObject.y + roomObject.height); y++){
        canvasArray[x][y] = 1;
    };
  };
  let currentTime = JSON.stringify(new Date().getTime());
  console.log("time to add ", currentTime - previousTime -0)

};

checkOccupied = (roomObject, attempts) => {
  console.log(roomObject, attempts)
  let occupied = false;
  let previousTime = JSON.stringify(new Date().getTime());
  for (let x = roomObject.x + 3; x < (roomObject.x + roomObject.width)- 1; x++){
    for (let y = roomObject.y + 3; y < (roomObject.y + roomObject.height) -1; y++){
        if (canvasArray[x][y] ===1){
          occupied = true
        }
    };
  };
  let currentTime = JSON.stringify(new Date().getTime());
  console.log("time to check ", currentTime - previousTime -0)
  if (attempts === 100) {
    console.log("tried 10 times placing it anywhere")
    occupied = false
    corrupted = true
  }
 return (occupied)

};

room = () => {
  let minimumRoomSize = 200;
  let maximumRoomSize = 400;
  let x , y, width, height

  do{
  do {
    x = random(0, maximumX)   //generate random X
    y = random(0, maximumY)
    width = random(minimumRoomSize, maximumRoomSize )
    height = random(minimumRoomSize, maximumRoomSize )
  }
  while ((x + width) > maximumX || (y + height) > maximumY)
}
while (checkOccupied({"x" : x, "y" : y , "width" : width, "height": height}))

  return ({"x" : x, "y" : y , "width" : width, "height": height})
};

roomier = (previousRoom) => {
  let attempts = 0
  let minimumCorridorWidth = 250;
  let maximumCorridorWidth = 400
  let minimumCorridorLength = 250
  let maximumCorridorlength = 400;
  let x , y, width, height
  console.log("previous Room is ",previousRoom)
  do{
    attempts++
  do{
  let direction = random(0,3)
  if (direction == 0){  //south facing corridor
        width = random(minimumCorridorWidth, minimumCorridorWidth )
        height = random(minimumCorridorLength, maximumCorridorlength )
        x = random(previousRoom.x,previousRoom.x + previousRoom.width -width ) ,
        y =  previousRoom.y + previousRoom.height
 } else if (direction == 1) { //north facing corridor
     width = random(minimumCorridorWidth, minimumCorridorWidth )
     height = random(minimumCorridorLength, maximumCorridorlength )
     x = random(previousRoom.x,previousRoom.x + previousRoom.width -width ) ,  //generate random X
     y =  previousRoom.y -height
   } else if (direction == 2){ //east facing corridor
     height = random(minimumCorridorWidth, minimumCorridorWidth )
     width = random(minimumCorridorLength, maximumCorridorlength ),
     x = previousRoom.x + previousRoom.width ,  //generate random X
     y = random(previousRoom.y,previousRoom.y + previousRoom.height -height)
   } else {
     height = random(minimumCorridorWidth, minimumCorridorWidth )
     width = random(minimumCorridorLength, maximumCorridorlength ),
     x = previousRoom.x - width ,  //generate random X
     y = random(previousRoom.y,previousRoom.y + previousRoom.height -height)

   }
 }
    while (x + width > maximumX || y + height > maximumY || x < 0 || y < 0)
}
while (checkOccupied({"x" : x, "y" : y , "width" : width, "height": height}, attempts))

  addRoomCanvas({"x" : x, "y" : y , "width" : width, "height": height})
  return ({"x" : x, "y" : y , "width" : width, "height": height})
};

corridor = (previousRoom) => {
let attempts = 0
  let minimumCorridorWidth = 70;
  let maximumCorridorWidth = 80
  let minimumCorridorLength = 100
  let maximumCorridorlength = 400;
  let x , y, width, height
  console.log("previous Room is ",previousRoom)

  do{
    attempts ++
  do{
  let direction = random(0,3)
  console.log("random is ", direction)
  if (direction == 0){  //south facing corridor
        width = random(minimumCorridorWidth, minimumCorridorWidth )
        height = random(minimumCorridorLength, maximumCorridorlength )
        x = random(previousRoom.x ,previousRoom.x + previousRoom.width -width ) ,
        y =  previousRoom.y + previousRoom.height
 } else if (direction == 1) { //north facing corridor
     width = random(minimumCorridorWidth, minimumCorridorWidth )
     height = random(minimumCorridorLength, maximumCorridorlength )
     x = random(previousRoom.x,previousRoom.x + previousRoom.width - width  ) ,  //generate random X
     y =  previousRoom.y -height
   } else if (direction == 2){ //east facing corridor
     height = random(minimumCorridorWidth, minimumCorridorWidth )
     width = random(minimumCorridorLength, maximumCorridorlength ),
     x = previousRoom.x + previousRoom.width ,  //generate random X
     y = random(previousRoom.y,previousRoom.y + previousRoom.height -height)
   } else {
     height = random(minimumCorridorWidth, minimumCorridorWidth )
     width = random(minimumCorridorLength, maximumCorridorlength ),
     x = previousRoom.x - width ,  //generate random X
     y = random(previousRoom.y,previousRoom.y + previousRoom.height -height)

   }
 }
    while (x + width > maximumX || y + height > maximumY || x < 0 || y < 0)
  }
  while (checkOccupied({"x" : x, "y" : y , "width" : width, "height": height},attempts))

  addRoomCanvas({"x" : x, "y" : y , "width" : width, "height": height})
  return ({"x" : x, "y" : y , "width" : width, "height": height})
};

generateRooms = (rooms, canvasWidth, canvasHeight) => {
  corrupted = false;
  canvasArray = [];
  let currentTime = JSON.stringify(new Date().getTime());

  console.log(canvasWidth, canvasHeight)

  for (let rows = 0; rows < canvasHeight ; rows++){
    canvasArray.push(new Array(canvasWidth))
  }

  let pastTime = JSON.stringify(new Date().getTime());
  console.log(pastTime - currentTime - 0)
  console.log("canvas array", canvasArray)
  console.log(canvasArray[0].length)

let roomArray = [];
//roomArray.push(room())

roomArray.push({"x" : 0, "y" : 0 , "width" : 400, "height": 400})
addRoomCanvas(roomArray[0])
for (let i = 0; i < rooms; i++){
  roomArray.push(corridor(roomArray[roomArray.length -1]))
  //roomArray.push(room())
  roomArray.push(roomier(roomArray[roomArray.length -1]))
}
return (roomArray)
}
