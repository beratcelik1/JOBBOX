/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './src';
import {jobbox as appName} from './package.json'

AppRegistry.registerComponent(appName, () => App);