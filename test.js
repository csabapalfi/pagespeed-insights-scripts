const psiResult = require('./result.json');
import mapResult, {tableHeading, tableRow} from './map-result';

const lhResult = psiResult.lighthouseResult;
const userTimingMarks = { PAR: 'primary.action.rendered' };
const result = mapResult(lhResult, userTimingMarks);

console.log(JSON.stringify(result, null, 2));

console.log(tableHeading(userTimingMarks).join('\t'));
console.log(tableRow(result).join('\t'));

