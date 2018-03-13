const itemsCanvas = ({ctx, itemImages, itemList, canvasDimension}) =>{  //DRAW DUNGEON

      itemList.forEach(item => {
        ctx.drawImage(itemImages[item.imgItem], item.locationX, item.locationY);
      })
}

module.exports = {
    itemsCanvas : itemsCanvas
}
