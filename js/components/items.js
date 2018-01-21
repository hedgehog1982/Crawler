import {Layer, Rect, Sprite, Stage, Group, Image} from 'react-konva';
import React from "react"
import ReactDOM from "react-dom"

class Items extends React.Component {
    constructor(props){
      super(props);
    };

    render(){
      let objectArray = this.props.items
      let objectDisplay = objectArray.map((object , key) => {

          return(
            <Item key={object.name}
                positionX ={object.locationX}
                positionY={object.locationY}
                img={object.img}
            />
        )
        });

      return(
        <Group>
        {objectDisplay}
        </Group>
      )}
};

class Item extends React.Component {
    constructor(props){
      super(props);
      this.state ={
        image: new window.Image()
      }
    };

    componentDidMount() {
      console.log(this.props.img.src)
  this.state.image.src = this.props.img.src;
  this.state.image.onload = () => {
    this.imageNode.getLayer().batchDraw(); //update when loaded and force redraw
            this.imageNode.cache()
  };
};

    render(){
      return(
        <Image
        image={this.state.image}
        x={this.props.positionX}
        y={this.props.positionY}
        hitGraphEnabled={false}
        fillEnabled={false}
        shadowForStrokeEnabled={false}
        strokeHitEnabled={false}
        listening={false}
        ref={node => {
          this.imageNode = node;
        }}
      />
      )}
};




module.exports = {
    Items: Items
}
