'use strict';

const JWTTokenBuilder = require( './builder' );

function builder() {

    return new JWTTokenBuilder();
}

module.exports = {

    builder
};
