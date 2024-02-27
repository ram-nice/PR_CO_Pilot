# PR CO-Pilot
a simple script file which will help us to check the changes and suggest corrections before raising pr

checks needed


styles file : 
1) no important in styles file. (search for !important should return nothing). added in utility.
2) all colors should come from theme.palette. (search for # should return nothing). added in utility.
3) no use of px.(search for px should return nothing). added in utility.
4) use ternary in theme related values. added in utility.
5) checkdev comments.

tsx files:
1) remove unused imports.
2) give proper comments for methods.
3) no return comment needed for void methods.
4) no use of any. (added in util)
5) static values are forbidden. ()
6) no redundant code.
7) only single quotes.(added to util)
8) convert if else to ternary
9) convert if to && or ?? operator
10) styles should be moved to styles file(added to util);
11) no console.log should be present
