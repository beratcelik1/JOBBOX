import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const FloatingEditButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.floatingEditButton} onPress={onPress}>
      <Icon name="pencil" size={30} color="#ffffff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingEditButton: {
    position: 'absolute',
    bottom: 50,
    right: 50,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4683fc',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default FloatingEditButton;
