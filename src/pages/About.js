import React, { Component } from 'react'
import ResumeButton from '../components/ResumeButton.js'
import HamburgerMenu from '../components/HamburgerMenu.js'
import LogoMark from '../components/Widgets.js'
import ImgFadeInOnLoad from '../components/ImgFadeInOnLoad.js'
import convertStringToHTML from '../components/Helpers.js'

//Pass this slug in to get the specific page data I am looking for
const PAGE_ID = 21;

export default class About extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      backgroundImage: '',
      secondaryBGImage: '',
      pageContent: '',
    };
  }

  componentWillMount() {
    this.getPageData(PAGE_ID);

    //Get Link ACF Items
    //https://github.com/airesvsg/acf-to-rest-api
    fetch('http://www.greghennessey.com/wp-json/acf/v3/pages/' + PAGE_ID)
      .then(results => results.json())
      .then(data => {
        if(data) {
          this.setState({
            linkData: data.acf.link_item
          },
          () => (
                  this.buildLinkContent()
                )
        );
        }
      })
  }

  //Once link data is grabbed, let's get the data and build the HTML content
  //structure

  buildLinkContent = () => {
    //console.log(this.state.linkData);
    var linkContent = [];
    for(var i=0; i < this.state.linkData.length; i++) {
      console.log('---- Link Data ' + i + ' ------');
      console.log(this.state.linkData[i]);
      let linkData = this.state.linkData[i];
      linkContent.push(
        <div key={'link-'+i} className={'about-link-container '+ 'container-'+i}>
          <a href={linkData.link_url}>
          <div className='link-row-1'>
            <div className={'link-image ' + 'image-'+i}>
              <ImgFadeInOnLoad className='blog-header-image' src={linkData.link_image} />
            </div>
            <div className={'link-title ' + 'link-title-'+i}>
              <h2>{linkData.link_title}</h2>
            </div>
          </div>
          <div className='link-row-2'>
            {linkData.link_url_text}
          </div>
          </a>
        </div>
      );
    }
    this.setState({
      linkContent: linkContent,
    });
  }

  //Overwrite this callback from Page.getPageData to get the data I need for
  //this specific page
  pageDataIsSet = () => {
    //Set the states
    this.setState({
      title: this.state.pageData.page_header,
      backgroundImage: this.state.pageData.background_image.url,
      secondaryBGImage: this.state.pageData.secondary_bg_image.url,
      logoImage: this.state.pageData.logo_image.url,
      pageContent: this.state.pageData.content.rendered,
    });
  }
//style={{ backgroundImage: `url(${this.state.secondaryBGImage})` }}
  render() {
    return(
      <div className="About Page" style={{ backgroundImage: `url(${this.state.backgroundImage})` }}>
        <section className='left-section'>
          <LogoMark title={this.state.title} logo={this.state.logoImage} styleType='horizontal'/>
          <div className="page-content">
            <ImgFadeInOnLoad className='bg-image' src={this.state.secondaryBGImage} />
          </div>
        </section>
        <section className='right-section'>
          <div className='page-content'>
            {convertStringToHTML(this.state.pageContent)}
            <div className='about-links'>
            {this.state.linkContent}
            </div>
          </div>
        </section>
        <ResumeButton />
        <HamburgerMenu />
      </div>

    )
  }
}
