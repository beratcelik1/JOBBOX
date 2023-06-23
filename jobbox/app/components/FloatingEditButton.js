import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const FloatingEditButton = ({ onPress }) => {
  return (
      <TouchableOpacity style={styles.floatingSaveButton} onPress={onPress}> 
      <View style = {{flexDirection: 'row'}}>  
        <Icon name="pencil" size={20} color="#ffffff" fontWeight = "600" /> 
        <Text style= {styles.txt}>Edit</Text>
      </View> 
    </TouchableOpacity>
  ); 
  
};

const styles = StyleSheet.create({
  txt: { 
    color: '#fff', 
    marginLeft: 10, 
    fontSize: 18, 
    fontWeight: '600'
  },

  floatingSaveButton: {
    position: 'absolute',
    bottom: 50,
    right: 50,
    width: 140,
    height: 50,
    borderRadius: 35,
    backgroundColor: '#4683fc', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 3.84,
    elevation: 3, 
    marginRight: -20,
  },
});

export default FloatingEditButton;
