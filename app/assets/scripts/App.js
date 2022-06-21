import _ from 'lodash';
import '../styles/styles.css';
import 'lazysizes';
import Image from '../images/cityscape.jpg';


function component(){
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  const myIcon = new Image();
  myIcon.src = Icon;

  element.appendChild(myIcon);

  return element;
}

document.body.appendChild(component());

if(module.hot){
  module.hot.accept()
}