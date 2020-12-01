'use strict';

function createIndent(depth, indent) {
  return new Array(depth + 1).join(indent);
}

function createAttributes(attributes) {
  let html = '';
  Object.keys(attributes).forEach(key => {
    html += ` ${key}="${attributes[key]}"`;
  });
  return html;
}

function createOpenTag(object) {
  return `<${object.name}${createAttributes(object.attributes)}>`;
}

function createCloseTag(object) {
  return `</${object.name}>`;
}

function createIsolateTag(object) {
  let xml = '';
  if (object.content) {
    xml += `<${object.name}${createAttributes(object.attributes)}>${object.content}</${object.name}>`;
  } else {
    xml += `<${object.name}${createAttributes(object.attributes)} />`;
  }

  return xml;
}

function createXML(object, depth, indent) {
  let xml = '';
  const br = indent.length === 0 ? '' : '\n';
  if (object.children.length > 0) {
    xml += `${createIndent(depth, indent)}${createOpenTag(object)}${br}`;
    if (object.content) {
      xml += `${createIndent(depth + 1, indent)}${object.content}${br}`;
    }

    object.children.forEach(child => {
      xml += createXML(child, depth + 1, indent);
    });
    xml += `${createIndent(depth, indent)}${createCloseTag(object)}${br}`;
  } else {
    xml += `${createIndent(depth, indent)}${createIsolateTag(object)}${br}`;
  }

  return xml;
}

function stringify(ast, arg) {
  let indent = '';
  if (typeof arg === 'number') {
    indent = ' '.repeat(Number.parseInt(arg, 10));
  } else if (typeof arg === 'string') {
    indent = arg;
  }

  let xml = '';
  const br = indent.length === 0 ? '' : '\n';
  if (ast.declaration) {
    xml += `<?xml${createAttributes(ast.declaration.attributes)}?>${br}`;
  }

  xml += createXML(ast.root, 0, indent);

  return xml;
}

module.exports = stringify;
