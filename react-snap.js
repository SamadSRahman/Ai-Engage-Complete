import { build } from 'react-snap/scripts';

const options = {
  source: 'src', // The source directory for your React application
  distDirectory: 'build', // The target directory for the pre-rendered files
  // Additional options if needed
};

build(options);