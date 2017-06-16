# Louay's codemods
A collection of useful codemods I personally use.

## Usage
```
jscodeshift -t <codemod-script> <path>
```

## Codemods

### react-test-renderer-to-enzyme
Rewrites tests that use `react-test-renderer` to use `enzyme` instead
