import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';

const LoadingScreen = ({ isLoading }) => (
  <Modal
    transparent={true}
    animationType={'none'}
    visible={isLoading}
    onRequestClose={() => {console.log('close modal')}}>
    <View style={styles.modalBackground}>
      <View style={styles.activityIndicatorWrapper}>
        <ActivityIndicator animating={isLoading} size="large" color="#0000ff" />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000030'
  },
  activityIndicatorWrapper: {
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});

export default LoadingScreen;
