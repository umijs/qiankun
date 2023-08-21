/*************************************************************
 *
 *  Copyright (c) 2018-2022 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import {DelimiterMap, DelimiterData, V, H} from '../../FontData.js';

export const HDW1 = [.75, .25, .875];
export const HDW2 = [.85, .349, .667];
export const HDW3 = [.583, .082, .5];
export const VSIZES = [1, 1.2, 1.8, 2.4, 3];

const DELIM2F = {c: 0x2F, dir: V, sizes: VSIZES};
const DELIMAF = {c: 0xAF, dir: H, sizes: [.5], stretch: [0, 0xAF], HDW: [.59, -0.544, .5]};
const DELIM2C6 = {c: 0x2C6, dir: H, sizes: [.5, .556, 1, 1.444, 1.889]};
const DELIM2DC = {c: 0x2DC, dir: H, sizes: [.5, .556, 1, 1.444, 1.889]};
const DELIM2013 = {c: 0x2013, dir: H, sizes: [.5], stretch: [0, 0x2013], HDW: [.285, -0.248, .5]};
const DELIM2190 = {c: 0x2190, dir: H, sizes: [1], stretch: [0x2190, 0x2212], HDW: HDW3};
const DELIM2192 = {c: 0x2192, dir: H, sizes: [1], stretch: [0, 0x2212, 0x2192], HDW: HDW3};
const DELIM2194 = {c: 0x2194, dir: H, sizes: [1], stretch: [0x2190, 0x2212, 0x2192], HDW: HDW3};
const DELIM21A4 = {c: 0x21A4, dir: H, stretch: [0x2190, 0x2212, 0x2223], HDW: HDW3, min: 1.278};
const DELIM21A6 = {c: 0x21A6, dir: H, sizes: [1], stretch: [0x2223, 0x2212, 0x2192], HDW: HDW3};
const DELIM21D0 = {c: 0x21D0, dir: H, sizes: [1], stretch: [0x21D0, 0x3D], HDW: HDW3};
const DELIM21D2 = {c: 0x21D2, dir: H, sizes: [1], stretch: [0, 0x3D, 0x21D2], HDW: HDW3};
const DELIM21D4 = {c: 0x21D4, dir: H, sizes: [1], stretch: [0x21D0, 0x3D, 0x21D2], HDW: HDW3};
const DELIM2212 = {c: 0x2212, dir: H, sizes: [.778], stretch: [0, 0x2212], HDW: HDW3};
const DELIM2223 = {c: 0x2223, dir: V, sizes: [1], stretch: [0, 0x2223], HDW: [.627, .015, .333]};
const DELIM23DC = {c: 0x23DC, dir: H, sizes: [.778, 1], schar: [0x2322, 0x2322], variants: [5, 0],
                   stretch: [0xE150, 0xE154, 0xE151], HDW: [.32, .2, .5]};
const DELIM23DD = {c: 0x23DD, dir: H, sizes: [.778, 1], schar: [0x2323, 0x2323], variants: [5, 0],
                   stretch: [0xE152, 0xE154, 0xE153], HDW: [.32, .2, .5]};
const DELIM23DE = {c: 0x23DE, dir: H, stretch: [0xE150, 0xE154, 0xE151, 0xE155], HDW: [.32, .2, .5], min: 1.8};
const DELIM23DF = {c: 0x23DF, dir: H, stretch: [0xE152, 0xE154, 0xE153, 0xE156], HDW: [.32, .2, .5], min: 1.8};
const DELIM27E8 = {c: 0x27E8, dir: V, sizes: VSIZES};
const DELIM27E9 = {c: 0x27E9, dir: V, sizes: VSIZES};
const DELIM2906 = {c: 0x2906, dir: H, stretch: [0x21D0, 0x3D, 0x2223], HDW: HDW3, min: 1.278};
const DELIM2907 = {c: 0x2907, dir: H, stretch: [0x22A8, 0x3D, 0x21D2], HDW: HDW3, min: 1.278};


export const delimiters: DelimiterMap<DelimiterData> = {
  0x28: {dir: V, sizes: VSIZES, stretch: [0x239B, 0x239C, 0x239D], HDW: [.85, .349, .875]},
  0x29: {dir: V, sizes: VSIZES, stretch: [0x239E, 0x239F, 0x23A0], HDW: [.85, .349, .875]},
  0x2D: DELIM2212,
  0x2F: DELIM2F,
  0x3D: {dir: H, sizes: [.778], stretch: [0, 0x3D], HDW: HDW3},
  0x5B: {dir: V, sizes: VSIZES, stretch: [0x23A1, 0x23A2, 0x23A3], HDW: HDW2},
  0x5C: {dir: V, sizes: VSIZES},
  0x5D: {dir: V, sizes: VSIZES, stretch: [0x23A4, 0x23A5, 0x23A6], HDW: HDW2},
  0x5E: DELIM2C6,
  0x5F: DELIM2013,
  0x7B: {dir: V, sizes: VSIZES, stretch: [0x23A7, 0x23AA, 0x23A9, 0x23A8], HDW: [.85, .349, .889]},
  0x7C: {dir: V, sizes: [1], stretch: [0, 0x2223], HDW: [.75, .25, .333]},
  0x7D: {dir: V, sizes: VSIZES, stretch: [0x23AB, 0x23AA, 0x23AD, 0x23AC], HDW: [.85, .349, .889]},
  0x7E: DELIM2DC,
  0xAF: DELIMAF,
  0x2C6: DELIM2C6,
  0x2C9: DELIMAF,
  0x2DC: DELIM2DC,
  0x302: DELIM2C6,
  0x303: DELIM2DC,
  0x332: DELIM2013,
  0x2013: DELIM2013,
  0x2014: DELIM2013,
  0x2015: DELIM2013,
  0x2016: {dir: V, sizes: [.602, 1], schar: [0, 0x2225], variants: [1, 0], stretch: [0, 0x2225], HDW: [.602, 0, .556]},
  0x2017: DELIM2013,
  0x203E: DELIMAF,
  0x20D7: DELIM2192,
  0x2190: DELIM2190,
  0x2191: {dir: V, sizes: [.888], stretch: [0x2191, 0x23D0], HDW: [.6, 0, .667]},
  0x2192: DELIM2192,
  0x2193: {dir: V, sizes: [.888], stretch: [0, 0x23D0, 0x2193], HDW: [.6, 0, .667]},
  0x2194: DELIM2194,
  0x2195: {dir: V, sizes: [1.044], stretch: [0x2191, 0x23D0, 0x2193], HDW: HDW1},
  0x219E: {dir: H, sizes: [1], stretch: [0x219E, 0x2212], HDW: HDW3},
  0x21A0: {dir: H, sizes: [1], stretch: [0, 0x2212, 0x21A0], HDW: HDW3},
  0x21A4: DELIM21A4,
  0x21A5: {dir: V, stretch: [0x2191, 0x23D0, 0x22A5], HDW: HDW1, min: 1.555},
  0x21A6: DELIM21A6,
  0x21A7: {dir: V, stretch: [0x22A4, 0x23D0, 0x2193], HDW: HDW1, min: 1.555},
  0x21B0: {dir: V, sizes: [.722], stretch: [0x21B0, 0x23D0], HDW: HDW1},
  0x21B1: {dir: V, sizes: [.722], stretch: [0x21B1, 0x23D0], HDW: HDW1},
  0x21BC: {dir: H, sizes: [1], stretch: [0x21BC, 0x2212], HDW: HDW3},
  0x21BD: {dir: H, sizes: [1], stretch: [0x21BD, 0x2212], HDW: HDW3},
  0x21BE: {dir: V, sizes: [.888], stretch: [0x21BE, 0x23D0], HDW: HDW1},
  0x21BF: {dir: V, sizes: [.888], stretch: [0x21BF, 0x23D0], HDW: HDW1},
  0x21C0: {dir: H, sizes: [1], stretch: [0, 0x2212, 0x21C0], HDW: HDW3},
  0x21C1: {dir: H, sizes: [1], stretch: [0, 0x2212, 0x21C1], HDW: HDW3},
  0x21C2: {dir: V, sizes: [.888], stretch: [0, 0x23D0, 0x21C2], HDW: HDW1},
  0x21C3: {dir: V, sizes: [.888], stretch: [0, 0x23D0, 0x21C3], HDW: HDW1},
  0x21D0: DELIM21D0,
  0x21D1: {dir: V, sizes: [.888], stretch: [0x21D1, 0x2016], HDW: [.599, 0, .778]},
  0x21D2: DELIM21D2,
  0x21D3: {dir: V, sizes: [.888], stretch: [0, 0x2016, 0x21D3], HDW: [.6, 0, .778]},
  0x21D4: DELIM21D4,
  0x21D5: {dir: V, sizes: [1.044], stretch: [0x21D1, 0x2016, 0x21D3], HDW: [.75, .25, .778]},
  0x21DA: {dir: H, sizes: [1], stretch: [0x21DA, 0x2261], HDW: [.464, -0.036, .5]},
  0x21DB: {dir: H, sizes: [1], stretch: [0, 0x2261, 0x21DB], HDW: [.464, -0.036, .5]},
  0x2212: DELIM2212,
  0x2215: DELIM2F,
  0x221A: {dir: V, sizes: VSIZES, stretch: [0xE001, 0xE000, 0x23B7], fullExt: [.65, 2.3], HDW: [.85, .35, 1.056]},
  0x2223: DELIM2223,
  0x2225: {dir: V, sizes: [1], stretch: [0, 0x2225], HDW: [.627, .015, .556]},
  0x2308: {dir: V, sizes: VSIZES, stretch: [0x23A1, 0x23A2], HDW: HDW2},
  0x2309: {dir: V, sizes: VSIZES, stretch: [0x23A4, 0x23A5], HDW: HDW2},
  0x230A: {dir: V, sizes: VSIZES, stretch: [0, 0x23A2, 0x23A3], HDW: HDW2},
  0x230B: {dir: V, sizes: VSIZES, stretch: [0, 0x23A5, 0x23A6], HDW: HDW2},
  0x2312: DELIM23DC,
  0x2322: DELIM23DC,
  0x2323: DELIM23DD,
  0x2329: DELIM27E8,
  0x232A: DELIM27E9,
  0x23AA: {dir: V, sizes: [.32], stretch: [0x23AA, 0x23AA, 0x23AA], HDW: [.29, .015, .889]},
  0x23AF: DELIM2013,
  0x23B0: {dir: V, sizes: [.989], stretch: [0x23A7, 0x23AA, 0x23AD], HDW: [.75, .25, .889]},
  0x23B1: {dir: V, sizes: [.989], stretch: [0x23AB, 0x23AA, 0x23A9], HDW: [.75, .25, .889]},
  0x23B4: {dir: H, stretch: [0x250C, 0x2212, 0x2510], HDW: HDW3, min: 1},
  0x23B5: {dir: H, stretch: [0x2514, 0x2212, 0x2518], HDW: HDW3, min: 1},
  0x23D0: {dir: V, sizes: [.602, 1], schar: [0, 0x2223], variants: [1, 0], stretch: [0, 0x2223], HDW: [.602, 0, .333]},
  0x23DC: DELIM23DC,
  0x23DD: DELIM23DD,
  0x23DE: DELIM23DE,
  0x23DF: DELIM23DF,
  0x23E0: {dir: H, stretch: [0x2CA, 0x2C9, 0x2CB], HDW: [.59, -0.544, .5], min: 1},
  0x23E1: {dir: H, stretch: [0x2CB, 0x2C9, 0x2CA], HDW: [.59, -0.544, .5], min: 1},
  0x2500: DELIM2013,
  0x2758: DELIM2223,
  0x27E8: DELIM27E8,
  0x27E9: DELIM27E9,
  0x27EE: {dir: V, sizes: [.989], stretch: [0x23A7, 0x23AA, 0x23A9], HDW: [.75, .25, .889]},
  0x27EF: {dir: V, sizes: [.989], stretch: [0x23AB, 0x23AA, 0x23AD], HDW: [.75, .25, .889]},
  0x27F5: DELIM2190,
  0x27F6: DELIM2192,
  0x27F7: DELIM2194,
  0x27F8: DELIM21D0,
  0x27F9: DELIM21D2,
  0x27FA: DELIM21D4,
  0x27FB: DELIM21A4,
  0x27FC: DELIM21A6,
  0x27FD: DELIM2906,
  0x27FE: DELIM2907,
  0x2906: DELIM2906,
  0x2907: DELIM2907,
  0x294E: {dir: H, stretch: [0x21BC, 0x2212, 0x21C0], HDW: HDW3, min: 2},
  0x294F: {dir: V, stretch: [0x21BE, 0x23D0, 0x21C2], HDW: HDW1, min: 1.776},
  0x2950: {dir: H, stretch: [0x21BD, 0x2212, 0x21C1], HDW: HDW3, min: 2},
  0x2951: {dir: V, stretch: [0x21BF, 0x23D0, 0x21C3], HDW: HDW1, min: .5},
  0x295A: {dir: H, stretch: [0x21BC, 0x2212, 0x2223], HDW: HDW3, min: 1.278},
  0x295B: {dir: H, stretch: [0x2223, 0x2212, 0x21C0], HDW: HDW3, min: 1.278},
  0x295C: {dir: V, stretch: [0x21BE, 0x23D0, 0x22A5], HDW: HDW1, min: 1.556},
  0x295D: {dir: V, stretch: [0x22A4, 0x23D0, 0x21C2], HDW: HDW1, min: 1.556},
  0x295E: {dir: H, stretch: [0x21BD, 0x2212, 0x2223], HDW: HDW3, min: 1.278},
  0x295F: {dir: H, stretch: [0x2223, 0x2212, 0x21C1], HDW: HDW3, min: 1.278},
  0x2960: {dir: V, stretch: [0x21BF, 0x23D0, 0x22A5], HDW: HDW1, min: 1.776},
  0x2961: {dir: V, stretch: [0x22A4, 0x23D0, 0x21C3], HDW: HDW1, min: 1.776},
  0x3008: DELIM27E8,
  0x3009: DELIM27E9,
  0xFE37: DELIM23DE,
  0xFE38: DELIM23DF,
};
