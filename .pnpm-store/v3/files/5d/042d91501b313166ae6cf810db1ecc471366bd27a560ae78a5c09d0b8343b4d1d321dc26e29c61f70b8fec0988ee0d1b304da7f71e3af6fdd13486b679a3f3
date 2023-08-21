'use strict';
// @ts-check
// ==================================================================================
// utils.js
// ----------------------------------------------------------------------------------
// Description:   System Information - library
//                for Node.js
// Copyright:     (c) 2014 - 2023
// Author:        Sebastian Hildebrandt
// ----------------------------------------------------------------------------------
// License:       MIT
// ==================================================================================
// 0. helper functions
// ----------------------------------------------------------------------------------

const os = require('os');
const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const util = require('util');

let _platform = process.platform;
const _linux = (_platform === 'linux' || _platform === 'android');
const _darwin = (_platform === 'darwin');
const _windows = (_platform === 'win32');
const _freebsd = (_platform === 'freebsd');
const _openbsd = (_platform === 'openbsd');
const _netbsd = (_platform === 'netbsd');

let _cores = 0;
let wmicPath = '';
let codepage = '';
let _smartMonToolsInstalled = null;

const WINDIR = process.env.WINDIR || 'C:\\Windows';

// powerShell
let _psChild;
let _psResult = '';
let _psCmds = [];
let _psPersistent = false;
const _psToUTF8 = '$OutputEncoding = [System.Console]::OutputEncoding = [System.Console]::InputEncoding = [System.Text.Encoding]::UTF8 ; ';
const _psCmdStart = '--###START###--';
const _psError = '--ERROR--';
const _psCmdSeperator = '--###ENDCMD###--';
const _psIdSeperator = '--##ID##--';

const execOptsWin = {
  windowsHide: true,
  maxBuffer: 1024 * 20000,
  encoding: 'UTF-8',
  env: util._extend({}, process.env, { LANG: 'en_US.UTF-8' })
};

function toInt(value) {
  let result = parseInt(value, 10);
  if (isNaN(result)) {
    result = 0;
  }
  return result;
}


const stringReplace = new String().replace;
const stringToLower = new String().toLowerCase;
const stringToString = new String().toString;
const stringSubstr = new String().substr;
const stringTrim = new String().trim;
const stringStartWith = new String().startsWith;
const mathMin = Math.min;

function isFunction(functionToCheck) {
  let getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function unique(obj) {
  let uniques = [];
  let stringify = {};
  for (let i = 0; i < obj.length; i++) {
    let keys = Object.keys(obj[i]);
    keys.sort(function (a, b) { return a - b; });
    let str = '';
    for (let j = 0; j < keys.length; j++) {
      str += JSON.stringify(keys[j]);
      str += JSON.stringify(obj[i][keys[j]]);
    }
    if (!{}.hasOwnProperty.call(stringify, str)) {
      uniques.push(obj[i]);
      stringify[str] = true;
    }
  }
  return uniques;
}

function sortByKey(array, keys) {
  return array.sort(function (a, b) {
    let x = '';
    let y = '';
    keys.forEach(function (key) {
      x = x + a[key]; y = y + b[key];
    });
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

function cores() {
  if (_cores === 0) {
    _cores = os.cpus().length;
  }
  return _cores;
}

function getValue(lines, property, separator, trimmed, lineMatch) {
  separator = separator || ':';
  property = property.toLowerCase();
  trimmed = trimmed || false;
  lineMatch = lineMatch || false;
  let result = '';
  lines.some((line) => {
    let lineLower = line.toLowerCase().replace(/\t/g, '');
    if (trimmed) {
      lineLower = lineLower.trim();
    }
    if (lineLower.startsWith(property) && (lineMatch ? (lineLower.match(property + separator)) || (lineLower.match(property + ' ' + separator)) : true)) {
      const parts = trimmed ? line.trim().split(separator) : line.split(separator);
      if (parts.length >= 2) {
        parts.shift();
        result = parts.join(separator).trim();
        return true;
      }
    }
  });
  return result;
}

function decodeEscapeSequence(str, base) {
  base = base || 16;
  return str.replace(/\\x([0-9A-Fa-f]{2})/g, function () {
    return String.fromCharCode(parseInt(arguments[1], base));
  });
}

function detectSplit(str) {
  let seperator = '';
  let part = 0;
  str.split('').forEach(element => {
    if (element >= '0' && element <= '9') {
      if (part === 1) { part++; }
    } else {
      if (part === 0) { part++; }
      if (part === 1) {
        seperator += element;
      }
    }
  });
  return seperator;
}

function parseTime(t, pmDesignator) {
  pmDesignator = pmDesignator || '';
  t = t.toUpperCase();
  let hour = 0;
  let min = 0;
  let splitter = detectSplit(t);
  let parts = t.split(splitter);
  if (parts.length >= 2) {
    if (parts[2]) {
      parts[1] += parts[2];
    }
    let isPM = (parts[1] && (parts[1].toLowerCase().indexOf('pm') > -1) || (parts[1].toLowerCase().indexOf('p.m.') > -1) || (parts[1].toLowerCase().indexOf('p. m.') > -1) || (parts[1].toLowerCase().indexOf('n') > -1) || (parts[1].toLowerCase().indexOf('ch') > -1) || (parts[1].toLowerCase().indexOf('ös') > -1) || (pmDesignator && parts[1].toLowerCase().indexOf(pmDesignator) > -1));
    hour = parseInt(parts[0], 10);
    min = parseInt(parts[1], 10);
    hour = isPM && hour < 12 ? hour + 12 : hour;
    return ('0' + hour).substr(-2) + ':' + ('0' + min).substr(-2);
  }
}

function parseDateTime(dt, culture) {
  const result = {
    date: '',
    time: ''
  };
  culture = culture || {};
  let dateFormat = (culture.dateFormat || '').toLowerCase();
  let pmDesignator = (culture.pmDesignator || '');

  const parts = dt.split(' ');
  if (parts[0]) {
    if (parts[0].indexOf('/') >= 0) {
      // Dateformat: mm/dd/yyyy or dd/mm/yyyy or dd/mm/yy or yyyy/mm/dd
      const dtparts = parts[0].split('/');
      if (dtparts.length === 3) {
        if (dtparts[0].length === 4) {
          // Dateformat: yyyy/mm/dd
          result.date = dtparts[0] + '-' + ('0' + dtparts[1]).substr(-2) + '-' + ('0' + dtparts[2]).substr(-2);
        } else if (dtparts[2].length === 2) {
          if ((dateFormat.indexOf('/d/') > -1 || dateFormat.indexOf('/dd/') > -1)) {
            // Dateformat: mm/dd/yy
            result.date = '20' + dtparts[2] + '-' + ('0' + dtparts[1]).substr(-2) + '-' + ('0' + dtparts[0]).substr(-2);
          } else {
            // Dateformat: dd/mm/yy
            result.date = '20' + dtparts[2] + '-' + ('0' + dtparts[1]).substr(-2) + '-' + ('0' + dtparts[0]).substr(-2);
          }
        } else {
          // Dateformat: mm/dd/yyyy or dd/mm/yyyy
          const isEN = ((dt.toLowerCase().indexOf('pm') > -1) || (dt.toLowerCase().indexOf('p.m.') > -1) || (dt.toLowerCase().indexOf('p. m.') > -1) || (dt.toLowerCase().indexOf('am') > -1) || (dt.toLowerCase().indexOf('a.m.') > -1) || (dt.toLowerCase().indexOf('a. m.') > -1));
          if ((isEN || dateFormat.indexOf('/d/') > -1 || dateFormat.indexOf('/dd/') > -1) && dateFormat.indexOf('dd/') !== 0) {
            // Dateformat: mm/dd/yyyy
            result.date = dtparts[2] + '-' + ('0' + dtparts[0]).substr(-2) + '-' + ('0' + dtparts[1]).substr(-2);
          } else {
            // Dateformat: dd/mm/yyyy
            result.date = dtparts[2] + '-' + ('0' + dtparts[1]).substr(-2) + '-' + ('0' + dtparts[0]).substr(-2);
          }
        }
      }
    }
    if (parts[0].indexOf('.') >= 0) {
      const dtparts = parts[0].split('.');
      if (dtparts.length === 3) {
        if (dateFormat.indexOf('.d.') > -1 || dateFormat.indexOf('.dd.') > -1) {
          // Dateformat: mm.dd.yyyy
          result.date = dtparts[2] + '-' + ('0' + dtparts[0]).substr(-2) + '-' + ('0' + dtparts[1]).substr(-2);
        } else {
          // Dateformat: dd.mm.yyyy
          result.date = dtparts[2] + '-' + ('0' + dtparts[1]).substr(-2) + '-' + ('0' + dtparts[0]).substr(-2);
        }
      }
    }
    if (parts[0].indexOf('-') >= 0) {
      // Dateformat: yyyy-mm-dd
      const dtparts = parts[0].split('-');
      if (dtparts.length === 3) {
        result.date = dtparts[0] + '-' + ('0' + dtparts[1]).substr(-2) + '-' + ('0' + dtparts[2]).substr(-2);
      }
    }
  }
  if (parts[1]) {
    parts.shift();
    let time = parts.join(' ');
    result.time = parseTime(time, pmDesignator);
  }
  return result;
}

function parseHead(head, rights) {
  let space = (rights > 0);
  let count = 1;
  let from = 0;
  let to = 0;
  let result = [];
  for (let i = 0; i < head.length; i++) {
    if (count <= rights) {
      if (/\s/.test(head[i]) && !space) {
        to = i - 1;
        result.push({
          from: from,
          to: to + 1,
          cap: head.substring(from, to + 1)
        });
        from = to + 2;
        count++;
      }
      space = head[i] === ' ';
    } else {
      if (!/\s/.test(head[i]) && space) {
        to = i - 1;
        if (from < to) {
          result.push({
            from: from,
            to: to,
            cap: head.substring(from, to)
          });
        }
        from = to + 1;
        count++;
      }
      space = head[i] === ' ';
    }
  }
  to = 5000;
  result.push({
    from: from,
    to: to,
    cap: head.substring(from, to)
  });
  let len = result.length;
  for (let i = 0; i < len; i++) {
    if (result[i].cap.replace(/\s/g, '').length === 0) {
      if (i + 1 < len) {
        result[i].to = result[i + 1].to;
        result[i].cap = result[i].cap + result[i + 1].cap;
        result.splice(i + 1, 1);
        len = len - 1;
      }
    }
  }
  return result;
}

function findObjectByKey(array, key, value) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return i;
    }
  }
  return -1;
}

function getWmic() {
  if (os.type() === 'Windows_NT' && !wmicPath) {
    wmicPath = WINDIR + '\\system32\\wbem\\wmic.exe';
    if (!fs.existsSync(wmicPath)) {
      try {
        const wmicPathArray = execSync('WHERE WMIC', execOptsWin).toString().split('\r\n');
        if (wmicPathArray && wmicPathArray.length) {
          wmicPath = wmicPathArray[0];
        } else {
          wmicPath = 'wmic';
        }
      } catch (e) {
        wmicPath = 'wmic';
      }
    }
  }
  return wmicPath;
}

function wmic(command) {
  return new Promise((resolve) => {
    process.nextTick(() => {
      try {
        powerShell(getWmic() + ' ' + command).then(stdout => {
          resolve(stdout, '');
        });
      } catch (e) {
        resolve('', e);
      }
    });
  });
}

function getVboxmanage() {
  return _windows ? `"${process.env.VBOX_INSTALL_PATH || process.env.VBOX_MSI_INSTALL_PATH}\\VBoxManage.exe"` : 'vboxmanage';
}

function powerShellProceedResults(data) {
  let id = '';
  let parts;
  let res = '';
  // startID
  if (data.indexOf(_psCmdStart) >= 0) {
    parts = data.split(_psCmdStart);
    const parts2 = parts[1].split(_psIdSeperator);
    id = parts2[0];
    if (parts2.length > 1) {
      data = parts2.slice(1).join(_psIdSeperator);
    }
  }
  // result;
  if (data.indexOf(_psCmdSeperator) >= 0) {
    parts = data.split(_psCmdSeperator);
    res = parts[0];
  }
  let remove = -1;
  for (let i = 0; i < _psCmds.length; i++) {
    if (_psCmds[i].id === id) {
      remove = i;
      _psCmds[i].callback(res);
    }
  }
  if (remove >= 0) {
    _psCmds.splice(remove, 1);
  }
}

function powerShellStart() {
  if (!_psChild) {
    _psChild = spawn('powershell.exe', ['-NoProfile', '-NoLogo', '-InputFormat', 'Text', '-NoExit', '-Command', '-'], {
      stdio: 'pipe',
      windowsHide: true,
      maxBuffer: 1024 * 20000,
      encoding: 'UTF-8',
      env: util._extend({}, process.env, { LANG: 'en_US.UTF-8' })
    });
    if (_psChild && _psChild.pid) {
      _psPersistent = true;
      _psChild.stdout.on('data', function (data) {
        _psResult = _psResult + data.toString('utf8');
        if (data.indexOf(_psCmdSeperator) >= 0) {
          powerShellProceedResults(_psResult);
          _psResult = '';
        }
      });
      _psChild.stderr.on('data', function () {
        powerShellProceedResults(_psResult + _psError);
      });
      _psChild.on('error', function () {
        powerShellProceedResults(_psResult + _psError);
      });
      _psChild.on('close', function () {
        _psChild.kill();
      });
    }
  }
}

function powerShellRelease() {
  try {
    if (_psChild) {
      _psChild.stdin.write('exit' + os.EOL);
      _psChild.stdin.end();
      _psPersistent = false;
    }
  } catch (e) {
    if (_psChild) { _psChild.kill(); }
  }
  _psChild = null;
}

function powerShell(cmd) {

  if (_psPersistent) {
    const id = Math.random().toString(36).substring(2, 12);
    return new Promise((resolve) => {
      process.nextTick(() => {
        function callback(data) {
          resolve(data);
        }
        _psCmds.push({
          id,
          cmd,
          callback,
          start: new Date()
        });
        try {
          if (_psChild && _psChild.pid) {
            _psChild.stdin.write(_psToUTF8 + 'echo ' + _psCmdStart + id + _psIdSeperator + '; ' + os.EOL + cmd + os.EOL + 'echo ' + _psCmdSeperator + os.EOL);
          }
        } catch (e) {
          resolve('');
        }
      });
    });

  } else {
    let result = '';

    return new Promise((resolve) => {
      process.nextTick(() => {
        try {
          const child = spawn('powershell.exe', ['-NoProfile', '-NoLogo', '-InputFormat', 'Text', '-NoExit', '-ExecutionPolicy', 'Unrestricted', '-Command', '-'], {
            stdio: 'pipe',
            windowsHide: true,
            maxBuffer: 1024 * 20000,
            encoding: 'UTF-8',
            env: util._extend({}, process.env, { LANG: 'en_US.UTF-8' })
          });

          if (child && !child.pid) {
            child.on('error', function () {
              resolve(result);
            });
          }
          if (child && child.pid) {
            child.stdout.on('data', function (data) {
              result = result + data.toString('utf8');
            });
            child.stderr.on('data', function () {
              child.kill();
              resolve(result);
            });
            child.on('close', function () {
              child.kill();

              resolve(result);
            });
            child.on('error', function () {
              child.kill();
              resolve(result);
            });
            try {
              child.stdin.write(_psToUTF8 + cmd + os.EOL);
              child.stdin.write('exit' + os.EOL);
              child.stdin.end();
            } catch (e) {
              child.kill();
              resolve(result);
            }
          } else {
            resolve(result);
          }
        } catch (e) {
          resolve(result);
        }
      });
    });
  }
}

function execSafe(cmd, args, options) {
  let result = '';
  options = options || {};

  return new Promise((resolve) => {
    process.nextTick(() => {
      try {
        const child = spawn(cmd, args, options);

        if (child && !child.pid) {
          child.on('error', function () {
            resolve(result);
          });
        }
        if (child && child.pid) {
          child.stdout.on('data', function (data) {
            result += data.toString();
          });
          child.on('close', function () {
            child.kill();
            resolve(result);
          });
          child.on('error', function () {
            child.kill();
            resolve(result);
          });
        } else {
          resolve(result);
        }
      } catch (e) {
        resolve(result);
      }
    });
  });
}

function getCodepage() {
  if (_windows) {
    if (!codepage) {
      try {
        const stdout = execSync('chcp', execOptsWin);
        const lines = stdout.toString().split('\r\n');
        const parts = lines[0].split(':');
        codepage = parts.length > 1 ? parts[1].replace('.', '').trim() : '';
      } catch (err) {
        codepage = '437';
      }
    }
    return codepage;
  }
  if (_linux || _darwin || _freebsd || _openbsd || _netbsd) {
    if (!codepage) {
      try {
        const stdout = execSync('echo $LANG');
        const lines = stdout.toString().split('\r\n');
        const parts = lines[0].split('.');
        codepage = parts.length > 1 ? parts[1].trim() : '';
        if (!codepage) {
          codepage = 'UTF-8';
        }
      } catch (err) {
        codepage = 'UTF-8';
      }
    }
    return codepage;
  }
}

function smartMonToolsInstalled() {
  if (_smartMonToolsInstalled !== null) {
    return _smartMonToolsInstalled;
  }
  _smartMonToolsInstalled = false;
  if (_windows) {
    try {
      const pathArray = execSync('WHERE smartctl 2>nul', execOptsWin).toString().split('\r\n');
      if (pathArray && pathArray.length) {
        _smartMonToolsInstalled = pathArray[0].indexOf(':\\') >= 0;
      } else {
        _smartMonToolsInstalled = false;
      }
    } catch (e) {
      _smartMonToolsInstalled = false;
    }
  }
  if (_linux || _darwin || _freebsd || _openbsd || _netbsd) {
    try {
      const pathArray = execSync('which smartctl 2>/dev/null', execOptsWin).toString().split('\r\n');
      _smartMonToolsInstalled = pathArray.length > 0;
    } catch (e) {
      util.noop();
    }
  }
  return _smartMonToolsInstalled;
}

function isRaspberry() {
  const PI_MODEL_NO = [
    'BCM2708',
    'BCM2709',
    'BCM2710',
    'BCM2711',
    'BCM2835',
    'BCM2836',
    'BCM2837',
    'BCM2837B0'
  ];
  let cpuinfo = [];
  try {
    cpuinfo = fs.readFileSync('/proc/cpuinfo', { encoding: 'utf8' }).toString().split('\n');
  } catch (e) {
    return false;
  }
  const hardware = getValue(cpuinfo, 'hardware');
  return (hardware && PI_MODEL_NO.indexOf(hardware) > -1);
}

function isRaspbian() {
  let osrelease = [];
  try {
    osrelease = fs.readFileSync('/etc/os-release', { encoding: 'utf8' }).toString().split('\n');
  } catch (e) {
    return false;
  }
  const id = getValue(osrelease, 'id', '=');
  return (id && id.indexOf('raspbian') > -1);
}

function execWin(cmd, opts, callback) {
  if (!callback) {
    callback = opts;
    opts = execOptsWin;
  }
  let newCmd = 'chcp 65001 > nul && cmd /C ' + cmd + ' && chcp ' + codepage + ' > nul';
  exec(newCmd, opts, function (error, stdout) {
    callback(error, stdout);
  });
}

function darwinXcodeExists() {
  const cmdLineToolsExists = fs.existsSync('/Library/Developer/CommandLineTools/usr/bin/');
  const xcodeAppExists = fs.existsSync('/Applications/Xcode.app/Contents/Developer/Tools');
  const xcodeExists = fs.existsSync('/Library/Developer/Xcode/');
  return (cmdLineToolsExists || xcodeExists || xcodeAppExists);
}

function nanoSeconds() {
  const time = process.hrtime();
  if (!Array.isArray(time) || time.length !== 2) {
    return 0;
  }
  return +time[0] * 1e9 + +time[1];
}

function countUniqueLines(lines, startingWith) {
  startingWith = startingWith || '';
  const uniqueLines = [];
  lines.forEach(line => {
    if (line.startsWith(startingWith)) {
      if (uniqueLines.indexOf(line) === -1) {
        uniqueLines.push(line);
      }
    }
  });
  return uniqueLines.length;
}

function countLines(lines, startingWith) {
  startingWith = startingWith || '';
  const uniqueLines = [];
  lines.forEach(line => {
    if (line.startsWith(startingWith)) {
      uniqueLines.push(line);
    }
  });
  return uniqueLines.length;
}

function sanitizeShellString(str, strict) {
  if (typeof strict === 'undefined') { strict = false; }
  const s = str || '';
  let result = '';
  for (let i = 0; i <= mathMin(s.length, 2000); i++) {
    if (!(s[i] === undefined ||
      s[i] === '>' ||
      s[i] === '<' ||
      s[i] === '*' ||
      s[i] === '?' ||
      s[i] === '[' ||
      s[i] === ']' ||
      s[i] === '|' ||
      s[i] === '˚' ||
      s[i] === '$' ||
      s[i] === ';' ||
      s[i] === '&' ||
      s[i] === '(' ||
      s[i] === ')' ||
      s[i] === ']' ||
      s[i] === '#' ||
      s[i] === '\\' ||
      s[i] === '\t' ||
      s[i] === '\n' ||
      s[i] === '\'' ||
      s[i] === '`' ||
      s[i] === '"' ||
      s[i].length > 1 ||
      (strict && s[i] === '@') ||
      (strict && s[i] === ' ') ||
      (strict && s[i] == '{') ||
      (strict && s[i] == ')'))) {
      result = result + s[i];
    }
  }
  return result;
}

function isPrototypePolluted() {
  const s = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let notPolluted = true;
  let st = '';

  st.__proto__.replace = stringReplace;
  st.__proto__.toLowerCase = stringToLower;
  st.__proto__.toString = stringToString;
  st.__proto__.substr = stringSubstr;

  notPolluted = notPolluted || (s.length !== 62);
  const ms = Date.now();
  if (typeof ms === 'number' && ms > 1600000000000) {
    const l = ms % 100 + 15;
    for (let i = 0; i < l; i++) {
      const r = Math.random() * 61.99999999 + 1;
      const rs = parseInt(Math.floor(r).toString(), 10);
      const rs2 = parseInt(r.toString().split('.')[0], 10);
      const q = Math.random() * 61.99999999 + 1;
      const qs = parseInt(Math.floor(q).toString(), 10);
      const qs2 = parseInt(q.toString().split('.')[0], 10);
      notPolluted = notPolluted && (r !== q);
      notPolluted = notPolluted && rs === rs2 && qs === qs2;
      st += s[rs - 1];
    }
    notPolluted = notPolluted && st.length === l;
    // string manipulation
    let p = Math.random() * l * 0.9999999999;
    let stm = st.substr(0, p) + ' ' + st.substr(p, 2000);
    stm.__proto__.replace = stringReplace;
    let sto = stm.replace(/ /g, '');
    notPolluted = notPolluted && st === sto;
    p = Math.random() * l * 0.9999999999;
    stm = st.substr(0, p) + '{' + st.substr(p, 2000);
    sto = stm.replace(/{/g, '');
    notPolluted = notPolluted && st === sto;
    p = Math.random() * l * 0.9999999999;
    stm = st.substr(0, p) + '*' + st.substr(p, 2000);
    sto = stm.replace(/\*/g, '');
    notPolluted = notPolluted && st === sto;
    p = Math.random() * l * 0.9999999999;
    stm = st.substr(0, p) + '$' + st.substr(p, 2000);
    sto = stm.replace(/\$/g, '');
    notPolluted = notPolluted && st === sto;

    // lower
    const stl = st.toLowerCase();
    notPolluted = notPolluted && (stl.length === l) && stl[l - 1] && !(stl[l]);
    for (let i = 0; i < l; i++) {
      const s1 = st[i];
      s1.__proto__.toLowerCase = stringToLower;
      const s2 = stl ? stl[i] : '';
      const s1l = s1.toLowerCase();
      notPolluted = notPolluted && s1l[0] === s2 && s1l[0] && !(s1l[1]);
    }
  }
  return !notPolluted;
}

function hex2bin(hex) {
  return ('00000000' + (parseInt(hex, 16)).toString(2)).substr(-8);
}

function getFilesInPath(source) {
  const lstatSync = fs.lstatSync;
  const readdirSync = fs.readdirSync;
  const join = path.join;

  function isDirectory(source) {
    return lstatSync(source).isDirectory();
  }
  function isFile(source) { return lstatSync(source).isFile(); }

  function getDirectories(source) {
    return readdirSync(source).map(function (name) { return join(source, name); }).filter(isDirectory);
  }
  function getFiles(source) {
    return readdirSync(source).map(function (name) { return join(source, name); }).filter(isFile);
  }

  function getFilesRecursively(source) {
    try {
      let dirs = getDirectories(source);
      let files = dirs
        .map(function (dir) { return getFilesRecursively(dir); })
        .reduce(function (a, b) { return a.concat(b); }, []);
      return files.concat(getFiles(source));
    } catch (e) {
      return [];
    }
  }

  if (fs.existsSync(source)) {
    return getFilesRecursively(source);
  } else {
    return [];
  }
}

function decodePiCpuinfo(lines) {

  // https://www.raspberrypi.org/documentation/hardware/raspberrypi/revision-codes/README.md

  const oldRevisionCodes = {
    '0002': {
      type: 'B',
      revision: '1.0',
      memory: 256,
      manufacturer: 'Egoman',
      processor: 'BCM2835'
    },
    '0003': {
      type: 'B',
      revision: '1.0',
      memory: 256,
      manufacturer: 'Egoman',
      processor: 'BCM2835'
    },
    '0004': {
      type: 'B',
      revision: '2.0',
      memory: 256,
      manufacturer: 'Sony UK',
      processor: 'BCM2835'
    },
    '0005': {
      type: 'B',
      revision: '2.0',
      memory: 256,
      manufacturer: 'Qisda',
      processor: 'BCM2835'
    },
    '0006': {
      type: 'B',
      revision: '2.0',
      memory: 256,
      manufacturer: 'Egoman',
      processor: 'BCM2835'
    },
    '0007': {
      type: 'A',
      revision: '2.0',
      memory: 256,
      manufacturer: 'Egoman',
      processor: 'BCM2835'
    },
    '0008': {
      type: 'A',
      revision: '2.0',
      memory: 256,
      manufacturer: 'Sony UK',
      processor: 'BCM2835'
    },
    '0009': {
      type: 'A',
      revision: '2.0',
      memory: 256,
      manufacturer: 'Qisda',
      processor: 'BCM2835'
    },
    '000d': {
      type: 'B',
      revision: '2.0',
      memory: 512,
      manufacturer: 'Egoman',
      processor: 'BCM2835'
    },
    '000e': {
      type: 'B',
      revision: '2.0',
      memory: 512,
      manufacturer: 'Sony UK',
      processor: 'BCM2835'
    },
    '000f': {
      type: 'B',
      revision: '2.0',
      memory: 512,
      manufacturer: 'Egoman',
      processor: 'BCM2835'
    },
    '0010': {
      type: 'B+',
      revision: '1.2',
      memory: 512,
      manufacturer: 'Sony UK',
      processor: 'BCM2835'
    },
    '0011': {
      type: 'CM1',
      revision: '1.0',
      memory: 512,
      manufacturer: 'Sony UK',
      processor: 'BCM2835'
    },
    '0012': {
      type: 'A+',
      revision: '1.1',
      memory: 256,
      manufacturer: 'Sony UK',
      processor: 'BCM2835'
    },
    '0013': {
      type: 'B+',
      revision: '1.2',
      memory: 512,
      manufacturer: 'Embest',
      processor: 'BCM2835'
    },
    '0014': {
      type: 'CM1',
      revision: '1.0',
      memory: 512,
      manufacturer: 'Embest',
      processor: 'BCM2835'
    },
    '0015': {
      type: 'A+',
      revision: '1.1',
      memory: 256,
      manufacturer: '512MB	Embest',
      processor: 'BCM2835'
    }
  };

  const processorList = [
    'BCM2835',
    'BCM2836',
    'BCM2837',
    'BCM2711',
  ];
  const manufacturerList = [
    'Sony UK',
    'Egoman',
    'Embest',
    'Sony Japan',
    'Embest',
    'Stadium'
  ];
  const typeList = {
    '00': 'A',
    '01': 'B',
    '02': 'A+',
    '03': 'B+',
    '04': '2B',
    '05': 'Alpha (early prototype)',
    '06': 'CM1',
    '08': '3B',
    '09': 'Zero',
    '0a': 'CM3',
    '0c': 'Zero W',
    '0d': '3B+',
    '0e': '3A+',
    '0f': 'Internal use only',
    '10': 'CM3+',
    '11': '4B',
    '12': 'Zero 2 W',
    '13': '400',
    '14': 'CM4'
  };

  const revisionCode = getValue(lines, 'revision', ':', true);
  const model = getValue(lines, 'model:', ':', true);
  const serial = getValue(lines, 'serial', ':', true);

  let result = {};
  if ({}.hasOwnProperty.call(oldRevisionCodes, revisionCode)) {
    // old revision codes
    result = {
      model,
      serial,
      revisionCode,
      memory: oldRevisionCodes[revisionCode].memory,
      manufacturer: oldRevisionCodes[revisionCode].manufacturer,
      processor: oldRevisionCodes[revisionCode].processor,
      type: oldRevisionCodes[revisionCode].type,
      revision: oldRevisionCodes[revisionCode].revision,
    };

  } else {
    // new revision code
    const revision = ('00000000' + getValue(lines, 'revision', ':', true).toLowerCase()).substr(-8);
    const memSizeCode = parseInt(hex2bin(revision.substr(2, 1)).substr(5, 3), 2) || 0;
    const manufacturer = manufacturerList[parseInt(revision.substr(3, 1), 10)];
    const processor = processorList[parseInt(revision.substr(4, 1), 10)];
    const typeCode = revision.substr(5, 2);


    result = {
      model,
      serial,
      revisionCode,
      memory: 256 * Math.pow(2, memSizeCode),
      manufacturer,
      processor,
      type: {}.hasOwnProperty.call(typeList, typeCode) ? typeList[typeCode] : '',
      revision: '1.' + revision.substr(7, 1),
    };
  }
  return result;
}

function promiseAll(promises) {
  const resolvingPromises = promises.map(function (promise) {
    return new Promise(function (resolve) {
      let payload = new Array(2);
      promise.then(function (result) {
        payload[0] = result;
      })
        .catch(function (error) {
          payload[1] = error;
        })
        .then(function () {
          // The wrapped Promise returns an array: 0 = result, 1 = error ... we resolve all
          resolve(payload);
        });
    });
  });
  const errors = [];
  const results = [];

  // Execute all wrapped Promises
  return Promise.all(resolvingPromises)
    .then(function (items) {
      items.forEach(function (payload) {
        if (payload[1]) {
          errors.push(payload[1]);
          results.push(null);
        } else {
          errors.push(null);
          results.push(payload[0]);
        }
      });

      return {
        errors: errors,
        results: results
      };
    });
}

function promisify(nodeStyleFunction) {
  return function () {
    const args = Array.prototype.slice.call(arguments);
    return new Promise(function (resolve, reject) {
      args.push(function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
      nodeStyleFunction.apply(null, args);
    });
  };
}

function promisifySave(nodeStyleFunction) {
  return function () {
    const args = Array.prototype.slice.call(arguments);
    return new Promise(function (resolve) {
      args.push(function (err, data) {
        resolve(data);
      });
      nodeStyleFunction.apply(null, args);
    });
  };
}

function linuxVersion() {
  let result = '';
  if (_linux) {
    try {
      result = execSync('uname -v').toString();
    } catch (e) {
      result = '';
    }
  }
  return result;
}

function plistParser(xmlStr) {
  const tags = ['array', 'dict', 'key', 'string', 'integer', 'date', 'real', 'data', 'boolean', 'arrayEmpty'];
  const startStr = '<plist version';

  let pos = xmlStr.indexOf(startStr);
  let len = xmlStr.length;
  while (xmlStr[pos] !== '>' && pos < len) {
    pos++;
  }

  let depth = 0;
  let inTagStart = false;
  let inTagContent = false;
  let inTagEnd = false;
  let metaData = [{ tagStart: '', tagEnd: '', tagContent: '', key: '', data: null }];
  let c = '';
  let cn = xmlStr[pos];

  while (pos < len) {
    c = cn;
    if (pos + 1 < len) { cn = xmlStr[pos + 1]; }
    if (c === '<') {
      inTagContent = false;
      if (cn === '/') { inTagEnd = true; }
      else if (metaData[depth].tagStart) {
        metaData[depth].tagContent = '';
        if (!metaData[depth].data) { metaData[depth].data = metaData[depth].tagStart === 'array' ? [] : {}; }
        depth++;
        metaData.push({ tagStart: '', tagEnd: '', tagContent: '', key: null, data: null });
        inTagStart = true;
        inTagContent = false;
      }
      else if (!inTagStart) { inTagStart = true; }
    } else if (c === '>') {
      if (metaData[depth].tagStart === 'true/') { inTagStart = false; inTagEnd = true; metaData[depth].tagStart = ''; metaData[depth].tagEnd = '/boolean'; metaData[depth].data = true; }
      if (metaData[depth].tagStart === 'false/') { inTagStart = false; inTagEnd = true; metaData[depth].tagStart = ''; metaData[depth].tagEnd = '/boolean'; metaData[depth].data = false; }
      if (metaData[depth].tagStart === 'array/') { inTagStart = false; inTagEnd = true; metaData[depth].tagStart = ''; metaData[depth].tagEnd = '/arrayEmpty'; metaData[depth].data = []; }
      if (inTagContent) { inTagContent = false; }
      if (inTagStart) {
        inTagStart = false;
        inTagContent = true;
        if (metaData[depth].tagStart === 'array') {
          metaData[depth].data = [];
        }
        if (metaData[depth].tagStart === 'dict') {
          metaData[depth].data = {};
        }
      }
      if (inTagEnd) {
        inTagEnd = false;
        if (metaData[depth].tagEnd && tags.indexOf(metaData[depth].tagEnd.substr(1)) >= 0) {
          if (metaData[depth].tagEnd === '/dict' || metaData[depth].tagEnd === '/array') {
            if (depth > 1 && metaData[depth - 2].tagStart === 'array') {
              metaData[depth - 2].data.push(metaData[depth - 1].data);
            }
            if (depth > 1 && metaData[depth - 2].tagStart === 'dict') {
              metaData[depth - 2].data[metaData[depth - 1].key] = metaData[depth - 1].data;
            }
            depth--;
            metaData.pop();
            metaData[depth].tagContent = '';
            metaData[depth].tagStart = '';
            metaData[depth].tagEnd = '';
          }
          else {
            if (metaData[depth].tagEnd === '/key' && metaData[depth].tagContent) {
              metaData[depth].key = metaData[depth].tagContent;
            } else {
              if (metaData[depth].tagEnd === '/real' && metaData[depth].tagContent) { metaData[depth].data = parseFloat(metaData[depth].tagContent) || 0; }
              if (metaData[depth].tagEnd === '/integer' && metaData[depth].tagContent) { metaData[depth].data = parseInt(metaData[depth].tagContent) || 0; }
              if (metaData[depth].tagEnd === '/string' && metaData[depth].tagContent) { metaData[depth].data = metaData[depth].tagContent || ''; }
              if (metaData[depth].tagEnd === '/boolean') { metaData[depth].data = metaData[depth].tagContent || false; }
              if (metaData[depth].tagEnd === '/arrayEmpty') { metaData[depth].data = metaData[depth].tagContent || []; }
              if (depth > 0 && metaData[depth - 1].tagStart === 'array') { metaData[depth - 1].data.push(metaData[depth].data); }
              if (depth > 0 && metaData[depth - 1].tagStart === 'dict') { metaData[depth - 1].data[metaData[depth].key] = metaData[depth].data; }
            }
            metaData[depth].tagContent = '';
            metaData[depth].tagStart = '';
            metaData[depth].tagEnd = '';
          }
        }
        metaData[depth].tagEnd = '';
        inTagStart = false;
        inTagContent = false;
      }
    } else {
      if (inTagStart) { metaData[depth].tagStart += c; }
      if (inTagEnd) { metaData[depth].tagEnd += c; }
      if (inTagContent) { metaData[depth].tagContent += c; }
    }
    pos++;
  }
  return metaData[0].data;
}

function strIsNumeric(str) {
  return typeof str === 'string' && !isNaN(str) && !isNaN(parseFloat(str));
}

function plistReader(output) {
  const lines = output.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].indexOf(' = ') >= 0) {
      const lineParts = lines[i].split(' = ');
      lineParts[0] = lineParts[0].trim();
      if (!lineParts[0].startsWith('"')) {
        lineParts[0] = '"' + lineParts[0] + '"';
      }
      lineParts[1] = lineParts[1].trim();
      if (lineParts[1].indexOf('"') === -1 && lineParts[1].endsWith(';')) {
        const valueString = lineParts[1].substring(0, lineParts[1].length - 1);
        if (!strIsNumeric(valueString)) {
          lineParts[1] = `"${valueString}";`;
        }
      }
      if (lineParts[1].indexOf('"') >= 0 && lineParts[1].endsWith(';')) {
        const valueString = lineParts[1].substring(0, lineParts[1].length - 1).replace(/"/g, '');
        if (strIsNumeric(valueString)) {
          lineParts[1] = `${valueString};`;
        }
      }
      lines[i] = lineParts.join(' : ');
    }
    lines[i] = lines[i].replace(/\(/g, '[').replace(/\)/g, ']').replace(/;/g, ',').trim();
    if (lines[i].startsWith('}') && lines[i - 1] && lines[i - 1].endsWith(',')) {
      lines[i - 1] = lines[i - 1].substring(0, lines[i - 1].length - 1);
    }
  }
  output = lines.join('');
  let obj = {};
  try {
    obj = JSON.parse(output);
  } catch (e) {
    noop();
  }
  return obj;
}

function semverCompare(v1, v2) {
  let res = 0;
  const parts1 = v1.split('.');
  const parts2 = v2.split('.');
  if (parts1[0] < parts2[0]) { res = 1; }
  else if (parts1[0] > parts2[0]) { res = -1; }
  else if (parts1[0] === parts2[0] && parts1.length >= 2 && parts2.length >= 2) {
    if (parts1[1] < parts2[1]) { res = 1; }
    else if (parts1[1] > parts2[1]) { res = -1; }
    else if (parts1[1] === parts2[1]) {
      if (parts1.length >= 3 && parts2.length >= 3) {
        if (parts1[2] < parts2[2]) { res = 1; }
        else if (parts1[2] > parts2[2]) { res = -1; }
      } else if (parts2.length >= 3) {
        res = 1;
      }
    }
  }
  return res;
}

function noop() { }

exports.toInt = toInt;
exports.execOptsWin = execOptsWin;
exports.getCodepage = getCodepage;
exports.execWin = execWin;
exports.isFunction = isFunction;
exports.unique = unique;
exports.sortByKey = sortByKey;
exports.cores = cores;
exports.getValue = getValue;
exports.decodeEscapeSequence = decodeEscapeSequence;
exports.parseDateTime = parseDateTime;
exports.parseHead = parseHead;
exports.findObjectByKey = findObjectByKey;
exports.getWmic = getWmic;
exports.wmic = wmic;
exports.darwinXcodeExists = darwinXcodeExists;
exports.getVboxmanage = getVboxmanage;
exports.powerShell = powerShell;
exports.powerShellStart = powerShellStart;
exports.powerShellRelease = powerShellRelease;
exports.execSafe = execSafe;
exports.nanoSeconds = nanoSeconds;
exports.countUniqueLines = countUniqueLines;
exports.countLines = countLines;
exports.noop = noop;
exports.isRaspberry = isRaspberry;
exports.isRaspbian = isRaspbian;
exports.sanitizeShellString = sanitizeShellString;
exports.isPrototypePolluted = isPrototypePolluted;
exports.decodePiCpuinfo = decodePiCpuinfo;
exports.promiseAll = promiseAll;
exports.promisify = promisify;
exports.promisifySave = promisifySave;
exports.smartMonToolsInstalled = smartMonToolsInstalled;
exports.linuxVersion = linuxVersion;
exports.plistParser = plistParser;
exports.plistReader = plistReader;
exports.stringReplace = stringReplace;
exports.stringToLower = stringToLower;
exports.stringToString = stringToString;
exports.stringSubstr = stringSubstr;
exports.stringTrim = stringTrim;
exports.stringStartWith = stringStartWith;
exports.mathMin = mathMin;
exports.WINDIR = WINDIR;
exports.getFilesInPath = getFilesInPath;
exports.semverCompare = semverCompare;
