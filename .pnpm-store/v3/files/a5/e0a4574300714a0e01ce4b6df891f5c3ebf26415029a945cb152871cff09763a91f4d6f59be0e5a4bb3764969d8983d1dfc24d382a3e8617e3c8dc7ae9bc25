# rc-tabs

---

React Tabs component.

[![NPM version][npm-image]][npm-url] [![dumi](https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square)](https://github.com/umijs/dumi) [![build status][github-actions-image]][github-actions-url] [![Test coverage][codecov-image]][codecov-url] [![npm download][download-image]][download-url] [![bundle size][bundlephobia-image]][bundlephobia-url]

[npm-image]: http://img.shields.io/npm/v/rc-tabs.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-tabs
[github-actions-image]: https://github.com/react-component/tabs/workflows/CI/badge.svg
[github-actions-url]: https://github.com/react-component/tabs/actions
[codecov-image]: https://img.shields.io/codecov/c/github/react-component/tabs/master.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/react-component/tabs/branch/master
[download-image]: https://img.shields.io/npm/dm/rc-tabs.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-tabs
[bundlephobia-url]: https://bundlephobia.com/result?p=rc-tabs
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/rc-tabs


## Screenshot

<img src='https://zos.alipayobjects.com/rmsportal/JwLASrsOYJuFRIt.png' width='408'>

## Example

http://localhost:8000/examples

online example: https://tabs.react-component.now.sh/

## install

[![rc-tabs](https://nodei.co/npm/rc-tabs.png)](https://npmjs.org/package/rc-tabs)

## Feature

### Keyboard

- left and up: tabs to previous tab
- right and down: tabs to next tab

## Usage

```js
import Tabs, { TabPane } from 'rc-tabs';

var callback = function(key) {};

React.render(
  <Tabs defaultActiveKey="2" onChange={callback}>
    <TabPane tab="tab 1" key="1">
      first
    </TabPane>
    <TabPane tab="tab 2" key="2">
      second
    </TabPane>
    <TabPane tab="tab 3" key="3">
      third
    </TabPane>
  </Tabs>,
  document.getElementById('t2'),
);
```

## API

### Tabs

| name | type | default | description |
| --- | --- | --- | --- |
| activeKey | string | - | current active tabPanel's key |
| animated | boolean \| { inkBar: boolean, tabPane: boolean } | `{ inkBar: true, tabPane: false }` | config animation |
| defaultActiveKey | string | - | initial active tabPanel's key if activeKey is absent |
| destroyInactiveTabPane | boolean | false | whether destroy inactive TabPane when change tab |
| direction | `'ltr' | 'rlt'` | `'ltr'` | Layout direction of tabs component |
| editable | { onEdit(type: 'add' | 'remove', info: { key, event }), showAdd: boolean, removeIcon: ReactNode, addIcon: ReactNode } | - | config tab editable |
| locale | { dropdownAriaLabel: string, removeAriaLabel: string, addAriaLabel: string } | - | Accessibility locale help text |
| moreIcon | ReactNode | - | collapse icon |
| tabBarGutter | number | 0 | config tab bar gutter |
| tabBarPosition | `'left' | 'right' | 'top' | 'bottom'` | `'top'` | tab nav 's position |
| tabBarStyle | style | - | tab nav style |
| tabBarExtraContent | ReactNode \| `{ left: ReactNode, right: ReactNode }` | - | config extra content |
| renderTabBar | (props, TabBarComponent) => ReactElement | - | How to render tab bar |
| prefixCls | string | `'rc-tabs'` | prefix class name, use to custom style |
| onChange | (key) => void | - | called when tabPanel is changed |
| onTabClick | (key) => void | - | called when tab click |
| onTabScroll | ({ direction }) => void | - | called when tab scroll |

### TabPane

| name | type | default | description |
| --- | --- | --- | --- |
| key | string | - | corresponding to activeKey, should be unique |
| forceRender | boolean | false | forced render of content in tabs, not lazy render after clicking on tabs |
| tab | ReactNode | - | current tab's title corresponding to current tabPane |
| closeIcon | ReactNode | - | Config close icon |

## Development

```
npm install
npm start
```

## Test Case

```
npm test
npm run chrome-test
```

## Coverage

```
npm run coverage
```

open coverage/ dir

## License

rc-tabs is released under the MIT license.

## FAQ

### Resposive Tabs

There are 3 cases when handling resposive tabs:
![image](https://user-images.githubusercontent.com/27722486/156315099-7e6eda9d-ab77-4b16-9b49-1727c5ec8b26.png)

We get hidden tabs through [useVisibleRange.ts](https://github.com/react-component/tabs/blob/master/src/hooks/useVisibleRange.ts).
If enconter the third case, in order to make tabs responsive, some tabs should be hidden. 
So we minus `addSize` when calculating `basicSize` manully, even though there's no addNode in container.
In this way, case 3 turns to case 2, tabs become stable again.
