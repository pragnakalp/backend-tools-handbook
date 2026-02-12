# Filtering Data

## Learning Objectives

By the end of this module, you will be able to:
- Filter rows using the WHERE clause
- Use comparison and logical operators
- Limit the number of rows returned
- Search for patterns in text
- Filter data within ranges
- Combine multiple conditions

---

## WHERE Clause

### What is it?

The `WHERE` clause filters your query results to show only rows that meet specific conditions. Think of it as asking: "Show me only the data that matches these criteria."

### Why use it?

- Find specific records (e.g., customers named "John")
- Filter based on values (e.g., films released after 2005)
- Combine conditions (e.g., active customers in a specific city)
- Reduce result set size for better performance

### Syntax

```sql
SELECT column_name(s) 
FROM table_name 
WHERE condition;
```

### Important Notes

1. **No Aliases in WHERE**: You cannot use column aliases in the WHERE clause. Use the original column names instead.

2. **Used in Multiple Commands**: WHERE is also used in UPDATE and DELETE commands to specify which rows to modify.

3. **Conditions**: Use comparison operators (`=`, `>`, `<`, `>=`, `<=`, `<>`) and logical operators (`AND`, `OR`, `NOT`) to build filters.

---

## Comparison Operators

Use these operators to compare values:

```sql
-- Equal (=)
SELECT * FROM customer WHERE first_name = 'Jamie';

-- Not equal (<> or !=)
SELECT * FROM customer WHERE first_name <> 'Jamie';

-- Greater than (>)
SELECT * FROM film WHERE rental_rate > 4.99;

-- Less than (<)
SELECT * FROM film WHERE length < 60;

-- Greater than or equal (>=)
SELECT * FROM film WHERE rental_rate >= 4.99;

-- Less than or equal (<=)
SELECT * FROM film WHERE length <= 60;
```

**Tip**: Use `=` for exact matches, `>` and `<` for numeric comparisons, and `<>` for exclusions.

---

## Logical Operators

Combine multiple conditions:

### AND Operator

Returns rows that meet **all** conditions:

```sql
SELECT * FROM customer 
WHERE first_name = 'Jamie' AND last_name = 'Rice';
```
**Output**: Returns customers named "Jamie Rice" (both conditions must be true).

### OR Operator

Returns rows that meet **any** condition:

```sql
SELECT * FROM customer 
WHERE first_name = 'Adam' OR last_name = 'Rodriguez';
```
**Output**: Returns customers with first name "Adam" OR last name "Rodriguez" (either condition can be true).

### Combining AND and OR

Use parentheses to group conditions:

```sql
SELECT * FROM customer 
WHERE (first_name = 'Adam' OR first_name = 'Jamie') 
  AND last_name = 'Rice';
```
**Output**: Returns customers named "Adam Rice" or "Jamie Rice".

**Tip**: Always use parentheses when combining AND and OR to avoid confusion!

---

## IN Operator

### What is it?

The `IN` operator checks if a value matches any value in a list.

### Why use it?

- Simpler than multiple OR conditions
- More readable code
- Easy to maintain

### Syntax

```sql
SELECT column_name(s) 
FROM table_name 
WHERE column_name IN (value1, value2, value3);
```

### Example

```sql
SELECT first_name, last_name 
FROM customer 
WHERE first_name IN ('Ann', 'Anne', 'Annie');
```
**Output**: Returns customers with first name "Ann", "Anne", or "Annie".

**Equivalent to**:
```sql
SELECT first_name, last_name 
FROM customer 
WHERE first_name = 'Ann' 
   OR first_name = 'Anne' 
   OR first_name = 'Annie';
```

**NOT IN** excludes values from a list:
```sql
SELECT first_name, last_name 
FROM customer 
WHERE first_name NOT IN ('Ann', 'Anne', 'Annie');
```

---

## LIKE and ILIKE

### What is it?

The `LIKE` operator searches for patterns in text using wildcards. `ILIKE` works the same but is case-insensitive (PostgreSQL-specific).

### Why use it?

- Find names that start with a letter
- Search for partial matches
- Filter text data flexibly

### Wildcards

- **Percent sign (`%`)**: Matches any sequence of zero or more characters
- **Underscore (`_`)**: Matches any single character

### Examples

**Starts with**:
```sql
SELECT * FROM customer WHERE first_name LIKE 'Ann%';
```
**Output**: Returns customers whose first name starts with "Ann" (e.g., "Ann", "Anna", "Annie", "Annabelle").

**Contains**:
```sql
SELECT * FROM customer WHERE first_name LIKE '%nn%';
```
**Output**: Returns customers whose first name contains "nn" anywhere (e.g., "Ann", "Annie", "Donna").

**Single character**:
```sql
SELECT * FROM customer WHERE first_name LIKE '_her%';
```
**Output**: Returns names where the second, third, and fourth characters are "her" (e.g., "Cheryl", "Sherry").

**Case-insensitive** (PostgreSQL):
```sql
SELECT * FROM customer WHERE first_name ILIKE 'ann%';
```
**Output**: Matches "Ann", "ANN", "ann", "Anna", etc. (case-insensitive).

**NOT LIKE** excludes patterns:
```sql
SELECT * FROM customer WHERE first_name NOT LIKE '_her%';
```

---

## BETWEEN Operator

### What is it?

The `BETWEEN` operator filters data within a specific range (inclusive - includes both endpoints).

### Why use it?

- Find values in a range
- Simpler than using `>=` AND `<=`
- More readable code

### Syntax

```sql
SELECT column_name(s) 
FROM table_name 
WHERE column_name BETWEEN low_value AND high_value;
```

**Equivalent to**:
```sql
WHERE column_name >= low_value AND column_name <= high_value
```

### Example

```sql
SELECT title, rental_rate 
FROM film 
WHERE rental_rate BETWEEN 2.99 AND 4.99;
```
**Output**: Returns films with rental rate between 2.99 and 4.99 (inclusive).

**NOT BETWEEN** excludes a range:
```sql
SELECT title, rental_rate 
FROM film 
WHERE rental_rate NOT BETWEEN 2.99 AND 4.99;
```

---

## LIMIT and FETCH

### What is it?

These clauses restrict the number of rows returned by a query.

### Why use it?

- Show only top results
- Get a sample of data
- Improve performance on large tables
- Paginate results (show page 1, page 2, etc.)

### LIMIT Clause

```sql
-- Basic LIMIT
SELECT * FROM film ORDER BY film_id LIMIT 5;
```
**Output**: Returns only the first 5 films.

**LIMIT with OFFSET** (skip some rows):
```sql
SELECT * FROM film ORDER BY film_id LIMIT 4 OFFSET 3;
```
**Output**: Skips the first 3 rows, then returns the next 4 rows (rows 4-7).

**Top N results**:
```sql
SELECT film_id, title, rental_rate 
FROM film 
ORDER BY rental_rate DESC 
LIMIT 15;
```
**Output**: Returns the 15 films with the highest rental rates.

### FETCH Clause

`FETCH` is the SQL-standard alternative to `LIMIT`. It does the same thing but follows official SQL standards.

```sql
-- Fetch first row
SELECT film_id, title 
FROM film 
ORDER BY title 
FETCH FIRST ROW ONLY;

-- Fetch multiple rows
SELECT film_id, title 
FROM film 
ORDER BY title 
FETCH FIRST 5 ROWS ONLY;

-- FETCH with OFFSET
SELECT film_id, title 
FROM film 
ORDER BY title 
OFFSET 5 ROWS 
FETCH FIRST 5 ROWS ONLY;
```

**FETCH vs. LIMIT**: Both do the same thing, but FETCH is SQL standard (more portable), while LIMIT is PostgreSQL-specific (more commonly used).

---

## Practice Exercises

1. Find customers with first name "Mary"
2. Find films with rental rate between 2.99 and 4.99
3. Find customers whose first name starts with "A"
4. Get top 10 films by rental rate
5. Find films with rating 'G', 'PG', or 'PG-13' using IN operator

---

## Solutions

```sql
-- 1. Find Mary
SELECT * FROM customer WHERE first_name = 'Mary';

-- 2. Between range
SELECT title, rental_rate FROM film 
WHERE rental_rate BETWEEN 2.99 AND 4.99;

-- 3. Starts with A
SELECT first_name, last_name FROM customer 
WHERE first_name LIKE 'A%';

-- 4. Top 10
SELECT title, rental_rate FROM film 
ORDER BY rental_rate DESC LIMIT 10;

-- 5. Using IN
SELECT title, rating FROM film 
WHERE rating IN ('G', 'PG', 'PG-13');
```

---

## Summary

- **WHERE** filters rows based on conditions - essential for finding specific data
- Use **comparison operators** (`=`, `>`, `<`, `>=`, `<=`, `<>`) for value comparisons
- Use **logical operators** (`AND`, `OR`, `NOT`) to combine conditions - use parentheses!
- **IN** checks if a value is in a list - simpler than multiple OR conditions
- **LIKE** searches for text patterns using `%` (any characters) and `_` (single character)
- **ILIKE** is case-insensitive LIKE (PostgreSQL-specific)
- **BETWEEN** filters values within a range (inclusive)
- **LIMIT** restricts the number of rows returned
- **FETCH** is the SQL-standard alternative to LIMIT
- Always use **parentheses** when combining AND and OR to avoid confusion

**Next Module**: [Joining-Tables.md](Joining-Tables.md) - Learn to combine data from multiple tables

---

**Excellent! You can now filter and search data effectively!** 🎉
