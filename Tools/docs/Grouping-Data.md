# Grouping Data

## Learning Objectives

By the end of this module, you will be able to:
- Use GROUP BY to organize rows into groups
- Apply aggregate functions (SUM, COUNT, AVG, etc.)
- Filter groups using HAVING clause
- Understand the difference between WHERE and HAVING
- Group by multiple columns
- Combine grouping with joins

---

## GROUP BY Clause

### What is it?

The `GROUP BY` clause divides rows into groups based on one or more columns. It's typically used with aggregate functions like `SUM()`, `COUNT()`, `AVG()`, `MAX()`, and `MIN()` to calculate totals or averages for each group.

### Why use it?

- Calculate totals by category (e.g., total sales per customer)
- Count records in groups (e.g., number of films per rating)
- Find averages per group (e.g., average payment per customer)
- Generate summary reports
- Analyze data by segments

### Syntax

```sql
SELECT column_name1, aggregate_function(column_name2)
FROM table_name
GROUP BY column_name1;
```

**Important Rules**:
- All non-aggregated columns in SELECT must appear in GROUP BY
- Aggregate functions calculate values for each group
- GROUP BY comes after FROM and WHERE, but before ORDER BY

---

## Aggregate Functions

These functions perform calculations on groups of rows:

| Function | Description | Example |
|----------|-------------|---------|
| `COUNT()` | Counts rows | `COUNT(*)` or `COUNT(column_name)` |
| `SUM()` | Sums numeric values | `SUM(amount)` |
| `AVG()` | Calculates average | `AVG(amount)` |
| `MAX()` | Finds maximum value | `MAX(amount)` |
| `MIN()` | Finds minimum value | `MIN(amount)` |

### Examples

**Total payments per customer**:
```sql
SELECT customer_id, SUM(amount) AS total 
FROM payment 
GROUP BY customer_id 
ORDER BY customer_id;
```
**Output**: Shows each customer ID with their total payment amount.

**Multiple aggregates**:
```sql
SELECT customer_id, 
       COUNT(*) AS payment_count,
       SUM(amount) AS total,
       AVG(amount) AS average
FROM payment 
GROUP BY customer_id;
```
**Output**: Comprehensive statistics for each customer's payments.

---

## GROUP BY with JOINs

Combine grouping with joins to get more meaningful results:

### Example: Customer Names with Total Payments

```sql
SELECT c.first_name || ' ' || c.last_name AS full_name, 
       SUM(p.amount) AS total_paid
FROM customer c 
INNER JOIN payment p ON c.customer_id = p.customer_id 
GROUP BY full_name 
ORDER BY total_paid DESC;
```

**Output**: Shows customer full names with their total payment amounts, sorted by highest payer first.

**Why this is useful**: Instead of just customer IDs, you get readable customer names with their totals.

### Group by Multiple Columns

You can group by multiple columns:

```sql
SELECT customer_id, staff_id, SUM(amount) AS total_amount
FROM payment 
GROUP BY customer_id, staff_id 
ORDER BY customer_id;
```

**Output**: Shows total payments per customer per staff member (e.g., how much each customer paid to each staff member).

---

## HAVING Clause

### What is it?

The `HAVING` clause filters groups created by `GROUP BY`. While `WHERE` filters individual rows, `HAVING` filters the resulting groups based on aggregate values.

### Why use it?

- Filter groups based on aggregate results
- Find groups that meet certain criteria (e.g., total > 100)
- Apply conditions to calculated values

### Syntax

```sql
SELECT column_name1, aggregate_function(column_name2)
FROM table_name
GROUP BY column_name1
HAVING condition;
```

### HAVING vs. WHERE

| WHERE | HAVING |
|-------|--------|
| Filters **individual rows** | Filters **groups** |
| Used before grouping | Used after grouping |
| Cannot use aggregate functions | Can use aggregate functions |
| Applied to raw data | Applied to grouped results |

### Example: Filter Groups

Find customers who spent more than $200:

```sql
SELECT customer_id, SUM(amount) AS total_spent
FROM payment 
GROUP BY customer_id 
HAVING SUM(amount) > 200 
ORDER BY total_spent DESC;
```

**Output**: Only customers with total payments exceeding $200.

**Why HAVING?**: You can't use `WHERE SUM(amount) > 200` because SUM() is calculated after grouping. HAVING filters the groups after they're created.

### Example: HAVING with COUNT

Find customers who made more than 10 payments:

```sql
SELECT customer_id, COUNT(*) AS payment_count
FROM payment 
GROUP BY customer_id 
HAVING COUNT(*) > 10 
ORDER BY payment_count DESC;
```

---

## Combining WHERE and HAVING

You can use both WHERE and HAVING in the same query:

```sql
SELECT customer_id, SUM(amount) AS total_spent
FROM payment 
WHERE amount > 2.00  -- Filter individual payments first
GROUP BY customer_id 
HAVING SUM(amount) > 200  -- Then filter groups
ORDER BY total_spent DESC;
```

**Process**:
1. **WHERE**: Filters individual payment rows (only payments > $2.00)
2. **GROUP BY**: Groups remaining payments by customer
3. **HAVING**: Filters groups (only customers with total > $200)

**Why this matters**: You filter the data at two levels - first the individual rows, then the groups.

---

## Practice Exercises

1. Count how many films are in each rating category
2. Calculate the total rental amount per customer
3. Find customers who spent more than $150 (use HAVING)
4. Show average film length by rating, only for ratings with average > 100 minutes

---

## Solutions

```sql
-- 1. Films per rating
SELECT rating, COUNT(*) AS film_count 
FROM film 
GROUP BY rating 
ORDER BY film_count DESC;

-- 2. Total per customer
SELECT customer_id, SUM(amount) AS total_amount
FROM payment 
GROUP BY customer_id 
ORDER BY total_amount DESC;

-- 3. High spenders
SELECT customer_id, SUM(amount) AS total_spent 
FROM payment 
GROUP BY customer_id 
HAVING SUM(amount) > 150 
ORDER BY total_spent DESC;

-- 4. Average length by rating
SELECT rating, AVG(length) AS avg_length 
FROM film 
GROUP BY rating 
HAVING AVG(length) > 100
ORDER BY avg_length DESC;
```

---

## Summary

- **GROUP BY** organizes rows into groups based on column values
- **Aggregate functions** (`COUNT`, `SUM`, `AVG`, `MAX`, `MIN`) calculate values for each group
- All non-aggregated columns in SELECT must be in GROUP BY
- **HAVING** filters groups after they're created (unlike WHERE which filters rows)
- **WHERE** filters individual rows before grouping
- **HAVING** filters groups after grouping (can use aggregate functions)
- You can group by multiple columns
- Combine GROUP BY with JOINs to get meaningful aggregated data
- Use ORDER BY after GROUP BY to sort grouped results

**Next Module**: [06-Set-Operations.md](06-Set-Operations.md) - Learn to combine multiple result sets

---

**Great job! You can now group and aggregate data effectively!** 🎉
