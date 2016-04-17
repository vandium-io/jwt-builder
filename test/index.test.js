'use strict';

/*jshint expr: true*/

const expect = require( 'chai' ).expect;

const index = require( '..' );

describe( 'lib/index', function() {

    describe( '.builder', function() {

        let builder = index.builder();

        expect( builder ).to.exist;
        expect( builder.constructor.name ).to.equal( 'JWTTokenBuilder' );
    });
});
