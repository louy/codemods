const findImports = require('./findImports');

module.exports = function addImport(root, j, source, identifier, alias) {
  // try to find import declarations for source

  if (identifier === 'default' && !alias) {
    throw new Error('Missing name for default import');
  }

  const importDeclarations = findImports(root, j, source);

  if (!importDeclarations.length) {
    // Insert new import declaration to root

    const newImport = j.importDeclaration(
      [
        identifier === 'default'
          ? j.importDefaultSpecifier(j.identifier(alias))
          : j.importSpecifier(j.identifier(identifier), j.identifier(alias || identifier)),
      ],
      j.literal(source),
    );

    const lastImport = (() => {
      const imports = root.find(j.ImportDeclaration);
      return imports.at(imports.length - 1);
    })();

    if (!lastImport) {
      // append to top of file
      root.find(j.Program).get('body', 0).insertBefore(newImport);
    } else {
      lastImport.insertAfter(newImport);
    }

    return alias || identifier;
  }

  // check if specifier already exists and return name
  let found;
  importDeclarations.forEach((path) => {
    if (found) return;
    path.node.specifiers.forEach((specifier) => {
      if (identifier === 'default') {
        if (specifier.type === 'ImportDefaultSpecifier') {
          found = specifier.local.name;
        }
      } else if (specifier.imported.name === identifier) {
        found = specifier.local.name;
      }
    });
  });
  if (found) return found;

  const newSpecifier = identifier === 'default'
    ? j.importDefaultSpecifier(j.identifier(alias))
    : j.importSpecifier(j.identifier(identifier), j.identifier(alias || identifier));

  importDeclarations.paths()[0].node.specifiers.push(newSpecifier);
  return alias || identifier;
};
