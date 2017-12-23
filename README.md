# 🌍 ngworld 🌍

Generates a Minecraft-like world out of an Angular application.

**Warning**: this project is a prototype/demonstration built on top of the Angular compiler. If you're looking for a tool for reverse engineering of Angular applications, you might be interested in [ngrev](https://github.com/mgechev/ngrev).

```bash
$ npm i -g ngworld
$ mkdir world && ngworld -p [PATH_TO_TSCONFIG]
$ http-server .
```

## 🎄 ng-xmas 🎄

Over the weekend, before Christmas 2017, I built ng-xmas. That's variation of the original world which renders the Angular application as Christmas trees 🎄.

The world embeds the following rules:

* Each garden is an `NgModule`.
* Each tree inside of each garden is a component.
* The crown of the component is built by the component's template.
  * The template is being flatten and the `ngworld` compiler consumes up to 7 elements.
  * If there's at least one directive attached to any of the elements, the toys on this layer of the tree are shown with `goldenrod` color.

## Demo

[Here](https://mgechev.github.io/ngworld/).

## License

MIT
