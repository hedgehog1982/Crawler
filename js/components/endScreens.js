import {Text, Group} from 'react-konva';
import React from "react"
import ReactDOM from "react-dom"

class Won extends React.Component {
    constructor(props){
      super(props);
    };

 componentDidMount = () => {
    const rect = this.refs.text;

    // to() is a method of `Konva.Node` instances
    rect.to({
      scaleX : 2,
      scaleY : 2,
      x : viewport.width / 2 -50,
      y : viewport.height /2 -30,
      duration : 1.4

    });
  };

  render(){
    return(
      <Group >
                     <Text   x={viewport.width /2 -50}
                             y={-60}
                             ref={"text"}
                             text={"YOU WON!"}
                             fontSize={30}
                             fill={"green"} />
      </Group>
    )}
  };

  class Lost extends React.Component {
      constructor(props){
        super(props);
      };

      componentDidMount = () => {
         const rect = this.refs.text;

         // to() is a method of `Konva.Node` instances
         rect.to({
           scaleX : 2,
           scaleY : 2,
           x : viewport.width / 2 -50,
           y : viewport.height /2 -50,
           duration : 1.4
         });
       };

    render(){
      return(
        <Group >
                       <Text   x={viewport.width / 2 -20}
                               y={-60}
                               ref={"text"}
                               text={"YOU LOST!"}
                               fontSize={30}
                               fill={"green"}
                                />
        </Group>
      )}
    };

    module.exports = {
        Won : Won,
        Lost : Lost
    }
