//User react HTML parser to get HTML out of the json returns from wordpress
import ReactHtmlParser from 'react-html-parser';

export default function convertStringToHTML(string) {
  if(string) {
    var html = string;
    return ReactHtmlParser(html)
  }
}
