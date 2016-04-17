'use strict';

const fs = require( 'fs' );

const jwt = require( 'jwt-simple' );

const ALGORITHM_HS256 = 'HS256';
const ALGORITHM_HS384 = 'HS384';
const ALGORITHM_HS512 = 'HS512';
const ALGORITHM_RS256 = 'RS256';

function nowInSeconds() {

    return Math.floor( Date.now() / 1000 );
}

function offsetTimeValue( value ) {

    if( !value ) {

        value = nowInSeconds();
    }
    else if( value < 0 ) {

        value = Math.floor( nowInSeconds() + value );
    }
    else {

        value = Math.floor( value );
    }

    return value;
}

function addClaim( claims, name, value ) {

    if( value ) {

        claims[ name ] = value;
    }
}

class JWTTokenBuilder {

    constructor() {

        this._algorithm = ALGORITHM_HS256;
        this._claims = {};
    }

    claims( userClaims ) {

        this._claims = Object.assign( {}, userClaims );

        return this;
    }

    algorithm( alg ) {

        switch( alg ) {

            case ALGORITHM_HS256:
            case ALGORITHM_HS384:
            case ALGORITHM_HS512:
            case ALGORITHM_RS256:
                this._algorithm = alg;
                break;

            default:
                throw new Error( 'unknown algorithm: ' + alg );
        }

        return this;
    }

    secret( sec ) {

        this._secret = sec;

        return this;
    }

    privateKey( key ) {

        this._key = key;

        return this;
    }

    privateKeyFromFile( filePath ) {

        return this.privateKey( fs.readFileSync( filePath ) );
    }

    iat( value ) {

        this._iat = offsetTimeValue( value );

        return this;
    }

    nbf( value ) {

        this._nbf = offsetTimeValue( value );

        return this;
    }

    exp( value ) {

        if( !this._iat ) {

            this._exp = Math.floor( nowInSeconds() + value );
        }
        else {

            this._exp = Math.floor( this._iat + value );
        }

        return this;
    }

    build() {

        let keyOrSecret;

        if( this._algorithm === ALGORITHM_RS256 ) {

            if( !this._key ) {

                throw new Error( 'missing private key' );
            }

            keyOrSecret = this._key;
        }
        else {

            if( !this._secret ) {

                throw new Error( 'missing secret' );
            }

            keyOrSecret = this._secret;
        }

        let jwtClaims = {};

        addClaim( jwtClaims, 'iat', this._iat );
        addClaim( jwtClaims, 'nbf', this._nbf );
        addClaim( jwtClaims, 'exp', this._exp );

        Object.assign( jwtClaims, this._claims );

        return jwt.encode( jwtClaims, keyOrSecret, this._algorithm );
    }
}


module.exports = JWTTokenBuilder;
