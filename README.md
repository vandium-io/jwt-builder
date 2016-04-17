# jwt-builder

Builds JSON Web Tokens (JWT) programatically.

## Features
* Easy to use chained API to create JWT
* Works with HS256, HS384, HS512, and RS256
* Great for unit testing services that use JWT

## Installation
Install via npm.

	npm install jwt-builder --save

## Getting Started

The following example will build a JWT that will expire in 1 hour from now, signed with a HMAC-SHA256 signature.

```js
'use strict';

const jwtBuilder = require( 'jwt-builder' );

let token = jwtBuilder()
                .nbf()             // can't be used before current time
                .exp( 3600 )       // expire in 1 hour
                .claims( { iss: 'https://auth.vandium.io' } )
                .algorithm( 'HS256' )
                .secret( 'super-secret' )
                .build();
```



## License

[BSD-3-Clause](https://en.wikipedia.org/wiki/BSD_licenses)

Copyright (c) 2016, Vandium Software Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of Vandium Software Inc. nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
