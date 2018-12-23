# 🌍 ngworld 🌍

This project aims to illustrate how powerful the Angular compiler is by generating a Minecraft-like world out of an Angular application.

The project uses [ngast](https://github.com/mgechev/ngast) - a library which wraps the Angular compiler and provides user friendly API to it's metadata collector.

**Warning**: this project is a prototype/demonstration built on top of the Angular compiler. If you're looking for a tool for reverse engineering of Angular applications, you might be interested in [ngrev](https://github.com/mgechev/ngrev).

## How to use

```bash
npm i -g ngworld
mkdir world && ngworld -p [PATH_TO_TSCONFIG]
http-server .
```

## 🎄 ng-xmas 🎄

Over the weekend, before Christmas 2017, I built ng-xmas. That's variation of the original world which renders an Angular application as Christmas trees 🎄.

The world embeds the following rules:

* Each garden is an `NgModule`.
* Each tree inside of each garden is a component.
* The crowns of all trees are generated from the components' templates.
  * The template is being flatten after which the `ngworld` compiler consumes up to 7 elements.
  * If there's at least one directive attached to any of the elements, the toys on this layer of the tree are shown with `goldenrod` color otherwise they are `red`.

`ngworld` uses particle system plugin which performs heavy computations which can dramatically reduce the framerate. In order to prevent this, it's snowing only over a particular region of the world.

### How to Install

The Christmas edition of ngworld is published under the `ng-xmas` package:

```bash
npm i -g ng-xmas
mkdir xmas && cd xmas && ng-xmas -p [PATH_TO_TSCONFIG]
http-server .
```

### Code

You can find the code for ng-xmas in the [ng-xmas](https://github.com/mgechev/ngworld/tree/ng-xmas) branch.

## Demo

[Here](https://mgechev.github.io/ngworld/).

## License

MIT
