let maximumX = 1280; //maximum horizontal
let maximumY = 1280; //maximum vertical
let canvasArray = [];  //want to access it everywhere
let corrupted = false;

random = (min, max) => {
return Math.floor(Math.random()*(max-min+1)+min);
}

generateRoom = () =>{
      const minimumSize = 7    // 7 tiles is 224 pixels wide
      const maximumSize = 14
      const minimumCoords = 1 //to allow wall tile
      const maximumCoords = 39 //to allow wall tiles



}




generateRooms = (rooms, canvasWidth, canvasHeight) => {  // (32 x 32 tile)  x 40 tiles across grid =1280 grid,   32 pixels per tile ...
  canvasArray = [];

  console.log(canvasWidth, canvasHeight)


let roomArray = [];


      for (let i = 0; i < rooms; i++){
                generateRoom()
      }
return (roomArray)
}
