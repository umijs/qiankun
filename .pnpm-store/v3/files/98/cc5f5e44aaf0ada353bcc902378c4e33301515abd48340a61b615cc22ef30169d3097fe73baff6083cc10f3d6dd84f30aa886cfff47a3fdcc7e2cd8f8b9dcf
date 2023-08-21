import {combineWithMathJax} from '../../../../js/components/global.js';
import {VERSION} from '../../../../js/components/version.js';

import * as module1 from '../../../../js/adaptors/HTMLAdaptor.js';
import * as module2 from '../../../../js/adaptors/browserAdaptor.js';
import * as module3 from '../../../../js/components/global.js';
import * as module4 from '../../../../js/core/DOMAdaptor.js';
import * as module5 from '../../../../js/core/FindMath.js';
import * as module6 from '../../../../js/core/Handler.js';
import * as module7 from '../../../../js/core/HandlerList.js';
import * as module8 from '../../../../js/core/InputJax.js';
import * as module9 from '../../../../js/core/MathDocument.js';
import * as module10 from '../../../../js/core/MathItem.js';
import * as module11 from '../../../../js/core/MathList.js';
import * as module12 from '../../../../js/core/MmlTree/Attributes.js';
import * as module13 from '../../../../js/core/MmlTree/MML.js';
import * as module14 from '../../../../js/core/MmlTree/MathMLVisitor.js';
import * as module15 from '../../../../js/core/MmlTree/MmlFactory.js';
import * as module16 from '../../../../js/core/MmlTree/MmlNode.js';
import * as module17 from '../../../../js/core/MmlTree/MmlNodes/TeXAtom.js';
import * as module18 from '../../../../js/core/MmlTree/MmlNodes/maction.js';
import * as module19 from '../../../../js/core/MmlTree/MmlNodes/maligngroup.js';
import * as module20 from '../../../../js/core/MmlTree/MmlNodes/malignmark.js';
import * as module21 from '../../../../js/core/MmlTree/MmlNodes/math.js';
import * as module22 from '../../../../js/core/MmlTree/MmlNodes/mathchoice.js';
import * as module23 from '../../../../js/core/MmlTree/MmlNodes/menclose.js';
import * as module24 from '../../../../js/core/MmlTree/MmlNodes/merror.js';
import * as module25 from '../../../../js/core/MmlTree/MmlNodes/mfenced.js';
import * as module26 from '../../../../js/core/MmlTree/MmlNodes/mfrac.js';
import * as module27 from '../../../../js/core/MmlTree/MmlNodes/mglyph.js';
import * as module28 from '../../../../js/core/MmlTree/MmlNodes/mi.js';
import * as module29 from '../../../../js/core/MmlTree/MmlNodes/mmultiscripts.js';
import * as module30 from '../../../../js/core/MmlTree/MmlNodes/mn.js';
import * as module31 from '../../../../js/core/MmlTree/MmlNodes/mo.js';
import * as module32 from '../../../../js/core/MmlTree/MmlNodes/mpadded.js';
import * as module33 from '../../../../js/core/MmlTree/MmlNodes/mphantom.js';
import * as module34 from '../../../../js/core/MmlTree/MmlNodes/mroot.js';
import * as module35 from '../../../../js/core/MmlTree/MmlNodes/mrow.js';
import * as module36 from '../../../../js/core/MmlTree/MmlNodes/ms.js';
import * as module37 from '../../../../js/core/MmlTree/MmlNodes/mspace.js';
import * as module38 from '../../../../js/core/MmlTree/MmlNodes/msqrt.js';
import * as module39 from '../../../../js/core/MmlTree/MmlNodes/mstyle.js';
import * as module40 from '../../../../js/core/MmlTree/MmlNodes/msubsup.js';
import * as module41 from '../../../../js/core/MmlTree/MmlNodes/mtable.js';
import * as module42 from '../../../../js/core/MmlTree/MmlNodes/mtd.js';
import * as module43 from '../../../../js/core/MmlTree/MmlNodes/mtext.js';
import * as module44 from '../../../../js/core/MmlTree/MmlNodes/mtr.js';
import * as module45 from '../../../../js/core/MmlTree/MmlNodes/munderover.js';
import * as module46 from '../../../../js/core/MmlTree/MmlNodes/semantics.js';
import * as module47 from '../../../../js/core/MmlTree/MmlVisitor.js';
import * as module48 from '../../../../js/core/MmlTree/OperatorDictionary.js';
import * as module49 from '../../../../js/core/MmlTree/SerializedMmlVisitor.js';
import * as module50 from '../../../../js/core/OutputJax.js';
import * as module51 from '../../../../js/core/Tree/Factory.js';
import * as module52 from '../../../../js/core/Tree/Node.js';
import * as module53 from '../../../../js/core/Tree/NodeFactory.js';
import * as module54 from '../../../../js/core/Tree/Visitor.js';
import * as module55 from '../../../../js/core/Tree/Wrapper.js';
import * as module56 from '../../../../js/core/Tree/WrapperFactory.js';
import * as module57 from '../../../../js/handlers/html.js';
import * as module58 from '../../../../js/handlers/html/HTMLDocument.js';
import * as module59 from '../../../../js/handlers/html/HTMLDomStrings.js';
import * as module60 from '../../../../js/handlers/html/HTMLHandler.js';
import * as module61 from '../../../../js/handlers/html/HTMLMathItem.js';
import * as module62 from '../../../../js/handlers/html/HTMLMathList.js';
import * as module63 from '../../../../js/mathjax.js';
import * as module64 from '../../../../js/util/AsyncLoad.js';
import * as module65 from '../../../../js/util/BBox.js';
import * as module66 from '../../../../js/util/BitField.js';
import * as module67 from '../../../../js/util/Entities.js';
import * as module68 from '../../../../js/util/FunctionList.js';
import * as module69 from '../../../../js/util/LinkedList.js';
import * as module70 from '../../../../js/util/Options.js';
import * as module71 from '../../../../js/util/PrioritizedList.js';
import * as module72 from '../../../../js/util/Retries.js';
import * as module73 from '../../../../js/util/StyleList.js';
import * as module74 from '../../../../js/util/Styles.js';
import * as module75 from '../../../../js/util/lengths.js';
import * as module76 from '../../../../js/util/numeric.js';
import * as module77 from '../../../../js/util/string.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('core', VERSION, 'core');
}

combineWithMathJax({_: {
  adaptors: {
    HTMLAdaptor: module1,
    browserAdaptor: module2
  },
  components: {
    global: module3
  },
  core: {
    DOMAdaptor: module4,
    FindMath: module5,
    Handler: module6,
    HandlerList: module7,
    InputJax: module8,
    MathDocument: module9,
    MathItem: module10,
    MathList: module11,
    MmlTree: {
      Attributes: module12,
      MML: module13,
      MathMLVisitor: module14,
      MmlFactory: module15,
      MmlNode: module16,
      MmlNodes: {
        TeXAtom: module17,
        maction: module18,
        maligngroup: module19,
        malignmark: module20,
        math: module21,
        mathchoice: module22,
        menclose: module23,
        merror: module24,
        mfenced: module25,
        mfrac: module26,
        mglyph: module27,
        mi: module28,
        mmultiscripts: module29,
        mn: module30,
        mo: module31,
        mpadded: module32,
        mphantom: module33,
        mroot: module34,
        mrow: module35,
        ms: module36,
        mspace: module37,
        msqrt: module38,
        mstyle: module39,
        msubsup: module40,
        mtable: module41,
        mtd: module42,
        mtext: module43,
        mtr: module44,
        munderover: module45,
        semantics: module46
      },
      MmlVisitor: module47,
      OperatorDictionary: module48,
      SerializedMmlVisitor: module49
    },
    OutputJax: module50,
    Tree: {
      Factory: module51,
      Node: module52,
      NodeFactory: module53,
      Visitor: module54,
      Wrapper: module55,
      WrapperFactory: module56
    }
  },
  handlers: {
    html_ts: module57,
    html: {
      HTMLDocument: module58,
      HTMLDomStrings: module59,
      HTMLHandler: module60,
      HTMLMathItem: module61,
      HTMLMathList: module62
    }
  },
  mathjax: module63,
    util: {
    AsyncLoad: module64,
    BBox: module65,
    BitField: module66,
    Entities: module67,
    FunctionList: module68,
    LinkedList: module69,
    Options: module70,
    PrioritizedList: module71,
    Retries: module72,
    StyleList: module73,
    Styles: module74,
    lengths: module75,
    numeric: module76,
    string: module77
  }
}});
