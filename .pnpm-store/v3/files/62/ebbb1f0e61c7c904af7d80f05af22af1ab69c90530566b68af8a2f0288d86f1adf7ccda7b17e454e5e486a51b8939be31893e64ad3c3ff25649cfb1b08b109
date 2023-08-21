import { plugin } from './plugin';
{{#plugins}}
import * as Plugin_{{{ index }}} from '{{{ path }}}';
{{/plugins}}

{{#plugins}}
  plugin.register({
    apply: Plugin_{{{ index }}},
    path: '{{{ path }}}',
  });
{{/plugins}}

export const __mfsu = 1;
