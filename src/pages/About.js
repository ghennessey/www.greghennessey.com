import React, { Component } from 'react'
import { connect } from 'react-redux'

import ResumeButton from '../components/ResumeButton.js'
import HamburgerMenu from '../components/HamburgerMenu.js'
import LogoMark from '../components/LogoMark.js'
import ImgFadeInOnLoad from '../components/ImgFadeInOnLoad.js'
import convertStringToHTML from '../components/Helpers.js'

import { startAboutFetch } from '../store/actions/aboutActions'

//Pass this slug in to get the specific page data I am looking for
const PAGE_ID = 21;

class About extends Component {
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
    if(!this.props.about.ui.aboutPageInitialized) {
      this.props.startAboutFetch();
    }
  }

  async componentDidMount() {
    let api_Final = 'http://www.greghennessey.com/wp-json/wp/v2/pages/' + PAGE_ID
    const pageData = await(await(fetch(api_Final))).json();

    // console.log('Page Data', pageData);

    this.setState({
      linkData: pageData.acf.link_item
    });

    this.buildLinkContent();

    this.setState({
      title: pageData.acf.page_header,
      backgroundImage: pageData.acf.background_image.url,
      secondaryBGImage: pageData.acf.secondary_bg_image.url,
      logoImage: pageData.acf.logo_image.url,
      pageContent: pageData.content.rendered,
    });
  }

  //Once link data is grabbed, let's get the data and build the HTML content
  //structure

  buildLinkContent = () => {
    var linkContent = [];
    for(var i=0; i < this.state.linkData.length; i++) {
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
    //console.log(this.props.about);
    const { backgroundImage, pageContent, secondaryBgImage } = this.props.about.data;
    return(
      <div className="container-fluid page-about background-repeat">
        <div className='row h-100'>
          <div className="col-md-6 px-0 mx-0 left-side d-none d-sm-block" style={{ backgroundImage: `url(${secondaryBgImage})` }}>
            <LogoMark className='horizontal top-left mt-3 ml-3'/>
          </div>
          <div className="col-md-6 right-side d-flex align-items-center">
            <div className='page-content container px-0 px-sm-5 pt-5 py-3 py-md-0'>
              {convertStringToHTML(pageContent)}
              <div className='about-links'>
                {this.state.linkContent}
              </div>
            </div>
          </div>
        </div>
        {/* <ResumeButton /> */}
        <HamburgerMenu {...this.props.match} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    about: state.about,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    startAboutFetch: () => dispatch(startAboutFetch()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(About)