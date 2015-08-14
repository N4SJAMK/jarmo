#!/bin/bash

browserify src/index.js -o index.js && uglifyjs index.js -c > index.min.js
sass src/index.sass:index.css && postcss --use autoprefixer -o index.css index.css

