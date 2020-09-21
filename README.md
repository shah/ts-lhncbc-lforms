# LHC Forms Goverance

This library provides functionality to help validate and edit LHC Form JSON files.

The following commands are available:

```bash
❯ deno-run lformctl.ts --help
LHC Form Controller.

Usage:
  lformctl.ts validate <lhc-json-file> [--persist-on-error] [--verbose]
  lformctl.ts json-to-tdg-ts <lhc-json-file> [<lhc-tdg-ts-file>] [--verbose]
  lformctl.ts -h | --help
  lformctl.ts --version

Options:
  -h --help                 Show this screen
  --version                 Show version
  <lhc-json-file>           LHC Form JSON file name (can be local or URL)
  <lhc-tdg-ts-file>         LHC Form Typed Data Gen (TDG) TypeScript file name
  --persist-on-error        Saves the generated *.auto.ts file on error
  --verbose                 Be explicit about what's going on
```
