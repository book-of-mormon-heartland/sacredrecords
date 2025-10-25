import React from 'react';
import { View } from 'react-native';

const Spacer = ({ size = 16, horizontal = false }) => {
  const spacerStyle = horizontal ? { width: size } : { height: size };
  return <View style={spacerStyle} />;
};

export default Spacer;