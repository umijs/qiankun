(function () {
  var MML = MathJax.ElementJax.mml;
  
  MML.mbase.Augment({
    toJSON: function () {
      var m = this.data.length;
      var json = {type: this.type};
      if (this.inferred) json.inferred = true;
      if (this.isToken) {
        json.text = this.data.join("");
      } else {
        json.children = new Array(m);
        for (var i = 0; i < m; i++) {
          var child = this.data[i];
          if (child) json.children[i] = child.toJSON();
        }
      }
      this.jsonAddAttributes(json);
      return json;
    },
    jsonAddAttributes: function (json) {
      var defaults = (this.type === "mstyle" ? MML.math.prototype.defaults : this.defaults);
      var names = (this.attrNames||MML.copyAttributeNames),
          skip = MML.skipAttributes,
          copy = MML.copyAttributes;
      var attr = {};

      if (!this.attrNames) {
        for (var id in defaults) {
          if (!skip[id] && !copy[id] && defaults.hasOwnProperty(id)) {
            if (this[id] != null && this[id] !== defaults[id]) {
              if (this.Get(id,null,1) !== this[id]) attr[id] = this[id];
            }
          }
        }
      }
      for (var i = 0, m = names.length; i < m; i++) {
        if (copy[names[i]] === 1 && !defaults.hasOwnProperty(names[i])) continue;
        value = (this.attr||{})[names[i]];
        if (value == null) value = this[names[i]];
        if (value != null) attr[names[i]] = value;
      }
      json.attributes = attr;
    }
  });
  
  MML.chars.Augment({
    toJSON: function () {
      return this.data.join("");
    }
  });
  MML.entity.Augment({
    toJSON: function () {
      return this.data.join("");
    }
  });
  
  MML.msubsup.Augment({
    toJSON: function () {
      var json = this.SUPER(arguments).toJSON.call(this);
      if (this.data[this.sub] == null) {
        json.type = "msup";
        json.children.splice(1,1);
      }
      if (this.data[this.sup] == null) {
        json.type = "msub";
        json.children.splice(2,1);
      }
      return json;
    }
  });
  
  MML.munderover.Augment({
    toJSON: function () {
      var json = this.SUPER(arguments).toJSON.call(this);
      if (this.data[this.munder] == null) {
        json.type = "mover";
        json.children.splice(1,1);
      }
      if (this.data[this.mover] == null) {
        json.type = "munder";
        json.children.splice(2,1);
      }
      return json;
    }
  });
  
  MML.TeXAtom.Augment({
    toJSON: function () {
      var json = this.SUPER(arguments).toJSON.call(this);
      json.type = "mrow";
      json.TeXAtom = MML.TEXCLASSNAMES[this.Get("texClass")];
      return json;
    }
  });
  
  MML.xml.Augment({
    toJSON: function () {
      return {type:"xml", data: this.toString()};
    }
  });
  
})();
