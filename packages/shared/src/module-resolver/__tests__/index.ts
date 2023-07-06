import { describe, it } from 'vitest';

import { moduleResolver } from '../index';

describe('default module resolver', () => {
  const mainAppContainer = document.createElement('div');
  mainAppContainer.innerHTML = `
    <script type="dependencymap">
      {
        "dependencies": {
          "moment": {
            "url": "https://unpkg.com/2.1.1/moment.js",
            "version": "2.1.1",
            "range": "^2.0.1"
          },
          "lodash": {
            "url": "https://unpkg.com/4.0.2/lodash.js",
            "version": "4.0.2",
            "range": "~4.0.1"
          },
          "antd": {
            "url": "https://unpkg.com/4.0.2/antd",
            "version": "4.0.2",
            "range": "~4.0.1"
          }
        }
      }
    </script>
  `;

  it('should works well', ({ expect }) => {
    const microAppContainer = document.createElement('div');
    microAppContainer.innerHTML = `
      <script type="dependencymap">
        {
          "dependencies": {
            "moment": {
              "url": "https://unpkg.com/2.0.1/moment.js",
              "version": "2.0.1",
              "range": "^2.0.1"
            },
            "lodash": {
              "url": "https://unpkg.com/4.0.1/lodash.js",
              "version": "4.0.1",
              "range": "~4.0.1"
            },
            "antd": {
              "url": "https://unpkg.com/4.0.1/antd",
              "version": "4.0.1",
              "range": "4.0.1"
            }
          }
        }
      </script>
    `;

    const result1 = moduleResolver('https://unpkg.com/4.0.1/antd', microAppContainer, mainAppContainer);
    expect(result1).toBeUndefined();

    const result2 = moduleResolver('https://unpkg.com/4.0.1/lodash.js', microAppContainer, mainAppContainer);
    expect(result2).toStrictEqual({
      version: '4.0.2',
      url: 'https://unpkg.com/4.0.2/lodash.js',
    });

    const result3 = moduleResolver('https://unpkg.com/2.0.1/moment.js', microAppContainer, mainAppContainer);
    expect(result3).toStrictEqual({
      version: '2.1.1',
      url: 'https://unpkg.com/2.1.1/moment.js',
    });

    const result4 = moduleResolver('https://unpkg.com/4.0.2/antd', microAppContainer, mainAppContainer);
    expect(result4).toBeUndefined();
  });
});
