import {resizeArray, scrabbleScore} from './Util.js';

let word = 'nonplussed' //13
let e = 'English'



test('scrabbleScore counts score without modifiers, multiple letters', () => {
	expect(scrabbleScore('a', [null], e)).toEqual(1);
});

test('scrabbleScore counts score without modifiers', () => {
	let modifiers = [null, null, null, null, null, null, null, null, null, null] //13
	expect(scrabbleScore(word, modifiers, e)).toEqual(13);
});

test ('scrabbleScore counts correctly with double-letter modifier', () => {
	let m2l = ['double-letter', null, null, null, null, null, null, null, null, null] //14
	expect(scrabbleScore(word, m2l, e)).toEqual(14);
});

test ('scrabbleScore counts correctly with double-word modifier', () => {
	let m2w = ['double-word', null, null, null, null, null, null, null, null, null] //26
	expect(scrabbleScore(word, m2w, e)).toEqual(26);
});

test ('scrabbleScore counts correctly with triple-letter modifier', () => {
	let m3l = ['triple-letter', null, null, null, null, null, null, null, null, null] //15
	expect(scrabbleScore(word, m3l, e)).toEqual(15);
});

test ('scrabbleScore counts correctly with double-letter modifier', () => {
	let m3w = ['triple-word', null, null, null, null, null, null, null, null, null] //39
	expect(scrabbleScore(word, m3w, e)).toEqual(39);
});

test ('scrabbleScore counts correctly with blank modifier', () => {
	let mB = ['blank', null, null, null, null, null, null, null, null, null] //12
	expect(scrabbleScore(word, mB, e)).toEqual(12);
});

test ('scrabbleScore counts double/tripple letter before double/triple word', () => {
	let mM = ['triple-word', 'double-letter', null, null, null, null, null, null, null, null] //42
	expect(scrabbleScore(word, mM, e)).toEqual(42);
});

test ('scrabbleScore counts complicated modifiers correctly', () => {
	let mC = ['triple-word', 'double-letter', 'triple-letter', null, 'triple-letter', null, 'triple-letter', null, null, null] //42
	expect(scrabbleScore(word, mC, e)).toEqual(60);
});

test ('scrabbleScore calculates French and Russian', () => {
	expect(scrabbleScore('y', [null], 'French')).toEqual(10);
	expect(scrabbleScore('ф', [null], 'Russian')).toEqual(10);
})

/* DONE resizeArray should:
	- make the array smaller if the requested length is smaller than original
	- when expending an original array, it should preserve the elements that are already in it
	- it should not change the original resizeArray
	- if the requested length is the same, it should not change the array
*/

test ('resizeArray makes correct length of an array', () => {
	expect(resizeArray([], 2, 'a')).toEqual(['a', 'a'])
	expect(resizeArray([1, 2, 3], 2, 4)).toEqual([1, 2])
	expect(resizeArray(['a', 'a'], 2, 'a')).toEqual(['a', 'a'])
});


test ('resizeArray takes value of any type', () => {
	expect(resizeArray([], 2, 1)).toEqual([1, 1])
	expect(resizeArray([], 2, {a: 'b'})).toEqual([{a: 'b'}, {a: 'b'}])
	expect(resizeArray([], 2, null)).toEqual([null, null])
	expect(resizeArray([], 2, undefined)).toEqual([undefined, undefined])
	expect(resizeArray([], 2, true)).toEqual([true, true])
	expect(resizeArray([], 2, ['a'])).toEqual([['a'], ['a']])
});
