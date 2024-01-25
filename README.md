# toolbx
Toolbx is a comprehensive utility library that serves as a vital resource for our projects. It houses a multitude of utilities, each designed to perform specific tasks, thereby enhancing the efficiency and productivity of our development process.

# Available tools

## logger

```toolbx.logger("text", log_level)```

Print logs in console with clear styles and colors.

> log levels

1. [0]info (white text with a "0.0 ")
2. [1]success (green text with a "o.0√ ")
3. [2]warn (magenta text with a "0.o/ ")
4. [3]critical (red text with a "x.X ")
5. [4]debug (yellow text with a "?.? ")
6. [5]empty (white text with nothing)

> example

```
import toolbx from "toolbx";

toolbx.logger("hi", 0);
```

returns

```
0.0  hi
```
