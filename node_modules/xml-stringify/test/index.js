const fs = require('fs');
const path = require('path');
const test = require('ava');
const parse = require('xml-parser');
const stringify = require('..');

test('With declaration', t => {
  const fixture = fs.readFileSync(path.resolve(__dirname, 'fixtures/1.xml'), 'utf8');
  const expected = fs.readFileSync(path.resolve(__dirname, 'expected/1.xml'), 'utf8');
  const ast = parse(fixture);

  t.is(stringify(ast, 2), expected);
});

test('Without declaration', t => {
  const fixture = fs.readFileSync(path.resolve(__dirname, 'fixtures/2.xml'), 'utf8');
  const expected = fs.readFileSync(path.resolve(__dirname, 'expected/2.xml'), 'utf8');
  const ast = parse(fixture);

  t.deepEqual(stringify(ast), expected);
});

test('Including isolated tag', t => {
  const fixture = fs.readFileSync(path.resolve(__dirname, 'fixtures/3.xml'), 'utf8');
  const expected = fs.readFileSync(path.resolve(__dirname, 'expected/3.xml'), 'utf8');
  const ast = parse(fixture);

  t.deepEqual(stringify(ast, 2), expected);
});

test('Indent with specified length space', t => {
  const fixture = fs.readFileSync(path.resolve(__dirname, 'fixtures/4.xml'), 'utf8');
  const expected = fs.readFileSync(path.resolve(__dirname, 'expected/4.xml'), 'utf8');
  const ast = parse(fixture.toString());

  t.deepEqual(stringify(ast, 3), expected);
});

test('Indent with any specified string', t => {
  const fixture = fs.readFileSync(path.resolve(__dirname, 'fixtures/5.xml'), 'utf8');
  const expected = fs.readFileSync(path.resolve(__dirname, 'expected/5.xml'), 'utf8');
  const ast = parse(fixture.toString());

  t.deepEqual(stringify(ast, '\t'), expected);
});
