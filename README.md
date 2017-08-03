# react-native-navigator-select

## Getting Started

```javascript
import BottomSelect, { SCREEN_NAME } from './components/select';

Navigation.registerComponent(SCREEN_NAME, () => BottomSelect);


// ... somewhere in some component

import { openSelect } from '../components/select';

import {openSelect} from 'react-native-navigator-select'
// call me to open sheet
function onClick(data=[]){
  openSelect({
      name: 'search drs', //placehodler for filter textInput
      id: 'id', //property name for Key | can be function
      value: 'body', //property for Select item | can be function
      data,
      renderItem: false, // function return react element
      onChange: console.log, // function called when selecting element
    }/*, passProps, styles*/);
  }
}

```
