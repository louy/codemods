const addImport = require('./utils/addImport');
const findImports = require('./utils/findImports');

module.exports = function reactTestRendererToEnzyme(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const replaceTestRendererWrapper = (declaratorPath, { enzymeToJson }) => {
    root.find(j.Identifier, { name: declaratorPath.node.id.name })
    .filter(path => path.parent.node.type !== 'VariableDeclarator')
    .filter(path => path.scope.lookup(path.node.name) === declaratorPath.scope)
      .forEach((path) => {
        if (path.parent.node.type !== 'MemberExpression') { throw new Error(`Unknown expression type: ${path.parent.node.type}`); }
        if (path.parent.node.property.name !== 'toJSON') { throw new Error(`Unknown method: ${path.parent.node.property.name}`); }
        if (path.parent.parent.node.type !== 'CallExpression') { throw new Error(`Unknown expression type: ${path.parent.node.type}`); }

        const replacement = j.callExpression(j.identifier(enzymeToJson), [path.node]);
        j(path.parent.parent).replaceWith(replacement);
      });
  };

  const replaceTestRenderer = (name, { enzymeMount, enzymeToJson }) => {
    root
      .find(j.Identifier, { name })
      .filter(path => path.parent.node.type !== 'ImportDefaultSpecifier')
      .forEach((path) => {
        if (path.parent.node.type !== 'MemberExpression') { throw new Error(`Unknown expression type: ${path.parent.node.type}`); }
        if (path.parent.node.property.name !== 'create') { throw new Error(`Unknown method: ${path.parent.node.property.name}`); }

        if (path.parent.parent.parent.node.type === 'VariableDeclarator') {
          replaceTestRendererWrapper(path.parent.parent.parent, { enzymeToJson });
        }
      })
      .map(path => path.parent.parent)
      .forEach((path) => {
        j(path).replaceWith(j.callExpression(j.identifier(enzymeMount), path.node.arguments));
      });
  };

  const replaceTestRendererCreate = (name, { enzymeMount, enzymeToJson }) => {
    root
      .find(j.Identifier, { name })
      .filter(path => path.parent.node.type !== 'ImportSpecifier')
      .forEach((path) => {
        if (path.parent.node.type !== 'CallExpression') { throw new Error(`Unknown expression type: ${path.parent.node.type}`); }
        if (path.parent.parent.node.type === 'VariableDeclarator') {
          replaceTestRendererWrapper(path.parent.parent, { enzymeToJson });
        }
      })
      .map(path => path.parent)
      .forEach((path) => {
        j(path).replaceWith(j.callExpression(j.identifier(enzymeMount), path.node.arguments));
      });
  };

  // find all calls to renderer.create
  const imports = findImports(root, j, 'react-test-renderer');

  if (!imports) return null;

  let testRendererDefaultImport;
  let testRendererCreateImport;

  imports.forEach((path) => {
    path.node.specifiers.forEach((specifier) => {
      switch (true) {
        case specifier.type === 'ImportDefaultSpecifier':
          testRendererDefaultImport = specifier.local.name;
          break;
        case specifier.type === 'ImportSpecifier' || specifier.imported.name === 'create':
          testRendererCreateImport = specifier.local.name;
          break;
        default:
          throw new Error(`Unknown react-test-renderer import specifier: ${specifier.name}`);
      }
    });
  });

  const enzymeMount = addImport(root, j, 'enzyme', 'mount');
  const enzymeToJson = addImport(root, j, 'enzyme-to-json', 'default', 'toJson');

  // replace renderer.create with enzyme.mount
  if (testRendererDefaultImport) {
    replaceTestRenderer(testRendererDefaultImport, { enzymeMount, enzymeToJson });
  }
  if (testRendererCreateImport) {
    replaceTestRendererCreate(testRendererCreateImport, { enzymeMount, enzymeToJson });
  }

  findImports(root, j, 'react-test-renderer').remove();

  return root.toSource({ quote: 'single' });
};
