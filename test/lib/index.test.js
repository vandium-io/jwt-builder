'use strict';

/*jshint expr: true*/

const expect = require( 'chai' ).expect;

const index = require( '../../lib' );

const jwt = require( 'jwt-simple' );

describe( 'lib/index', function() {

    describe( '.builder', function() {

        it( 'without config', function() {

            let builder = index.builder();

            expect( builder ).to.exist;
            expect( builder.constructor.name ).to.equal( 'JWTTokenBuilder' );
        });

        it( 'with config', function() {

            let token = index.builder( { algorithm: 'HS256', secret: 'super-secret', user: 'test', exp: 3600 } );

            expect( token ).to.be.a( 'String' );

            let claims = jwt.decode( token, 'super-secret', 'HS256' );

            expect( claims.exp ).to.exist;
            expect( claims.user ).to.equal( 'test' );
        });
    });
});
