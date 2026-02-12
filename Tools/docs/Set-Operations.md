# Set Operations

## Learning Objectives

By the end of this module, you will be able to:
- Combine result sets using UNION
- Keep duplicates with UNION ALL
- Find common rows with INTERSECT
- Find differences with EXCEPT
- Understand requirements for set operations
- Use set operations in practical scenarios

---

## What Are Set Operations?

Set operations combine the results of two or more SELECT statements into a single result set. They work like mathematical set operations (union, intersection, difference).

**Think of it like this**: If you have two lists, set operations let you combine them, find what's common, or find what's different.

### Requirements

For set operations to work, both queries must have:
- **Same number of columns**
- **Same column order**
- **Compatible data types** (columns in the same position must have compatible types)

---

## UNION

### What is it?

`UNION` combines the results of two or more SELECT statements into a single list. It **automatically removes duplicate rows**, ensuring the final output contains only unique records.

### Why use it?

- Combine similar data from different tables
- Merge results from multiple queries
- Get a unified list without duplicates

### Syntax

```sql
SELECT column_name(s) FROM table_1 
UNION 
SELECT column_name(s) FROM table_2;
```

### Example: Combine Customer and Staff Names

```sql
SELECT first_name, last_name FROM customer
UNION
SELECT first_name, last_name FROM staff
ORDER BY last_name;
```

**Output**: A combined list of all unique first and last names from both customers and staff (no duplicates).

**How it works**:
1. Executes both SELECT statements
2. Combines the results
3. Removes duplicate rows
4. Returns the final unique set

---

## UNION ALL

### What is it?

`UNION ALL` works like `UNION` but **keeps all rows, including duplicates**. It's also faster because it skips the duplicate-checking step.

### Why use it?

- When you want to keep duplicates
- Better performance (no duplicate checking)
- Combine results where duplicates are meaningful

### Syntax

```sql
SELECT column_name(s) FROM table_1 
UNION ALL 
SELECT column_name(s) FROM table_2;
```

### Example: Combine with Duplicates

```sql
SELECT first_name, last_name FROM customer
UNION ALL
SELECT first_name, last_name FROM staff
ORDER BY last_name;
```

**Output**: All names from both tables, including duplicates (if a name appears in both tables, it appears twice).

### UNION vs. UNION ALL

| UNION | UNION ALL |
|-------|-----------|
| Removes duplicates | Keeps duplicates |
| Slower (checks for duplicates) | Faster (no duplicate check) |
| Use when duplicates don't matter | Use when duplicates are meaningful |

---

## INTERSECT

### What is it?

`INTERSECT` combines the results of two SELECT statements and returns **only the rows that appear in both result sets**. Like UNION, it automatically removes duplicates.

### Why use it?

- Find common records between two tables
- Identify overlapping data
- Find shared values

### Syntax

```sql
SELECT column_name(s) FROM table_1 
INTERSECT 
SELECT column_name(s) FROM table_2;
```

### Example: Find Common Names

```sql
SELECT first_name, last_name FROM customer
INTERSECT
SELECT first_name, last_name FROM staff
ORDER BY last_name;
```

**Output**: Only names that appear in BOTH customer and staff tables.

**How it works**:
1. Executes both SELECT statements
2. Finds rows that exist in both results
3. Removes duplicates
4. Returns the intersection

---

## EXCEPT

### What is it?

`EXCEPT` returns **unique rows from the first (left) query that do not exist in the second (right) query**. It's like subtraction - it shows what's in the first set but not in the second.

### Why use it?

- Find records in one table but not another
- Identify differences between datasets
- Find missing or unique records

### Syntax

```sql
SELECT column_name(s) FROM table_1 
EXCEPT 
SELECT column_name(s) FROM table_2;
```

### Example: Names in Customers but Not in Staff

```sql
SELECT first_name, last_name FROM customer
EXCEPT
SELECT first_name, last_name FROM staff
ORDER BY last_name;
```

**Output**: Names that exist in the customer table but NOT in the staff table.

**How it works**:
1. Executes both SELECT statements
2. Takes rows from the first query
3. Removes rows that exist in the second query
4. Removes duplicates
5. Returns the difference

---

## Multiple Set Operations

You can combine multiple set operations in a single query:

### Example: Complex Set Operation

```sql
SELECT first_name, last_name FROM customer
UNION
SELECT first_name, last_name FROM staff
UNION
SELECT first_name, last_name FROM actor
ORDER BY last_name;
```

**Output**: All unique names from customers, staff, and actors combined.

### Using Parentheses

Use parentheses to control the order of operations:

```sql
(SELECT first_name, last_name FROM customer
UNION
SELECT first_name, last_name FROM staff)
EXCEPT
SELECT first_name, last_name FROM actor;
```

**Output**: Names from customers and staff combined, minus any names that also appear in actors.

---

## Important Notes

### Column Matching

The columns must match in position and be compatible:

```sql
-- ✅ Correct: Same number and order
SELECT first_name, last_name FROM customer
UNION
SELECT first_name, last_name FROM staff;

-- ❌ Wrong: Different number of columns
SELECT first_name, last_name FROM customer
UNION
SELECT first_name FROM staff;  -- Error!

-- ❌ Wrong: Different order
SELECT first_name, last_name FROM customer
UNION
SELECT last_name, first_name FROM staff;  -- Wrong order!
```

### ORDER BY

You can only use ORDER BY at the end of the entire set operation:

```sql
SELECT first_name FROM customer
UNION
SELECT first_name FROM staff
ORDER BY first_name;  -- ✅ Correct: At the end
```

---

## Practice Exercises

1. Combine all unique first names from `customer` and `actor` tables
2. Find first names that appear in both `customer` and `actor` tables
3. Find first names in `customer` but NOT in `actor`
4. Combine names from all three tables (customer, staff, actor) keeping duplicates

---

## Solutions

```sql
-- 1. UNION
SELECT first_name FROM customer
UNION
SELECT first_name FROM actor
ORDER BY first_name;

-- 2. INTERSECT
SELECT first_name FROM customer
INTERSECT
SELECT first_name FROM actor
ORDER BY first_name;

-- 3. EXCEPT
SELECT first_name FROM customer
EXCEPT
SELECT first_name FROM actor
ORDER BY first_name;

-- 4. UNION ALL (keeps duplicates)
SELECT first_name, last_name FROM customer
UNION ALL
SELECT first_name, last_name FROM staff
UNION ALL
SELECT first_name, last_name FROM actor
ORDER BY last_name;
```

---

## Summary

- **UNION** combines results and removes duplicates - most common set operation
- **UNION ALL** combines results and keeps duplicates (faster than UNION)
- **INTERSECT** returns only rows that appear in both queries - find common data
- **EXCEPT** returns rows from first query that don't exist in second - find differences
- All queries must have the same number of columns, same order, and compatible types
- Use **ORDER BY** only at the end of the entire set operation
- Set operations are useful for combining, comparing, and finding differences between datasets

**Next Module**: [Modifying-Data.md](Modifying-Data.md) - Learn to insert, update, and delete data

---

**Excellent! You can now combine and compare result sets!** 🎉
