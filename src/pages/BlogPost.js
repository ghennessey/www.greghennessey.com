import React, { Component } from 'react'
import $ from "jquery";
import ReactHtmlParser from 'react-html-parser';
import ImgFadeInOnLoad from '../components/ImgFadeInOnLoad.js'

const PAGE_ID = 87;

export class BlogPostModal extends Component {

  backClick = (e) => {
    this.props.history.goBack();
  }

  render() {
    return (
      <div className='blog-modal-wrapper'>
        <BlogPost {...this.props}>
          <button className='back-button' onClick={this.backClick}>Back</button>
        </BlogPost>
      </div>
    );
  }
}

export class BlogPostNoModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      background_image: undefined,
    };
  }

  async componentDidMount() {
    const { background_image } = await(await(fetch('http://www.greghennessey.com/wp-json/wp/v2/pages/' + PAGE_ID))).json();

    this.setState({
      background_image: background_image.url
    });
  }

  render() {
    return (
      <div className='blog-no-modal-wrapper' style={{ backgroundImage: `url(${this.state.background_image})` }}>
        <BlogPost {...this.props} />
      </div>
    )
  }
}

export default class BlogPost extends Component {
  constructor(props) {
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

  parseBlogSlug = ({ location, match }) => {
    const urlPrefix = match.url + '/';
    let slug = location.pathname.slice(urlPrefix.length, location.pathname.length);
    return slug
  }

  backClick = (e) => {
    let {history} = this.props
    console.log(history);
    if(history.action !== "POP") {
      history.goBack();
    }
  }

  async componentDidMount() {
      console.log('\n<BlogPost> Mounted. <BlogPost> Props: ', this.props);

      let slug = this.parseBlogSlug(this.props);
      let api = 'http://www.greghennessey.com/wp-json/wp/v2/posts?slug=' + slug;
      let data = await(await(fetch(api))).json();

      console.log('\n<BlogPost> Data', data);

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

  render() {
    let { children } = this.props;

    return(
      <div className='blog-post'>
        <div className='blog-spacer left' onClick={this.backClick}></div>
        <div className='blog-container'>
        <section className='top-section'>
          {children}
          <ImgFadeInOnLoad className='blog-header-image' src={this.state.headerImageURL} />
          <div className='title-block'>
            <h1>{this.state.blogTitle}</h1>
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
