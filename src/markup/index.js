import './scss/index.scss';

const __svg__ = { path: './sprite/sprite_svgs/**/*.svg', filename: './sprite/svgstore_generated/[hash].svg' };
require('../../src/helpers/svgxhr')(__svg__);
