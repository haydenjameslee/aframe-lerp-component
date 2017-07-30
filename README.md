## aframe-lerp-component

A linear interpolation component for [A-Frame](https://aframe.io).

Changes the position, rotation, or scale when you call `el.setAttribute('position', ...)` from the current value to the new value in time `duration`.

Use directly by calling `el.components.lerp.toPosition(from, to)`


![GIF Example](http://i.giphy.com/26xBP0MH0KHaCrhE4.gif)

Try on Glitch: https://aframe-lerp-component.glitch.me/

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
| duration  | Time to move from `from` to `to` in milliseconds (ms) |     100       |
| properties | Array of properties to lerp. Eg. to only lerp position and rotation set to `position, rotation` | position, rotation, scale |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.4.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-lerp-component/dist/aframe-lerp-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity lerp="duration: 100; properties: position, rotation, scale"></a-entity>
  </a-scene>
</body>
```

<!-- If component is accepted to the Registry, uncomment this. -->
<!--
Or with [angle](https://npmjs.com/package/angle/), you can install the proper
version of the component straight into your HTML file, respective to your
version of A-Frame:

```sh
angle install aframe-lerp-component
```
-->

#### npm

Install via npm:

```bash
npm install aframe-lerp-component
```

Then require and use.

```js
require('aframe');
require('aframe-lerp-component');
```
