# Querying Data

## Learning Objectives

By the end of this module, you will be able to:
- Use SELECT to retrieve data from tables
- Select specific columns or all columns
- Create column aliases for better readability
- Sort results using ORDER BY
- Remove duplicate rows with DISTINCT
- Use expressions and functions in queries

---

## SELECT Statement

### What is it?

The `SELECT` statement is the most fundamental SQL command. It retrieves data from one or more tables in your database. Think of it as asking the database: "Show me this information."

### Why use it?

- Retrieve specific data you need from tables
- View table contents to understand your data
- Prepare data for reports and analysis
- Extract information for applications

### Syntax

```sql
SELECT column_name(s) FROM table_name;
```

**Note**: SQL keywords are case-insensitive. `SELECT` is the same as `select` or `Select`. However, by convention, we use uppercase for SQL keywords to make queries easier to read.

### Examples

**Select a single column**:
```sql
SELECT first_name FROM customer;
```
**Output**: Returns all first names from the customer table.

**Select multiple columns**:
```sql
SELECT first_name, last_name, email FROM customer;
```
**Output**: Returns first name, last name, and email for all customers.

**Select all columns** (use with caution):
```sql
SELECT * FROM customer;
```
**Output**: Returns all columns and all rows from the customer table.

### ⚠️ Important: When NOT to Use `*`

While `SELECT *` is convenient for quick manual queries, **avoid using it in application code** (Python, Java, PHP, etc.) for two main reasons:

1. **Performance Impact**: Fetching every column forces the database to read more data from disk, creating unnecessary overhead
2. **Network Overhead**: Retrieving extra data increases traffic between your database and application, leading to slower response times

**Best Practice**: Always specify the columns you actually need.

---

## Column Aliases

### What is it?

A column alias gives a temporary name to a column or expression in your query results. It only exists for the duration of the query.

### Why use it?

- Make column names more readable (e.g., `surname` instead of `last_name`)
- Name expressions that don't have column names (like calculated values)
- Use shorter names for long table/column names
- Make results more user-friendly

### Syntax

```sql
SELECT column_name AS alias_name FROM table_name;
-- OR (AS is optional)
SELECT column_name alias_name FROM table_name;
```

### Examples

**Alias a column**:
```sql
SELECT first_name, last_name AS surname FROM customer;
```
**Output**: The `last_name` column appears as `surname` in the results.

**Alias an expression**:
```sql
SELECT first_name || ' ' || last_name AS full_name FROM customer;
```
**Output**: The combined name appears as `full_name` instead of `?column?`.

**Note**: The `||` operator concatenates (joins) strings together. `' '` adds a space between first and last name.

**Alias with spaces** (use double quotes):
```sql
SELECT first_name || ' ' || last_name AS "full name" FROM customer;
```

---

## ORDER BY Clause

### What is it?

The `ORDER BY` clause sorts your query results in ascending or descending order based on one or more columns.

### Why use it?

- Display data in a meaningful order (alphabetical, numerical, etc.)
- Find top or bottom values (highest sales, oldest records, etc.)
- Organize results for reports
- Make data easier to read and analyze

### Syntax

```sql
SELECT column_name(s) 
FROM table_name 
ORDER BY expression1 [ASC | DESC], expression2 [ASC | DESC], ...;
```

**Note**: `ORDER BY` should be added last in your query (after FROM, WHERE, etc.).

### Examples

**Sort ascending** (default - A to Z, 1 to 10):
```sql
SELECT first_name, last_name FROM customer ORDER BY first_name;
-- Same as:
SELECT first_name, last_name FROM customer ORDER BY first_name ASC;
```

**Sort descending** (Z to A, 10 to 1):
```sql
SELECT first_name, last_name FROM customer ORDER BY first_name DESC;
```

**Sort by multiple columns**:
```sql
SELECT first_name, last_name FROM customer 
ORDER BY first_name ASC, last_name DESC;
```
**Output**: Sorts by first name (A-Z), then by last name (Z-A) for customers with the same first name.

**Sort by expression**:
```sql
SELECT first_name, LENGTH(first_name) AS len 
FROM customer 
ORDER BY len DESC;
```
**Output**: Sorts customers by the length of their first name (longest first).

### Handling NULL Values

NULL represents missing or unknown data. You can control where NULL values appear:

```sql
-- NULLs appear first
SELECT num FROM demo ORDER BY num NULLS FIRST;

-- NULLs appear last (default for ASC)
SELECT num FROM demo ORDER BY num NULLS LAST;
```

**Tip**: To see NULL values properly in psql, run: `\pset null null`

---

## SELECT DISTINCT

### What is it?

The `DISTINCT` clause removes duplicate rows from your results, keeping only unique values for the specified columns.

### Why use it?

- Find unique values in a column (e.g., all unique customer cities)
- Count distinct items (e.g., how many unique products were sold)
- Remove duplicates from results
- Get a list of unique categories or types

### Syntax

```sql
SELECT DISTINCT column_name(s) FROM table_name;
```

### Examples

**Without DISTINCT** (shows duplicates):
```sql
SELECT last_name FROM actor;
```
**Output**: Returns all last names, including duplicates.

**With DISTINCT** (removes duplicates):
```sql
SELECT DISTINCT last_name FROM actor;
```
**Output**: Returns only unique last names (no duplicates).

**Compare**: Notice the difference in row count between the two queries!

---

## Practice Exercises

1. Select `title` and `release_year` from the `film` table
2. Create a full name alias combining `first_name` and `last_name` from `customer`
3. Sort customers by `last_name` in descending order
4. Find all distinct `rating` values from the `film` table
5. Select films and sort them by title length (longest first)

---

## Solutions

```sql
-- 1. Select columns
SELECT title, release_year FROM film;

-- 2. Full name alias
SELECT first_name || ' ' || last_name AS full_name FROM customer;

-- 3. Sort descending
SELECT * FROM customer ORDER BY last_name DESC;

-- 4. Distinct ratings
SELECT DISTINCT rating FROM film;

-- 5. Sort by title length
SELECT title, LENGTH(title) AS title_length 
FROM film 
ORDER BY title_length DESC;
```

---

## Summary

- **SELECT** retrieves data from tables - it's the foundation of all queries
- Use specific column names instead of `*` in production code for better performance
- **Aliases** make column names more readable using `AS` keyword (AS is optional)
- **ORDER BY** sorts results (ASC ascending, DESC descending)
- Use **NULLS FIRST** or **NULLS LAST** to control NULL placement in sorted results
- **DISTINCT** removes duplicate rows from results
- Expressions and functions (like `LENGTH()`) can be used in SELECT statements

**Next Module**: [03-Filtering-Data.md](03-Filtering-Data.md) - Learn to filter data with WHERE, LIMIT, and pattern matching

---

**Great job! You can now retrieve and organize data!** 🎉
