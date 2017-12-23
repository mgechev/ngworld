# 🌍 ngworld 🌍

Generates a Minecraft-like world out of an Angular application.

**Warning**: this project is a prototype/demonstration built on top of the Angular compiler. If you're looking for a tool for reverse engineering of Angular applications, you might be interested in [ngrev](https://github.com/mgechev/ngrev).

## How to use

```bash
npm i -g ngworld
mkdir world && ngworld -p [PATH_TO_TSCONFIG]
http-server .
```

## 🎄 ng-xmas 🎄

Over the weekend, before Christmas 2017, I built ng-xmas. That's variation of the original world which renders the Angular application as Christmas trees 🎄.

The world embeds the following rules:

* Each garden is an `NgModule`.
* Each tree inside of each garden is a component.
* The crown of the component is built by the component's template.
  * The template is being flatten and the `ngworld` compiler consumes up to 7 elements.
  * If there's at least one directive attached to any of the elements, the toys on this layer of the tree are shown with `goldenrod` color.

### How to Install

The Christmas edition of ngworld is behind the version `0.0.9-xmas`:

```bash
npm i -g ngworld@0.0.9-xmas
mkdir xmas && xmas -p [PATH_TO_TSCONFIG]
http-server .
```

### Code

You can find the code for ng-xmas in the [ng-xmas](https://github.com/mgechev/ngworld/blob/ng-xmas) branch.

## Demo

[Here](https://mgechev.github.io/ngworld/).

## License

MIT
