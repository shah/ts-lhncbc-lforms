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

# Validation Example

There is a sample LHC Form JSON file `test1-with-error.lhc-form.json` which has forced error. 
If you run the validator, it should give you a proper error message:

```bash
❯ deno-run lformctl.ts validate test1-with-error.lhc-form.json
TS2322 [ERROR]: Type 'string' is not assignable to type 'number'.
        min: 'bad data',
        ~~~
    at /test1-with-error.lhc-form.auto.ts:12:9
```

# Convert LHC Form JSON to Typed Data Gen (TDG) TypeScript

You can take the LHC Form JSON file `test1-with-error.lhc-form.json` and generate an editable
TypeScript file from it:

```bash
❯ deno-run lformctl.ts json-to-tdg-ts test1-with-error.lhc-form.json --verbose
Created test1-with-error.lhc-form.auto.tdg.ts, run 'deno fmt test1-with-error.lhc-form.auto.tdg.ts' to format it.

❯ deno fmt test1-with-error.lhc-form.auto.tdg.ts
```

If you want to give it a different name, use:

```bash
❯ deno-run lformctl.ts json-to-tdg-ts test1-with-error.lhc-form.json myfile --verbose
Created myfile.tdg.ts, run 'deno fmt myfile.tdg.ts' to format it.

❯ deno fmt myfile.tdg.ts
```
