import React, { Component } from 'react'
import $ from "jquery";
import Menu from '../components/Menu.js'
import ResumeButton from '../components/ResumeButton.js'
import HamburgerMenu from '../components/HamburgerMenu.js'
import LogoMark from '../components/Widgets.js'
import ReactHtmlParser from 'react-html-parser';
import ImgFadeInOnLoad from '../components/ImgFadeInOnLoad.js'

export class BlogPostModalWrapper extends Component {
  constructor(props) {
    super(props);
    console.log('<BlogPostModalWrapper> is constructing');
    this.state = {}
  }

  render() {
    return (
      <div className='blog-modal-wrapper'>
        <BlogPost {...this.props} />
      </div>
    );
  }
}

export default class BlogPost extends Component {
  constructor(props) {
    console.log('\n<BlogPost> class is being constructed');
    super(props);
    this.state = {
      blogTitle: '',
      headerImageURL: '',
      blogContent: ''
    };
  }

  convertStringToHTML = (string) => {
    if(string) {
      var html = string;
      return ReactHtmlParser(html)
    }
  }

  async componentDidMount() {
      console.log('\n<BlogPost> Props');
      console.log(this.props);

      let slug = this.props.blogSlug ? this.props.blogSlug : this.props.match.params.postID;
      let api = 'http://www.greghennessey.com/wp-json/wp/v2/posts?slug=' + slug;
      let data = await(await(fetch(api))).json();

      this.setState({
        headerImageURL: data[0].acf.header_image.url,
        blogTitle: data[0].title.rendered,
        blogContent: data[0].content.rendered,
      })

    $('body, .Page, .App').addClass('noscroll');
  }

  componentWillUnmount() {
    $('body, .Page, .App').removeClass('noscroll');
  }

  backClick = () => {
    if(this.props.handleClosePost) {
      console.log('Closing post');
      this.props.handleClosePost();
    } else {
      console.warn('It appears that no history state has been passed in to the BlogPost component, back will not work');
    }
  }

  render() {
    return(
      <div className='blog-post'>
        <div className='blog-spacer left' onClick={() => this.backClick()}></div>
        <div className='blog-container'>
        <section className='top-section'>
          <div className="page-content">
            <button onClick={this.backClick}>Back</button>
            <ImgFadeInOnLoad className='blog-header-image' src={this.state.headerImageURL} />
            <div className='title-block'>
              <h1>{this.state.blogTitle}</h1>
            </div>
          </div>
        </section>
        <section className='blog-body'>
          {this.convertStringToHTML(this.state.blogContent)}
        </section>
        </div>
        <div className='blog-spacer right' onClick={this.backClick}></div>
      </div>
    )
  }
}
