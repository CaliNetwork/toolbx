# toolbx
Toolbx is a comprehensive utility library that serves as a vital resource for our projects. It houses a multitude of utilities, each designed to perform specific tasks, thereby enhancing the efficiency and productivity of our development process.

# Available tools

## logger

```logger("text":string, log_level:number)```

Print logs in console with clear styles and colors.

> log levels

|Code|Level|Color|
|-|-|-|
|0|info|white|
|1|success|green|
|2|critical|red|
|3|warn|magenta|
|4|debug|yellow|
|5|empty(reserved)|white|

> example

```
import { logger } from "toolbx";

toolbx.logger("hi", 0);
```

returns

```
hi
```

## generateToken

Generate a token of x bytes

> example

```
import { generateToken } from 'toolbx'

console.log(generateToken(16))
```

returns

```
6a269fde6f007a12631e4ee35a80a92c
```

## TOTPseeding

Generate a TOTP seed.

> example

```
import { TOTP } from "toolbx";

console.log(TOTP.seeding());
```

returns

```
KTEK5DSPRPO2KQIY
```

## TOTPtokenization

```TOTP.tokenization(seed: string)```

Generate a TOTP token with a seed.

> example

```
import { TOTP } from "toolbx";

console.log(TOTP.tokenization(KTEK5DSPRPO2KQIY));
```

returns

```
521967
```

## base32Decode

```TOTP.base32Decode(text:string, var:string)```

Well, as you can see, it does with its name imply.

var: RFC3548, RFC4648, RFC4648-HEX, Crockford

## hread

Convert bytes to human readable units

> Params

(Top->bottom is the order when you're trying to use it, that's to say Top->bottom = Left->Right)

|Item|type|default|Purpose|
|-|-|-|-|
|bytes|number|X|Input bytes count|
|si|boolean|false|Use SI units|
|dp|number|1|To the nearest few digits|

> Example

`hread(91283129)` returns an object contains two items one is num and the other is units

## secondsToTime

Convert seconds to human readable time units

> Example

`secondsToTime(91283129)` returns an object contains two items one is num and the other is time units