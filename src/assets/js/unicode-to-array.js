let rsAstralRange = '\\ud800-\\udfff'
let rsZWJ = '\\u200d'
let rsVarRange = '\\ufe0e\\ufe0f'
let rsComboMarksRange = '\\u0300-\\u036f'
let reComboHalfMarksRange = '\\ufe20-\\ufe2f'
let rsComboSymbolsRange = '\\u20d0-\\u20ff'
let rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange
let reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + ']')

let rsFitz = '\\ud83c[\\udffb-\\udfff]'
let rsOptVar = '[' + rsVarRange + ']?'
let rsCombo = '[' + rsComboRange + ']'
let rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')'
let reOptMod = rsModifier + '?'
let rsAstral = '[' + rsAstralRange + ']'
let rsNonAstral = '[^' + rsAstralRange + ']'
let rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}'
let rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]'
let rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*'
let rsSeq = rsOptVar + reOptMod + rsOptJoin
let rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')'
let reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g')

export function toArray (val) {
  return hasUnicode(val)
    ? unicodeToArray(val)
    : asciiToArray(val)
}

export function hasUnicode (val) {
  return reHasUnicode.test(val)
}

export function unicodeToArray (val) {
  return val.match(reUnicode) || []
}

export function asciiToArray (val) {
  return val.split('')
}
