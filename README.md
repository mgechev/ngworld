# 🌍 ngworld 🌍

This project aims to illustrate how powerful the Angular compiler is by generating a Minecraft-like world out of an Angular application.

The project uses [ngast](https://github.com/mgechev/ngast) - a library which wraps the Angular compiler and provides user friendly API to it's metadata collector.

**Warning**: this project is a prototype/demonstration built on top of the Angular compiler. If you're looking for a tool for reverse engineering of Angular applications, you might be interested in [ngrev](https://github.com/mgechev/ngrev).

## How to use?

The Christmas edition of ngworld is behind the `ng-xmas` package:

```bash
npm i -g ng-xmas
mkdir xmas && cd xmas && ng-xmas -p [PATH_TO_TSCONFIG] -o [OUTPUT_PATH]
serve -s .
```
## 🎄 ng-xmas 🎄

Over the weekend, before Christmas 2017, I built ng-xmas. That's variation of the original world which renders an Angular application as Christmas trees 🎄. The week before Christmas 2020 I updated the implementation to use the Ivy compiler.

The world embeds the following rules:

* Each garden is an `NgModule`.
* Each tree inside of each garden is a component.
* The crowns of all trees are generated from the components' templates.
  * We take the deepest path of nested elements with setting limit 7.
  * If there's at least one input to any of the elements (i.e. the element corresponds to a component or there's a directive with an input), the toys on this layer of the tree are shown with `goldenrod` color otherwise they are `red`.

`ngworld` uses particle system plugin which performs heavy computations which can dramatically reduce the framerate. In order to prevent this, it's snowing only over a particular region of the world.

### Code

You can find the code for ng-xmas in the [ng-xmas](https://github.com/mgechev/ngworld/tree/ng-xmas) branch.

## Demo

[Here](https://mgechev.github.io/ngworld/).

## License

MIT
