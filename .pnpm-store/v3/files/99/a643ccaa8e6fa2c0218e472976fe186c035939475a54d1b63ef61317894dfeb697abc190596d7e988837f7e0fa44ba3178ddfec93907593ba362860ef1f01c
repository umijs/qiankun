import { transform } from '@babel/core';
import dedent from 'dedent';

function runPlugin(
  code: string,
  opts: { cwd: string; plugins?: any[]; filename: string },
) {
  const res = transform(dedent`${code}`, {
    babelrc: false,
    sourceType: 'module',
    presets: [
      [
        require.resolve('@umijs/deps/compiled/babel/preset-react'),
        {
          development: true,
        },
      ],
    ],
    plugins: [[require.resolve('./index')]],
    ...opts,
  });

  if (!res) {
    throw new Error('plugin failed');
  }

  return res;
}

test('normal arrow function', () => {
  const opts = {
    cwd: '/a/b/c',
    filename: '/a/b/c/src/index.tsx',
  };
  expect(
    runPlugin(
      `
    export default () => {
      return <p>Hello</p>;
    };
  `,
      opts,
    ).code,
  ).toEqual(
    runPlugin(
      `
    const SrcIndex = () => {
      return <p>Hello</p>;
    };
    export default SrcIndex;
    `,
      { ...opts, plugins: [] },
    ).code,
  );

  // change filename
  const componentOpts = {
    cwd: '/a/b/c',
    filename: '/a/b/c/components/About.tsx',
  };
  expect(
    runPlugin(
      `
    export default () => {
      return <p>Hello</p>;
    };
  `,
      componentOpts,
    ).code,
  ).toEqual(
    runPlugin(
      `
    const ComponentsAbout = () => {
      return <p>Hello</p>;
    };
    export default ComponentsAbout;
    `,
      { ...componentOpts, plugins: [] },
    ).code,
  );
});

test('HOC not support', () => {
  const opts = {
    cwd: '/a/b/c',
    filename: '/a/b/c/src/index.tsx',
  };
  expect(
    runPlugin(
      `
    import { connect } from 'dva';

    export default connect()(() => {
      return <p>Hello</p>;
    });
  `,
      opts,
    ).code,
  ).toEqual(
    runPlugin(
      `
    import { connect } from 'dva';

    export default connect()(() => {
      return <p>Hello</p>;
    });
    `,
      { ...opts, plugins: [] },
    ).code,
  );
});

test('normal anonymous function', () => {
  const opts = {
    cwd: '/a/b/c',
    filename: '/a/b/c/src/index.tsx',
  };
  expect(
    runPlugin(
      `
    export default function () {
      return <p>Hello</p>;
    };
  `,
      opts,
    ).code,
  ).toEqual(
    runPlugin(
      `
    export default function SrcIndex() {
      return <p>Hello</p>;
    };
    `,
      { ...opts, plugins: [] },
    ).code,
  );
});

test('conflict declaration anonymous arrow function', () => {
  const opts = {
    cwd: '/a/b/c',
    filename: '/a/b/c/src/index.tsx',
  };
  expect(
    runPlugin(
      `
    function SrcIndex() {}

    export default () => {
      return <p>Hello</p>;
    };
  `,
      opts,
    ).code,
  ).toEqual(
    runPlugin(
      `
    function SrcIndex() {}

    const SrcIndex0 = () => {
      return <p>Hello</p>;
    };

    export default SrcIndex0;
    `,
      { ...opts, plugins: [] },
    ).code,
  );
});

test('conflict declaration anonymous function', () => {
  const opts = {
    cwd: '/a/b/c',
    filename: '/a/b/c/src/index.tsx',
  };
  expect(
    runPlugin(
      `
    function SrcIndex() {}

    export default function () {
      return <p>Hello</p>;
    };
  `,
      opts,
    ).code,
  ).toEqual(
    runPlugin(
      `
    function SrcIndex() {}

    export default function SrcIndex0() {
      return <p>Hello</p>;
    };
    `,
      { ...opts, plugins: [] },
    ).code,
  );
});

test('no valid path', () => {
  const opts = {
    cwd: '/a/b/c',
    filename: '/a/b/c/node_modules/antd/index.tsx',
  };
  const source = `
  export default () => {
    return <p>Hello</p>;
  };
`;
  expect(runPlugin(source, opts).code).toEqual(
    runPlugin(source, { ...opts, plugins: [] }).code,
  );
});

test('normal arrow function dynamic path', () => {
  const opts = {
    cwd: '/a/b/c',
    filename: '/a/b/c/src/pages/[id].tsx',
  };
  expect(
    runPlugin(
      `
    export default () => {
      return <p>Hello</p>;
    };
  `,
      opts,
    ).code,
  ).toEqual(
    runPlugin(
      `
    const SrcPagesId = () => {
      return <p>Hello</p>;
    };
    export default SrcPagesId;
    `,
      { ...opts, plugins: [] },
    ).code,
  );
});

test('with chinese name', () => {
  const opts = {
    cwd: '/a/b/c',
    filename: '/a/b/c/src/pages/主页.tsx',
  };
  expect(
    runPlugin(
      `
    export default () => {
      return <p>Hello</p>;
    };
  `,
      opts,
    ).code,
  ).toEqual(
    runPlugin(
      `
    const SrcPages = () => {
      return <p>Hello</p>;
    };
    export default SrcPages;
    `,
      { ...opts, plugins: [] },
    ).code,
  );
});
