import React, { Component } from 'react'
import Menu from '../components/Menu.js'
import ResumeButton from '../components/ResumeButton.js'
import LogoMark from '../components/Widgets.js'
import convertStringToHTML from '../components/Helpers.js'

//Pass this slug in to get the specific page data I am looking for
const PAGE_ID = 10;

//Home Page component
//Later I want to break this down into a component specifically for home
//and a component for Pages that Home extends
export default class Home extends Component {

  constructor() {
    super();
    this.state = {
      title: '',
      backgroundImage: '',
      pageContent: '',
    };
  }

  async componentDidMount() {
    const pageData = await (await fetch('http://www.greghennessey.com/wp-json/wp/v2/pages/' + PAGE_ID)).json();

    this.setState({
      title: pageData.page_header,
      backgroundImage: pageData.background_image.url,
      logoImage: pageData.logo_image.url,
      pageContent: pageData.content.rendered,
    });
  }

  render() {
    return (
      <div className="Home Page" style={{ backgroundImage: `url(${this.state.backgroundImage})` }}>
        <div className="nav-container">
          <LogoMark title={this.state.title} logo={this.state.logoImage} styleType='centered'/>
          <Menu />
        </div>
        <div className="page-content">
          {convertStringToHTML(this.state.pageContent)}
        </div>
        <ResumeButton />
      </div>
    )
  }
}
