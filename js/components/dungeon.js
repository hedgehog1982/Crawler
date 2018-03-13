const dungeonCanvas = ({dungeonArray, dungeonFloorArray, dungeonLavaArray, dungeonWallArray,canvasDimension}) =>{  //DRAW DUNGEON
  let canvas = document.createElement('canvas');
      canvas.width = canvasDimension.width
      canvas.height = canvasDimension.height
  let ctx = canvas.getContext("2d");
  console.log(" RENDERING OUR NEW SHINY DUNGEON")

  for (let x = 0; x < dungeonArray.length ; x++) {  // check X position from room X pos for whole of width
    for (let y = 0; y < dungeonArray[0].length ; y++) {  // check X position from room X pos for whole of width
      let img = document.createElement('img'); // use DOM HTMLImageElement
        img.width = tileSize
        img.height = tileSize
      if (dungeonArray[x][y] === "R" || dungeonArray[x][y] === "C" ){  //dungeon room
          img.src = dungeonFloorArray[random(0, dungeonFloorArray.length - 1)].src
          ctx.drawImage(img, x * tileSize, y * tileSize);

      } else if ((dungeonArray[x][y] === "W")) {
          img.src = dungeonWallArray[random(0, dungeonWallArray.length - 1)].src
          ctx.drawImage(img, x * tileSize, y * tileSize);
      } else {
          img.src = dungeonLavaArray[random(0, dungeonLavaArray.length - 1)].src
          ctx.drawImage(img, x * tileSize, y * tileSize);
      }
    }
  }
  console.log("finished Rendering")
  return canvas
}

module.exports = {
    dungeonCanvas : dungeonCanvas
}
