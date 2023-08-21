const feature_unit = {
  'width': 'px',
  'height': 'px',
  'device-width': 'px',
  'device-height': 'px',
  'aspect-ratio': '',
  'device-aspect-ratio': '',
  'color': '',
  'color-index': '',
  'monochrome': '',
  'resolution': 'dpi'
};

// Supported min-/max- attributes
const feature_name = Object.keys(feature_unit);

const step = .001; // smallest even number that won’t break complex queries (1in = 96px)

const power = {
  '>': 1,
  '<': -1
};

const minmax = {
  '>': 'min',
  '<': 'max'
};

function create_query(name, gtlt, eq, value) {
  return value.replace(/([-\d\.]+)(.*)/, function (_match, number, unit) {
    const initialNumber = parseFloat(number);

    if (parseFloat(number) || eq) {
      // if eq is true, then number remains same
      if (!eq) {
        // change integer pixels value only on integer pixel
        if (unit === 'px' && initialNumber === parseInt(number, 10)) {
          number = initialNumber + power[gtlt];
        } else {
          number = Number(Math.round(parseFloat(number) + step * power[gtlt] + 'e6')+'e-6');
        }
      }
    } else {
      number = power[gtlt] + feature_unit[name];
    }

    return '(' + minmax[gtlt] + '-' + name + ': ' + number + unit + ')';
  });
}

function transform(rule) {
  /**
   * 转换 <mf-name> <|>= <mf-value>
   *    $1  $2   $3
   * (width >= 300px) => (min-width: 300px)
   * (width <= 900px) => (max-width: 900px)
   */

  if (!rule.params.includes('<') && !rule.params.includes('>')) {
    return
  }

  // The value doesn't support negative values
  // But -0 is always equivalent to 0 in CSS, and so is also accepted as a valid <mq-boolean> value.

  rule.params = rule.params.replace(/\(\s*([a-z-]+?)\s*([<>])(=?)\s*((?:-?\d*\.?(?:\s*\/?\s*)?\d+[a-z]*)?)\s*\)/gi, function($0, $1, $2, $3, $4) {
    if (feature_name.indexOf($1) > -1) {
      return create_query($1, $2, $3, $4);
    }
    // If it is not the specified attribute, don't replace
    return $0;
  })

  /**
   * 转换  <mf-value> <|<= <mf-name> <|<= <mf-value>
   * 转换  <mf-value> >|>= <mf-name> >|>= <mf-value>
   *   $1  $2$3 $4  $5$6  $7
   * (500px <= width <= 1200px) => (min-width: 500px) and (max-width: 1200px)
   * (500px < width <= 1200px) => (min-width: 501px) and (max-width: 1200px)
   * (900px >= width >= 300px)  => (min-width: 300px) and (max-width: 900px)
   */

  rule.params = rule.params.replace(/\(\s*((?:-?\d*\.?(?:\s*\/?\s*)?\d+[a-z]*)?)\s*(<|>)(=?)\s*([a-z-]+)\s*(<|>)(=?)\s*((?:-?\d*\.?(?:\s*\/?\s*)?\d+[a-z]*)?)\s*\)/gi, function($0, $1, $2, $3, $4, $5, $6, $7) {

    if (feature_name.indexOf($4) > -1) {
      if ($2 === '<' && $5 === '<' || $2 === '>' && $5 === '>') {
        const min = ($2 === '<') ? $1 : $7;
        const max = ($2 === '<') ? $7 : $1;

        // output differently depended on expression direction
        // <mf-value> <|<= <mf-name> <|<= <mf-value>
        // or
        // <mf-value> >|>= <mf-name> >|>= <mf-value>
        let equals_for_min = $3;
        let equals_for_max = $6;

        if ($2 === '>') {
          equals_for_min = $6;
          equals_for_max = $3;
        }

        return create_query($4, '>', equals_for_min, min) + ' and ' + create_query($4, '<', equals_for_max, max);
      }
    }
    // If it is not the specified attribute, don't replace
    return $0;
  });
}

module.exports = () => ({
  postcssPlugin: 'postcss-media-minmax',
  AtRule: {
    media: (atRule) => {
      transform(atRule);
    },
    'custom-media': (atRule) => {
      transform(atRule);
    },
  },
});

module.exports.postcss = true
