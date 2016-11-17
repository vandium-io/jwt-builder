'use strict';

/*jshint expr: true*/

const expect = require( 'chai' ).expect;

const keypair = require( 'keypair' );

const temp = require( 'temp' ).track();

const fs = require( 'fs' );

const JWTTokenBuilder = require( '../../lib/builder' );

const jwt = require( 'jwt-simple' );

describe( 'lib/builder', function() {

    describe( 'JWTTokenBuilder', function() {

        describe( 'constructor', function() {

            it( 'without config', function() {

                let builder = new JWTTokenBuilder();

                expect( builder._algorithm ).to.equal( 'HS256' );
                expect( builder._claims ).to.eql( {} );
            });

            // should work with any algorithm
            [
                'HS256', 'HS384', 'HS512'

            ].forEach( function( algorithm ) {

                it( 'from config, iat = true, nbf = true, algorithm: ' + algorithm, function() {

                    let config = {

                        algorithm,
                        iat: true,
                        nbf: true,
                        secret: 'super-secret',
                        iss: 'https://auth.vandium.io',
                        headers: {

                            kid: '2016-11-17'
                        },
                        exp: 3600
                    };


                    let builder = new JWTTokenBuilder( config );

                    expect( builder._algorithm ).to.equal( algorithm );
                    expect( builder._secret ).to.equal( 'super-secret' );

                    expect( builder._iat ).to.equal( 0 );
                    expect( builder._iat_relative ).to.equal( true );

                    expect( builder._nbf ).to.equal( 0 );
                    expect( builder._nbf_relative ).to.equal( true );

                    expect( builder._exp ).to.equal( 3600 );

                    expect( builder._claims ).to.eql( { iss: 'https://auth.vandium.io' } );

                    expect( builder._headers ).to.eql( { kid: '2016-11-17' } );
                });

                it( 'from config, iat = false, nbf = false, algorithm: ' + algorithm, function() {

                    let config = {

                        algorithm,
                        iat: false,
                        nbf: false,
                        secret: 'super-secret',
                        iss: 'https://auth.vandium.io',
                        headers: {

                            kid: '2016-11-17'
                        },
                        exp: 3600
                    };


                    let builder = new JWTTokenBuilder( config );

                    expect( builder._algorithm ).to.equal( algorithm );
                    expect( builder._secret ).to.equal( 'super-secret' );

                    expect( builder._iat ).to.not.exist;
                    expect( builder._nbf ).to.not.exist;

                    expect( builder._exp ).to.equal( 3600 );

                    expect( builder._claims ).to.eql( { iss: 'https://auth.vandium.io' } );

                    expect( builder._headers ).to.eql( { kid: '2016-11-17' } );
                });

                it( 'from config, algorithm: ' + algorithm, function() {

                    let config = {

                        algorithm,
                        iat: Math.floor( Date.now() / 1000 ),
                        nbf: Math.floor( Date.now() / 1000 ),
                        secret: 'super-secret',
                        iss: 'https://auth.vandium.io',
                        headers: {

                            kid: '2016-11-17'
                        },
                        exp: 3600
                    };

                    let builder = new JWTTokenBuilder( config );

                    expect( builder._algorithm ).to.equal( algorithm );
                    expect( builder._secret ).to.equal( 'super-secret' );

                    expect( builder._iat).to.equal( config.iat );
                    expect( builder._nbf ).to.equal( config.nbf );
                    expect( builder._exp ).to.equal( 3600 );

                    expect( builder._claims ).to.eql( { iss: 'https://auth.vandium.io' } );

                    expect( builder._headers ).to.eql( { kid: '2016-11-17' } );
                });
            });

            it( 'from config, algorithm: RS256', function() {

                let privateKey = keypair( { bits: 1024 } ).private;

                let config = {

                    algorithm: 'RS256',
                    iat: Math.floor( Date.now() / 1000 ),
                    nbf: Math.floor( Date.now() / 1000 ),
                    privateKey,
                    iss: 'https://auth.vandium.io',
                    headers: {

                        kid: '2016-11-17'
                    },
                    exp: 3600
                };

                let builder = new JWTTokenBuilder( config );

                expect( builder._algorithm ).to.equal( 'RS256' );
                expect( builder._key ).to.equal( privateKey );

                expect( builder._iat).to.equal( config.iat );
                expect( builder._nbf ).to.equal( config.nbf );
                expect( builder._exp ).to.equal( 3600 );

                expect( builder._claims ).to.eql( { iss: 'https://auth.vandium.io' } );

                expect( builder._headers ).to.eql( { kid: '2016-11-17' } );
            });
        });

        describe( '.claims', function() {

            [
                [ 'valid claims object', { iss: 'here' }, { iss: 'here' } ],
                [ 'null claims object', null, {} ],
                [ 'missing claims object', undefined, {} ]

            ].forEach( function( testCase ) {

                it( testCase[0], function() {

                    let builder = new JWTTokenBuilder();

                    let retValue = builder.claims( testCase[1] );

                    expect( retValue ).to.equal( builder );
                    expect( builder._claims ).to.eql( testCase[2] );
                });
            });
        });

        describe( '.headers', function() {

            [
                [ 'valid headers object', { kid: '123' }, { kid: '123' } ],
                [ 'null headers object', null, {} ],
                [ 'missing headers object', undefined, {} ]

            ].forEach( function( testCase ) {

                it( testCase[ 0 ], function() {

                    let builder = new JWTTokenBuilder();

                    let retValue = builder.headers( testCase[ 1 ] );

                    expect( retValue ).to.equal( builder );
                    expect( builder._headers ).to.eql( testCase[ 2 ] );
                });
            });
        });

        describe( '.algorithm', function() {

            [
                'HS256', 'HS384', 'HS512', 'RS256'

            ].forEach( function( type ) {

                it( 'algorithm: ' + type, function() {

                    let builder = new JWTTokenBuilder();

                    let retValue = builder.algorithm( type );

                    expect( retValue ).to.equal( builder );
                    expect( builder._algorithm ).to.equal( type );
                });
            });

            it( 'fail: when algorithm is unknown', function() {

                let builder = new JWTTokenBuilder();

                expect( builder.algorithm.bind( builder, 'HS1024' ) ).to.throw( 'unknown algorithm' );
            });
        });

        describe( '.secret', function() {

            // should work with any algorithm
            [
                'HS256', 'HS384', 'HS512', 'RS256'

            ].forEach( function( type ) {

                it( 'setting with algorithm: ' + type, function() {

                    let builder = new JWTTokenBuilder();

                    builder.algorithm( type );

                    let retValue = builder.secret( 'super-secret' );

                    expect( retValue ).to.equal( builder );
                    expect( builder._secret ).to.exist;
                    expect( builder._secret ).to.equal( 'super-secret' );
                });
            });
        });

        describe( '.privateKey', function() {

            let privateKey;

            before( function() {

                privateKey = keypair( { bits: 1024 } ).private;
            });

            // should work with any algorithm
            [
                'HS256', 'HS384', 'HS512', 'RS256'

            ].forEach( function( type ) {

                it( 'setting with algorithm: ' + type, function() {

                    let builder = new JWTTokenBuilder();

                    builder.algorithm( type );

                    let retValue = builder.privateKey( privateKey );

                    expect( retValue ).to.equal( builder );
                    expect( builder._key ).to.exist;
                    expect( builder._key ).to.equal( privateKey );
                });
            });
        })

        describe( '.privateKeyFromFile', function() {

            let privateKey;

            let privateKeyPath;

            before( function( done ) {

                privateKey = keypair( { bits: 1024 } ).private;

                temp.open('priv-key', function( err, info ) {

                    if( err ) {

                        return done( err );
                    }

                    privateKeyPath = info.path;

                    fs.writeFileSync( privateKeyPath, privateKey );

                    done();
                });
            });

            // should work with any algorithm
            [
                'HS256', 'HS384', 'HS512', 'RS256'

            ].forEach( function( type ) {

                it( 'setting with algorithm: ' + type, function() {

                    let builder = new JWTTokenBuilder();

                    builder.algorithm( type );

                    let retValue = builder.privateKeyFromFile( privateKeyPath );

                    expect( retValue ).to.equal( builder );
                    expect( builder._key ).to.exist;
                    expect( builder._key.constructor.name ).to.equal( 'Buffer' );
                    expect( builder._key.toString() ).to.equal( privateKey );
                });
            });
        });

        [
            'iat',
            'nbf'
        ].forEach( function( offsetType ) {

            let builderVar = '_' + offsetType;

            describe( '.' + offsetType, function() {

                it( 'without value', function() {

                    let before = Math.floor( Date.now() / 1000 );

                    let builder = new JWTTokenBuilder();

                    let retValue = builder[ offsetType ]();

                    let after = Math.floor( Date.now() / 1000 );

                    expect( retValue ).to.equal( builder );
                    expect( builder[ builderVar ] ).to.exist;
                    expect( builder[ builderVar ] ).to.equal( 0 );
                    expect( builder[ builderVar + '_relative' ] ).to.be.true;
                });

                it( 'with negative value', function() {

                    let before = Math.floor( Date.now() / 1000 ) - 42;

                    let builder = new JWTTokenBuilder();

                    let retValue = builder[ offsetType ]( -42 );

                    let after = Math.floor( Date.now() / 1000 ) - 42;

                    expect( retValue ).to.equal( builder );

                    expect( builder[ builderVar ] ).to.exist;
                    expect( builder[ builderVar ] ).to.equal( -42 );
                    expect( builder[ builderVar + '_relative' ] ).to.be.true;
                });

                it( 'with value', function() {

                    let now = Math.floor( Date.now() / 1000 );

                    let builder = new JWTTokenBuilder();

                    let retValue = builder[ offsetType ]( now );

                    expect( retValue ).to.equal( builder );

                    expect( builder[ builderVar ] ).to.equal( now );
                    expect( builder[ builderVar + '_relative' ] ).to.be.false;
                });
            });
        });

        describe( '.exp', function() {

            it( 'without iat being set', function() {

                let before = Math.floor( Date.now() / 1000 ) + 42;

                let builder = new JWTTokenBuilder();

                let retValue = builder.exp( 42 );

                let after = Math.floor( Date.now() / 1000 ) + 42;

                expect( retValue ).to.equal( builder );

                expect( builder._exp ).to.exist;
                expect( builder._exp ).to.equal( 42 );
            });
        });

        describe( '.build', function() {

            [
                'HS256', 'HS384', 'HS512'

            ].forEach( function( algorithm ) {

                it( 'with algorithm: ' + algorithm, function() {

                    let token = new JWTTokenBuilder()
                        .claims( { iss: 'https://auth.vandium.io' } )
                        .headers( { kid: '2016-11-17' } )
                        .iat( Date.now() )
                        .nbf()
                        .exp( 100 )
                        .algorithm( algorithm )
                        .secret( 'super-secret' )
                        .build();

                    let claims = jwt.decode( token, 'super-secret', algorithm );

                    expect( claims.iat ).to.exist;
                    expect( claims.exp ).to.exist;
                    expect( claims.iss ).to.equal( 'https://auth.vandium.io' );

                    let headers = JSON.parse( new Buffer( token.split( '.')[0], 'base64' ).toString() );

                    expect( headers.kid ).to.equal( '2016-11-17' );
                });
            });

            it( 'with algorithm: RS256', function() {

                let kp = keypair( { bits: 1024 } );

                let token = new JWTTokenBuilder()
                    .claims( { iss: 'https://auth.vandium.io' } )
                    .headers( { kid: '2016-11-17' } )
                    .iat()
                    .exp( 100 )
                    .algorithm( 'RS256' )
                    .privateKey( kp.private )
                    .build();

                let claims = jwt.decode( token, kp.public, 'RS256' );

                expect( claims.iat ).to.exist;
                expect( claims.exp ).to.exist;
                expect( claims.iss ).to.equal( 'https://auth.vandium.io' );

                let headers = JSON.parse( new Buffer( token.split( '.')[0], 'base64' ).toString() );

                expect( headers.kid ).to.equal( '2016-11-17' );
            });

            [
                'HS256', 'HS384', 'HS512', 'RS256'

            ].forEach( function( algorithm ) {

                it( 'fail: when secret/key not set, algorithm: ' + algorithm, function() {

                    let builder = new JWTTokenBuilder()
                        .claims( { iss: 'https://auth.vandium.io' } )
                        .headers( { kid: '2016-11-17' } )
                        .iat()
                        .exp( 100 )
                        .algorithm( algorithm );

                    expect( builder.build.bind( builder ) ).to.throw( 'missing' );
                });
            });
        });
    });
});
