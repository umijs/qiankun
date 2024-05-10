export var SandBoxType;
(function (SandBoxType) {
  SandBoxType["Proxy"] = "Proxy";
  SandBoxType["Snapshot"] = "Snapshot";
  // for legacy sandbox
  // https://github.com/umijs/qiankun/blob/0d1d3f0c5ed1642f01854f96c3fabf0a2148bd26/src/sandbox/legacy/sandbox.ts#L22...L25
  SandBoxType["LegacyProxy"] = "LegacyProxy";
})(SandBoxType || (SandBoxType = {}));