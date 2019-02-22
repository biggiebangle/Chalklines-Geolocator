import React, { Component } from 'react';
import { Alert, Text, Button, ScrollView, TextInput, View } from 'react-native';

export default class Basics extends Component {

  constructor(props) {
    super(props);
    this.state = {check:[]};
    this.index = 0;

  }



  

 _onRecordPressButton = () => {
    //add data from here
    let newlyAddedValue = { index: this.index }
  
    this.setState({check: [newlyAddedValue]}, () =>
      {
        this.index = this.index + 1;
      });
  }
_onSavePressButton() {
    Alert.alert('Saving!')
  }
_onClearPressButton() {
    Alert.alert('Erasing!')
  }

  render() {
   
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1, backgroundColor: 'steelblue', justifyContent: "center", alignItems: "center"}}>       
              <Text style={{fontSize:18}}>Tap the button to record a location.</Text>
        </View>

        <View style={{flex: 3, paddingTop: 5, backgroundColor: 'skyblue'}}>
          <ScrollView>

         
            <View style={{flex: 1, color:'black', flexDirection: 'column', alignItems:"stretch" }}>
              <TextInput style={{padding: 5, margin:5, fontSize: 16, backgroundColor:'white'}} placeholder="Type Location" onChangeText={(text) => this.setState({text})} />
              <Text style={{padding: 5, margin:5, fontSize: 16 }}>Coordinates: {this.state.check}</Text>
            </View>

           
          </ScrollView>
        </View>

      <View style={{flex: 1, backgroundColor: 'powderblue', flexDirection: 'column',
        justifyContent: 'space-between'}}>
          <Button
            onPress={this._onRecordPressButton}
            title="Record Location"/>
           <Button
            onPress={this._onSavePressButton}
            title="Save as file to Downloads"
            color="#ffe4c4"/>
          <Button
            onPress={this._onClearPressButton}
            title="Clear Locations"
            color="#ffe4c4"/>
        </View>
      </View>
    );
  }
}





