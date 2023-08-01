# DateMap Example

A class that acts as a dictionary for sorted dates and supports the following methods.

`get` Fetches an item by a date object

`put` Inserts an item by a date object with an associated string value

## Sort Caching

This example favors a read-heavy scenario in which inserts are far more rare than reads. We can improve lookup times by N (where N is the size of the dictionary), by sorting on new insertions to the dictionary.

This also preserves the unsorted lookup table to expand to future methods of sorting or multiple sorting behaviors in parallel.
