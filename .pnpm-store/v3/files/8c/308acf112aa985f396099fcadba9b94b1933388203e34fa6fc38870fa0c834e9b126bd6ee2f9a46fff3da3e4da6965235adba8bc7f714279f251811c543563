import { join } from 'path';
import { Service } from 'umi';
import { readFileSync } from 'fs';
import cheerio from 'cheerio';

const fixtures = join(__dirname, 'fixtures');

test('analytics', async () => {
  const cwd = join(fixtures, 'analytics');
  const service = new Service({
    cwd,
    plugins: [require.resolve('./')],
  });

  await service.run({
    name: 'g',
    args: {
      _: ['g', 'html'],
    },
  });

  const removeSpace = (str: string | null) =>
    str?.replace(/[\r\n]/g, '')?.replace(/\ +/g, '');
  const html = readFileSync(join(cwd, 'dist', 'index.html'), 'utf-8');
  const $ = cheerio.load(html);

  expect(removeSpace($('head script').eq(2).html())).toContain(
    `var_hmt=_hmt||[];`,
  );

  expect(removeSpace($('head script').eq(3).html())).toContain(
    `(function(){varhm=document.createElement("script");hm.src="https://hm.baidu.com/hm.js?5a66cxxxxxxxxxx9e13";vars=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s);})();`,
  );

  expect(removeSpace($('body script').eq(0).html())).toContain(
    `(function(){if(!location.port){(function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;(i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments);}),(i[r].l=1*newDate());(a=s.createElement(o)),(m=s.getElementsByTagName(o)[0]);a.async=1;a.src=g;m.parentNode.insertBefore(a,m);})(window,document,"script","//www.google-analytics.com/analytics.js","ga");ga("create","googleanalyticscode","auto");ga("send","pageview");}})();`,
  );
});

test('analytics', async () => {
  const cwd = join(fixtures, 'analytics-ga-key');
  const service = new Service({
    cwd,
    plugins: [require.resolve('./')],
  });

  await service.run({
    name: 'g',
    args: {
      _: ['g', 'html'],
    },
  });

  const removeSpace = (str: string | null) =>
    str?.replace(/[\r\n]/g, '')?.replace(/\ +/g, '');
  const html = readFileSync(join(cwd, 'dist', 'index.html'), 'utf-8');
  const $ = cheerio.load(html);

  expect(removeSpace($('head script').eq(2).html())).toContain(
    `var_hmt=_hmt||[];`,
  );

  expect(removeSpace($('head script').eq(3).html())).toContain(
    `(function(){varhm=document.createElement("script");hm.src="https://hm.baidu.com/hm.js?5a66cxxxxxxxxxx9e13";vars=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s);})();`,
  );

  expect(removeSpace($('body script').eq(0).html())).toContain(
    `(function(){if(!location.port){(function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;(i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments);}),(i[r].l=1*newDate());(a=s.createElement(o)),(m=s.getElementsByTagName(o)[0]);a.async=1;a.src=g;m.parentNode.insertBefore(a,m);})(window,document,"script","//www.google-analytics.com/analytics.js","ga");ga("create","googleanalyticscode","auto");ga("send","pageview");}})();`,
  );
});
