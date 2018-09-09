import React, { Component } from 'react'

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      display: [],
    };
  }

  getMenuItems() {
    fetch('http://www.greghennessey.com/wp-json/gh/v1/menu_items')
      .then(results => results.json())
      .then(data => {
        this.setState({
          items: data,
        },
        () => (
                this.menuDataIsSet()
              )
        );
      });
  }

  //Callback - When the menu data is set, then build the rendering structure
  //for the menu items so that we have something to iterate through before
  //this is ever called
  menuDataIsSet = () => {
    var menuStruct = [];
    for(var i=0; i < this.state.items.length; i++) {
      menuStruct.push(
        <li key={this.state.items[i].title}>
          <a key={this.state.items[i].ID} href="#" onClick={this.handleClick}>{this.state.items[i].title}</a>
        </li>
      );
    }

    this.setState({
      display: menuStruct,
    });
  }

  handleClick(e) {
    //TODO - Build handling for selecting menu items
    console.log(e);
  }

  componentWillMount() {
    this.getMenuItems();
  }

  render() {
    return(
      <div className="Menu">
        <ul>
          {this.state.display}
        </ul>
      </div>
    );
  }
}
