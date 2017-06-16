module.exports = function findImports(root, j, source) {
  return root
    .find(j.ImportDeclaration, {
      source: {
        type: 'Literal',
        value: source,
      },
    })
};
