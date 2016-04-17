'use strict';

/*jshint expr: true*/

const expect = require( 'chai' ).expect;

const builder = require( '..' );

describe( 'lib/index', function() {

    it( 'builder', function() {

        expect( builder ).to.be.a( 'function' );

        let instance = builder();

        expect( instance.constructor.name ).to.equal( 'JWTTokenBuilder' );
    });
});
