# LHC Forms Goverance

This library provides functionality to help validate and edit LHC Form JSON files.

The following commands are available:

```bash
❯ deno-run lformctl.ts --help
LHC Form Controller v1.1.0.

Usage:
  lformctl validate <lhc-json-src> [--lform-schema-ts=<url>] [--persist-on-error] [--verbose]
  lformctl json-to-tdg-ts <lhc-json-src> [--lform-schema-ts=<url>] [<lhc-tdg-ts-file>] [--verbose]
  lformctl -h | --help
  lformctl --version

Options:
  -h --help                   Show this screen
  --version                   Show version
  <lhc-json-src>              LHC Form JSON single local file name or glob (like "*.json" or "**/*.json")
  <lhc-tdg-ts-file>           LHC Form Typed Data Gen (TDG) TypeScript file name
  --lform-schema-ts=<url>     Where the lform.ts TypeScript schema can be found
  --persist-on-error          Saves the generated *.auto.ts file on error
  --verbose                   Be explicit about what's going on
```

# Validation Example

Normal usage will be to have JSON files available in a directory and just run from URL:

```bash
❯ deno-run "https://denopkg.com/shah/ts-lhncbc-lforms/lformctl.ts" validate "**/*.json" --verbose
❯ deno-run "https://denopkg.com/shah/ts-lhncbc-lforms@v1.1.3/lformctl.ts" validate "**/*.json" --verbose
```

As shown above, you can use either a specific version or leave out the version number to use the latest version.

There is a sample LHC Form JSON file `test1-with-error.lhc-form.json` which has forced error. 
If you run the validator, it should give you a proper error message:

```bash
❯ deno-run lformctl.ts validate "*.json"
TS2322 [ERROR]: Type 'string' is not assignable to type 'number'.
        min: 'bad data',
        ~~~
    at /test1-with-error.lhc-form.auto.ts:12:9
```

# Convert LHC Form JSON to Typed Data Gen (TDG) TypeScript

Normal usage will be to have JSON files available in a directory and just run from URL:

```bash
❯ deno-run "https://denopkg.com/shah/ts-lhncbc-lforms/lformctl.ts" json-to-tdg-ts "**/*.json" --verbose
❯ deno-run "https://denopkg.com/shah/ts-lhncbc-lforms@v1.1.3/lformctl.ts" json-to-tdg-ts "**/*.json" --verbose
```

As shown above, you can use either a specific version or leave out the version number to use the latest version.

You can take the LHC Form JSON file `test1-with-error.lhc-form.json` and generate an editable
TypeScript file from it:

```bash
❯ deno-run lformctl.ts json-to-tdg-ts "*.json" --verbose
Created test1-with-error.lhc-form.auto.tdg.ts, run 'deno fmt test1-with-error.lhc-form.auto.tdg.ts' to format it.

❯ deno fmt test1-with-error.lhc-form.auto.tdg.ts
```

If you want to give it a different name, use:

```bash
❯ deno-run lformctl.ts json-to-tdg-ts test1-with-error.lhc-form.json myfile --verbose
Created myfile.tdg.ts, run 'deno fmt myfile.tdg.ts' to format it.

❯ deno fmt myfile.tdg.ts
```
