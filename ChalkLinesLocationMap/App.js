import React, { Component } from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Image,
  Alert,
  Dimensions,
  LayoutAnimation,
  UIManager
} from 'react-native';
import { Constants, Location, Permissions, FileSystem } from 'expo';

const width = Dimensions.get('window').width;

class Item extends Component {


  constructor() {
    super();
    this.animatedValue = new Animated.Value(0);

    if( Platform.OS === 'android' ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.item.id !== this.props.item.id) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    Animated.timing(
      this.animatedValue,
      {
        toValue: 0.5,
        duration: 500,
        useNativeDriver: true
      }
    ).start(() => {
      this.props.afterAnimationComplete();
    });
  }

  removeItem = () => {
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }
    ).start(() => {
      this.props.removeItem(this.props.item.id);//
    });
  }

  render() {
    const translateAnimation = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-width, 0, width]
    });

    const opacityAnimation = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 0]
    });

    return (
      <Animated.View style={[
        styles.viewHolder, {
          transform: [{ translateX: translateAnimation}],
          opacity: opacityAnimation
        }]}
      >
        <Text
          style={styles.text}>
            SiteLocation {this.props.item.text}:{this.props.item.location}
        </Text>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={this.removeItem}
        >
          <Image
            source={require('./assets/images/add.png')}
            style={styles.removeIcon}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

export default class App extends Component {
  constructor() {
    super();
    this.state = { locationArray: [], disabled: false,coords: null, errorMessage: null,
    };
    this.addNewEle = false;
    this.index = 0;
  }
  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };
  afterAnimationComplete = () => {
    this.index += 1;
    this.setState({ disabled: false });
  }


//
  bbsaveCSV(){
    
  const path = FileSystem.documentDirectory + 'test'
    return FileSystem.getInfoAsync(path).then(({exists}) => {
      if (!exists) {
        return FileSystem.makeDirectoryAsync(path)
      } else {
        return Promise.resolve(true)
      }
    })
  
}
//stored? 
async saveCSV() {
  try {
      let documentDirectory = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
      
      console.log('document: ', documentDirectory)
    } catch (err) {
      console.error(err)
    }
  }



  addMore = () => {
    this._getLocationAsync();
    this.addNewEle = true;
    let coords = 'Waiting..';
    if (this.state.errorMessage) {
      coords = this.state.errorMessage;
    } else if (this.state.location) {
      coords = JSON.stringify(this.state.location);
    }
    const newlyAddedLocation= { id: "id_" + this.index, text: this.index + 1, location:coords};//
    this.setState({
      disabled: true,
      locationArray: [...this.state.locationArray, newlyAddedLocation]
    });
  }

  remove(id) {
    this.addNewEle = false;//
    const newArray = [...this.state.locationArray];
    newArray.splice(newArray.findIndex(ele => ele.id === id), 1);

    this.setState(() => {
      return {
        locationArray: newArray
      }
    }, () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          ref={scrollView => this.scrollView = scrollView}
          onContentSizeChange={()=> {        
            this.addNewEle && this.scrollView.scrollToEnd();
          }}
        >
          <View style={{ flex: 1, padding: 4 }}>
            {this.state.locationArray.map(ele => {
              return (
                <Item
                  key={ele.id}//
                  item={ele}//
                  removeItem={(id) => this.remove(id)}
                  afterAnimationComplete={this.afterAnimationComplete}
                />
              )
            })}
          </View>
        </ScrollView>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.saveBtn}
          disabled={this.state.disabled}
          onPress={this.saveCSV}
        >
          <Image source = { require('./assets/images/save.png') } style = { styles.btnImage }/>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.btn}
          disabled={this.state.disabled}
          onPress={this.addMore}
        >
          <Image source = { require('./assets/images/add.png') } style = { styles.btnImage }/>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    justifyContent: 'center',
    paddingTop: 20
  },

  viewHolder: {
    paddingVertical: 15,
    backgroundColor: '#B00020',
    justifyContent: 'center',
    alignItems: 'flex-start',
    margin: 4,
    paddingLeft: 15,
    borderRadius: 10
  },

  text: {
    color: 'white',
    fontSize: 12,
    paddingRight: 17
  },

saveBtn: {
    position: 'absolute',
    left: 25,
    bottom: 25,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15
  },

  btn: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15
  },

  btnImage: {
    resizeMode: 'contain',
    width: '100%',
    tintColor: 'white'
  },

  removeBtn: {
    position: 'absolute',
    right: 13,
    width: 25,
    height: 25,
    borderRadius: 15,
    padding: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },

  removeIcon: {
    width: '100%',
    transform: [{ rotate: '45deg' }],
    resizeMode: 'contain'
  }
});