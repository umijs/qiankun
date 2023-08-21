"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContrastPicker = exports.ColorPicker = void 0;
const namedColors = {
    red: { red: 255, green: 0, blue: 0 },
    green: { red: 0, green: 255, blue: 0 },
    blue: { red: 0, green: 0, blue: 255 },
    yellow: { red: 255, green: 255, blue: 0 },
    cyan: { red: 0, green: 255, blue: 255 },
    magenta: { red: 255, green: 0, blue: 255 },
    white: { red: 255, green: 255, blue: 255 },
    black: { red: 0, green: 0, blue: 0 }
};
function getChannelColor(color, deflt) {
    const col = color || { color: deflt };
    let channel = Object.prototype.hasOwnProperty.call(col, 'color')
        ? namedColors[col.color]
        : col;
    if (!channel) {
        channel = namedColors[deflt];
    }
    channel.alpha = Object.prototype.hasOwnProperty.call(col, 'alpha')
        ? col.alpha
        : 1;
    return normalizeColor(channel);
}
function normalizeColor(color) {
    const normalizeCol = (col) => {
        col = Math.max(col, 0);
        col = Math.min(255, col);
        return Math.round(col);
    };
    color.red = normalizeCol(color.red);
    color.green = normalizeCol(color.green);
    color.blue = normalizeCol(color.blue);
    color.alpha = Math.max(color.alpha, 0);
    color.alpha = Math.min(1, color.alpha);
    return color;
}
class ColorPicker {
    constructor(background, foreground) {
        this.foreground = getChannelColor(foreground, ColorPicker.DEFAULT_FOREGROUND_);
        this.background = getChannelColor(background, ColorPicker.DEFAULT_BACKGROUND_);
    }
    static toHex(num) {
        const hex = num.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
    rgba() {
        const rgba = function (col) {
            return ('rgba(' +
                col.red +
                ',' +
                col.green +
                ',' +
                col.blue +
                ',' +
                col.alpha +
                ')');
        };
        return {
            background: rgba(this.background),
            foreground: rgba(this.foreground)
        };
    }
    rgb() {
        const rgb = function (col) {
            return 'rgb(' + col.red + ',' + col.green + ',' + col.blue + ')';
        };
        return {
            background: rgb(this.background),
            alphaback: this.background.alpha.toString(),
            foreground: rgb(this.foreground),
            alphafore: this.foreground.alpha.toString()
        };
    }
    hex() {
        const hex = function (col) {
            return ('#' +
                ColorPicker.toHex(col.red) +
                ColorPicker.toHex(col.green) +
                ColorPicker.toHex(col.blue));
        };
        return {
            background: hex(this.background),
            alphaback: this.background.alpha.toString(),
            foreground: hex(this.foreground),
            alphafore: this.foreground.alpha.toString()
        };
    }
}
exports.ColorPicker = ColorPicker;
ColorPicker.DEFAULT_BACKGROUND_ = 'blue';
ColorPicker.DEFAULT_FOREGROUND_ = 'black';
function hsl2rgb(h, s, l) {
    s = s > 1 ? s / 100 : s;
    l = l > 1 ? l / 100 : l;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) {
        [r, g, b] = [c, x, 0];
    }
    else if (60 <= h && h < 120) {
        [r, g, b] = [x, c, 0];
    }
    else if (120 <= h && h < 180) {
        [r, g, b] = [0, c, x];
    }
    else if (180 <= h && h < 240) {
        [r, g, b] = [0, x, c];
    }
    else if (240 <= h && h < 300) {
        [r, g, b] = [x, 0, c];
    }
    else if (300 <= h && h < 360) {
        [r, g, b] = [c, 0, x];
    }
    return { red: r + m, green: g + m, blue: b + m };
}
function rgb2RGB(rgb) {
    return {
        red: Math.round(255 * rgb.red),
        green: Math.round(255 * rgb.green),
        blue: Math.round(255 * rgb.blue)
    };
}
function RGB2hex(col) {
    return 'rgb(' + col.red + ',' + col.green + ',' + col.blue + ')';
}
class ContrastPicker {
    constructor() {
        this.hue = 10;
        this.sat = 100;
        this.light = 50;
        this.incr = 50;
    }
    generate() {
        return RGB2hex(rgb2RGB(hsl2rgb(this.hue, this.sat, this.light)));
    }
    increment() {
        this.hue = (this.hue + this.incr) % 360;
    }
}
exports.ContrastPicker = ContrastPicker;
