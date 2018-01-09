import {Text, Group} from 'react-konva';
import React from "react"
import ReactDOM from "react-dom"

class Won extends React.Component {
    constructor(props){
      super(props);
    };

  render(){
    return(
      <Group >
                     <Text   text={"WON"}
                             fontSize={30}
                             fill={"green"} />
      </Group>
    )}
  };

  class Lost extends React.Component {
      constructor(props){
        super(props);
      };

    render(){
      return(
        <Group >
                       <Text   text={"WON"}
                               fontSize={30}
                               fill={"green"} />
        </Group>
      )}
    };

    module.exports = {
        Won : Won,
        Lost : Lost
    }
