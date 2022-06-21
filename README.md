1. npm install webpack webpack-cli --save-dev
2. create a 'dist' folder with index.html and a 'src' folder with index.js 
3. run npx webpack to build
4. in package.json add script "build": "webpack". now npm run build will bundle the code
5. create a webpack.config.js. inside require 'path'. export the configration object(s)