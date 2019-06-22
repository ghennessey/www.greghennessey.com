import React, { Component } from 'react'
import { Link } from "react-router-dom";
import { connect } from 'react-redux'

import { fetchMenuItems } from '../store/actions/menuActions'

class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      display: [],
    };
  }

  componentWillMount() {
    this.props.fetchMenuItems();
  }

  render() {
    return(
    <ul className={this.props.vertical ? "nav menu flex-column" : "nav menu"}>
        {this.props.menu.data.menuItems ? this.props.menu.data.menuItems.map(item => {
          const { url, title } = item;
          return [
            <li key={title} className="nav-item">
              <Link className="nav-link" to={url}>{title}</Link>
            </li>
          ]
        }) : null}
      </ul>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    menu: state.menu
  } 
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMenuItems: (url) => dispatch(fetchMenuItems(url)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)