import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import Menu from '../components/Menu.js'
import ResumeButton from '../components/ResumeButton.js'
import HamburgerMenu from '../components/HamburgerMenu.js'
import LogoMark from '../components/Widgets.js'
import $ from "jquery";
import ReactHtmlParser from 'react-html-parser';

const LoremIpsum = () => {
  return(
  <div>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet est non nunc vehicula sagittis. Vivamus arcu tellus, rutrum id convallis ut, finibus et velit. Phasellus bibendum, erat vel tempus luctus, mi est feugiat sapien, non varius nisi ipsum ut turpis. Suspendisse pellentesque aliquam interdum. Aliquam egestas magna enim, eget condimentum dolor ullamcorper commodo. Cras blandit mauris mauris, in posuere dolor ullamcorper nec. Praesent pellentesque diam ut ligula dapibus, et porta neque mollis. Curabitur quam ex, maximus at euismod in, feugiat nec risus. Quisque scelerisque sed tellus pretium elementum. Morbi finibus accumsan orci, ac dignissim turpis pulvinar sed. Maecenas eu urna non elit tincidunt feugiat. Aenean nibh ante, sollicitudin et felis sit amet, euismod dictum odio.
    </p>
    <p>
      Aenean eu sagittis dui, ut pretium mi. Duis eget neque ex. Morbi tincidunt porttitor augue, ut iaculis odio viverra quis. Donec egestas ultrices vestibulum. Phasellus interdum nisl ut risus dictum, eget pharetra mauris commodo. Maecenas placerat velit sed ex malesuada luctus. Integer eu vulputate metus, at tristique leo. Nunc nec ante aliquam, egestas quam elementum, blandit enim. Duis dictum dictum enim, a ultrices lectus tincidunt ac.
    </p>
    <p>
      Donec metus enim, imperdiet non commodo sed, tincidunt sed quam. Suspendisse arcu ex, ultrices eget velit nec, tincidunt molestie nisi. Ut eu scelerisque velit. Donec arcu erat, consequat id semper vitae, maximus ut urna. Phasellus eget nisi sit amet tellus semper convallis. Vestibulum diam ante, fermentum sit amet risus eu, lacinia mattis ligula. Phasellus est turpis, convallis sed fermentum nec, molestie id odio. Curabitur vitae leo sodales, interdum justo quis, volutpat nunc. Proin vulputate, ex non volutpat porta, ex tortor semper risus, ullamcorper pellentesque velit arcu quis mauris. Praesent a nibh rutrum, tempus lectus et, vestibulum nulla. Aenean vehicula eros tincidunt tortor vestibulum, quis tristique elit ultrices. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris tincidunt enim nec lorem tempus feugiat. Proin tristique lectus erat, ac feugiat elit lacinia eget. Phasellus placerat, orci quis posuere placerat, dui orci aliquet nisi, et elementum leo tortor non lorem. Morbi erat orci, maximus at turpis auctor, lacinia suscipit massa.
    </p>
    <p>
      Nullam scelerisque varius turpis vitae venenatis. Curabitur ultrices venenatis facilisis. Vestibulum iaculis tincidunt elit et eleifend. Sed imperdiet, nunc vel volutpat vestibulum, lectus ex imperdiet erat, posuere rhoncus enim nunc vitae nulla. Integer laoreet nisl at semper varius. Maecenas placerat nisi sit amet dolor lacinia facilisis. Curabitur velit quam, faucibus vel accumsan vitae, egestas ut turpis. Quisque nec nibh in nisl laoreet pellentesque. Vestibulum nec libero ut ex tempor pellentesque. Cras non tempor ante. Duis laoreet enim sed erat varius, a dictum libero volutpat. Praesent bibendum, quam vitae elementum molestie, odio mi suscipit velit, et porta nunc dui egestas lectus. In a purus vel orci convallis tincidunt id non lectus. Integer id lacinia nulla. In volutpat dui elit, sed finibus elit dictum ut. Donec vitae faucibus nisi, in commodo tellus.
    </p>
    <p>
      Sed turpis nisi, vulputate ultrices viverra at, vulputate semper nunc. Duis non lacinia odio. Nunc elit mi, porta at maximus ac, maximus ut diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eu tincidunt felis. Phasellus vitae libero eleifend nisi posuere malesuada. Praesent mattis pulvinar lorem sit amet sodales.
    </p>
  </div>
  )
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

  componentWillMount () {
    if(this.props.postSlug) {
      this.fetchPostData(this.props.postSlug);
    } else {
      console.warn('Post ID was not received, so data cannot be fetched');
    }
    $('body, .Page, .App').addClass('noscroll');
  }

  componentDidMount() {
    $('.blog-container').addClass('trans-in');
  }

  componentWillUnmount() {
    $('body, .Page, .App').removeClass('noscroll');
  }

  fetchPostData(postSlug) {
    let api = 'http://www.greghennessey.com/wp-json/wp/v2/posts?slug='+postSlug;
    fetch(api)
      .then(results => results.json())
      .then(data => {
        if(data) {
          this.setState({
            headerImageURL: data[0].acf.header_image.url,
            blogTitle: data[0].title.rendered,
            blogContent: data[0].content.rendered,
          })
        }
      });
  }

  buildBlogContent = (data) => {

  }

  backClick = () => {
    if(this.props.history) {
      this.props.history.goBack();
    } else {
      console.warn('It appears that no history state has been passed in to the BlogPost component, back will not work');
    }
  }

  render() {
    return(
      <div className='blog-post'>
        <div className='blog-spacer left' onClick={this.backClick}></div>
        <div className='blog-container'>
        <section className='top-section' style={{ backgroundImage: `url(${this.state.headerImageURL})` }}>
          <div className="page-content">
            <button onClick={this.backClick}>Back</button>
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
