# Savvy

JavaScript markup parser for the Savvy syntax.

- Jasmine Unit Tested
- jQuery or jqLite (for use with Angular)
- Variables and Functions

## Use

Include the `jquery.savvy.js` file.

### jQuery

```javascript
$('.savvy').savvy();
$('.savvy').savvy(text);
$.savvy(element, text);
```

### AngularJS

```javascript
exmaple here
```

## Savvy Syntax

The parser allows for inline variable definitions and functions.

### Variables

Variables can be defined with the `@` symbol with a name containing letters or numbers. Any value after the next space will be saved globally to the variable.

```text
@hello world!

@hello
```

```html
<p>world!</p>
```

**Note:** To redefine a variable use `@@` instead of a single `@`.

### Function

Functions allow basic tempates and the execution of pre-defined JavaScript.

```text
@twitter(username){
  <a href="https://twitter.com/@username">@username</a>
}

Follow me on twitter: @twitter(Templarian)
```

```html
<p>Follow me on twitter: <a href="https://twitter.com/Templarian">Templarian</a></p>
```
