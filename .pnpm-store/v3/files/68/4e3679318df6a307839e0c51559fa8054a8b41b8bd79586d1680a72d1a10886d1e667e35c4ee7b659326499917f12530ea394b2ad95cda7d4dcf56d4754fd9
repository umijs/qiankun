(function () {
  var MML = MathJax.ElementJax.mml;
  
  var PROPERTY = [
    'texWithDelims',
    'movesupsub',
    'subsupOK',
    'primes',
    'movablelimits',
    'scriptlevel',
    'open',
    'close',
    'isError',
    'multiline',
    'variantForm',
    'autoOP',
    'fnOP'  
  ];
  var RENAME = {
      texWithDelims: 'withDelims'
  };

  MML.mbase.Augment({
    toMmlNode: function (factory) {
      var kind = this.type;
      if (kind === 'texatom') kind = 'TeXAtom';
      var node = this.nodeMake(factory, kind);
      if ("texClass" in this) node.texClass = this.texClass;
      return node;
    },
    nodeMake: function (factory,kind) {
      var node = factory.MML[kind === 'TeXmathchoice' ? 'mathchoice' : kind]();
      var data = (this.data[0] && this.data[0].inferred && this.inferRow ? this.data[0].data : this.data);
      for (var i = 0, m = data.length; i < m; i++) {
        var child = data[i];
        if (child) node.appendChild(child.toMmlNode(factory));
      }
      this.nodeAddAttributes(node);
      this.nodeAddProperties(node);
      return node;
    },
    nodeAddAttributes: function (node) {
      var defaults = (this.type === "mstyle" ? MML.math.prototype.defaults : this.defaults);
      var names = (this.attrNames||MML.copyAttributeNames),
          skip = MML.skipAttributes,
          copy = MML.copyAttributes;
      if (!this.attrNames) {
        for (var id in defaults) {
          if (!skip[id] && !copy[id] && defaults.hasOwnProperty(id)) {
            if (this[id] != null && this[id] !== defaults[id]) {
              if (this.Get(id,null,1) !== this[id]) node.attributes.set(id,this[id]);
            }
          }
        }
        if (this['class']) node.attributes.set('class',this['class']);
      }
      for (var i = 0, m = names.length; i < m; i++) {
        if (copy[names[i]] === 1 && !defaults.hasOwnProperty(names[i])) continue;
        var value = (this.attr||{})[names[i]];
        if (value == null) value = this[names[i]];
        if (value === 'true' || value === 'false') value = (value === 'true');
        if (value != null) node.attributes.set(names[i],value);
      }
    },
    nodeAddProperties: function (node) {
      for (var i = 0, m = PROPERTY.length; i < m; i++) {
        var name = PROPERTY[i];
        if (this[name] != null &&
            (this.defaults[name] == null || this.defaults[name] === MML.AUTO)) {
          node.setProperty(RENAME[name] || name, this[name]);
        }
      }
    }
  });
  
  MML.chars.Augment({
    toMmlNode: function (factory) {
      return factory.MML.text().setText(this.data.join(""));
    }
  });
  MML.entity.Augment({
    toMmlNode: function (factory) {
      return factory.MML.text().setText(this.toString());
    }
  });
  
  MML.msubsup.Augment({
    toMmlNode: function (factory) {
      var kind = (this.data[this.sub] == null ? 'msup' :
                  this.data[this.sup] == null ? 'msub' : 'msubsup'); 
      return this.nodeMake(factory, kind);
    }
  });
  
  MML.munderover.Augment({
    toMmlNode: function (factory) {
      var kind = (this.data[this.under] == null ? 'mover' :
                  this.data[this.over]  == null ? 'munder' : 'munderover'); 
      return this.nodeMake(factory, kind);
    }
  });
  
  MML.xml.Augment({
    toMmlNode: function (factory) {
      return factory.MML.xml(this.data);
    }
  });
  
})();
