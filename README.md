# PR CO-Pilot
A script that assists in reviewing modifications and proposing corrections prior to submitting a pull request.

# Steps to use : 
- open terminal from pr co-pilot folder.
- node professor.js filePath.
## ps:currently it accepts only multiple file as input and checks the entire file.
# Code Review Checklist

## Styles File

- [ ] Ensure there are no `!important` declarations in the styles file.
- [ ] Confirm that all colors are sourced from `theme.palette`.
- [ ] Verify that there is no use of `px` units.
- [ ] Make sure ternary operators(optional chaining) are used for theme-related values. Added in utility.


## TSX Files

- [ ] Remove any unused imports.
- [ ] Provide proper comments for methods.
- [ ] Avoid return comments for void methods.
- [ ] Eliminate the use of `any`. (Added in util)
- [ ] Static values are forbidden. ()
- [ ] Remove redundant code.
- [ ] Ensure only single quotes are used. (Added in util)
- [ ] Convert `if-else` statements to ternary operators.
- [ ] Convert `if` statements to `&&` or `??` operators.
- [ ] Move styles from TSX files to the styles file. (Added in util)
- [ ] Ensure no `console.log` statements are present.

