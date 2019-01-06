import React, { Component } from 'react'
import $ from "jquery";
import ReactHtmlParser from 'react-html-parser';
import ImgFadeInOnLoad from '../components/ImgFadeInOnLoad.js'

export class BlogPostModal extends Component {

  backClick = (e) => {
    this.props.history.goBack();
  }

  componentDidMount() {
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
  render() {
    return (
      <div className='blog-no-modal-wrapper'>
        <BlogPost {...this.props} />
      </div>
    )
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
      console.log('\n<BlogPost> Props');
      console.log(this.props);

      let slug = this.parseBlogSlug(this.props);
      let api = 'http://www.greghennessey.com/wp-json/wp/v2/posts?slug=' + slug;
      let data = await(await(fetch(api))).json();

      console.log('\n<BlogPost> Data');
      console.log(data);

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
          <div className="page-content">
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
