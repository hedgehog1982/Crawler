
import React from "react"
import ReactDOM from "react-dom"

class Won extends React.Component {
    constructor(props){
      super(props);
    };

  render(){
    return(
      <div className = {"finalScreen"}  >
        <div>
        <h1>WON!</h1>
        </div>
      </div>
    )}
  };

  class Lost extends React.Component {
      constructor(props){
        super(props);
      };

    render(){
      return(
        <div className={"finalScreen"} >
          <div>
            <h1> LOST!</h1>
           </div>
        </div>
      )}
    };

const LoadScreen = ({loadedImages, amountToLoad}) => {
  return(
        <div >
          <h1>LOADING CONTENT</h1>
          <h1>LOADED</h1>
          <h1>{loadedImages} of {amountToLoad}</h1>
          <h2>How to play</h2>
          <h4>Use the arrow keys or buttons to move</h4>
          <h4>Level up by defeating 4 enemies to get a health boost</h4>
          <h4>Collect Power Ups to increase your Health, defense and Attack</h4>
          <h4>Red Armed enemies are more powerful. Power Up before you attack</h4>
        </div>
 )
}

class PlayerSelect extends React.Component {
    constructor(props){
      super(props);
    };

   handleClick = (player) => {
    this.props.selectAPlayer(player.target.id)
    };


  render(){
    return(
      <div id="playerSelectScreen">
          <h1> PLEASE SELECT PLAYER</h1>
          <div className={"playerPic"}>
            <img onClick={this.handleClick} id="finn" src="./imgs/finncrop.jpg" />
            <img onClick={this.handleClick} id="jake" src="./imgs/JakeGrowlingcrop.jpg" />


          </div>
      </div>
    )}
  };


    module.exports = {
        Won : Won,
        Lost : Lost,
        LoadScreen : LoadScreen,
        PlayerSelect : PlayerSelect
    }
