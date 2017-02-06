## aframe-lerp-component

A Linear Interpolation component for A-Frame.

For [A-Frame](https://aframe.io).

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |

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
    <a-entity lerp="foo: bar"></a-entity>
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
