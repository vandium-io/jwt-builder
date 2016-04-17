'use strict';

/*jshint expr: true*/

const expect = require( 'chai' ).expect;

const builder = require( '..' );

const jwt = require( 'jwt-simple' );

describe( 'lib/index', function() {

    it( 'without config', function() {

        expect( builder ).to.be.a( 'function' );

        let instance = builder();

        expect( instance.constructor.name ).to.equal( 'JWTTokenBuilder' );
    });

    it( 'with config', function() {

        let token = builder( { algorithm: 'HS256', secret: 'super-secret', user: 'test', exp: 3600 } );

        expect( token ).to.be.a( 'String' );

        let claims = jwt.decode( token, 'super-secret', 'HS256' );

        expect( claims.exp ).to.exist;
        expect( claims.user ).to.equal( 'test' );
    });
});
