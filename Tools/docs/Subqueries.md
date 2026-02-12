# Subqueries

## Learning Objectives

By the end of this module, you will be able to:
- Write subqueries (nested queries)
- Understand correlated vs. non-correlated subqueries
- Use subqueries with IN, ANY, and ALL operators
- Use EXISTS to check for row existence
- Apply subqueries in WHERE, FROM, and SELECT clauses
- Solve complex problems with nested queries

---

## What is a Subquery?

### Definition

A **subquery** (also called an inner query) is a query nested inside another query. The subquery is always enclosed within parentheses and is executed first, providing its result to the main (outer) query.

### Why use it?

- Break complex problems into smaller parts
- Use results from one query as input for another
- Filter data based on conditions from other tables
- Perform multi-step lookups in a single statement

### Syntax

```sql
SELECT column_name(s) 
FROM table_name 
WHERE column_name (operator) (SELECT column_name FROM table_name WHERE condition);
```

**Think of it like this**: A subquery is like asking a question to answer another question. First, you find something (subquery), then you use that result in your main query.

---

## Basic Subquery

### Example: Films in Action Category

```sql
SELECT film_id, title 
FROM film 
WHERE film_id IN (
    SELECT film_id 
    FROM film_category 
    INNER JOIN category USING (category_id) 
    WHERE name = 'Action'
) 
ORDER BY film_id;
```

**How it works**:
1. **Inner query** executes first: Finds all film_ids in the Action category
2. **Outer query** uses those IDs: Selects films matching those IDs

**Output**: All films in the Action category.

---

## Subquery Types

### 1. Non-Correlated Subquery

The inner query is independent and executes once before the outer query.

**Example**:
```sql
SELECT title, rental_rate 
FROM film 
WHERE rental_rate > (
    SELECT AVG(rental_rate) 
    FROM film
);
```

**Process**:
1. Inner query calculates average rental rate (runs once)
2. Outer query finds films with rate higher than that average

**Why it's called "non-correlated"**: The inner query doesn't depend on the outer query - it runs once and gives a single result.

### 2. Correlated Subquery

The inner query refers to columns from the outer query and is re-evaluated for each row.

**Example**:
```sql
SELECT film_id, title, length, rating 
FROM film f 
WHERE length > (
    SELECT AVG(length) 
    FROM film 
    WHERE rating = f.rating
);
```

**Process**:
1. For each film in the outer query
2. Inner query calculates average length for that film's rating
3. Compares the film's length to that average

**Output**: Films longer than the average for their specific rating.

**Why it's called "correlated"**: The inner query correlates with (depends on) each row of the outer query.

---

## Subquery with IN Operator

### What is it?

Use `IN` with a subquery to check if a value exists in the subquery's result set.

### Why use it?

- Check if a value exists in another table
- Filter based on results from another query
- More flexible than hardcoding a list

### Example: Customers Who Rented Action Films

```sql
SELECT DISTINCT customer_id, first_name, last_name 
FROM customer 
WHERE customer_id IN (
    SELECT DISTINCT r.customer_id 
    FROM rental r
    INNER JOIN inventory i ON r.inventory_id = i.inventory_id
    INNER JOIN film_category fc ON i.film_id = fc.film_id
    INNER JOIN category c ON fc.category_id = c.category_id
    WHERE c.name = 'Action'
);
```

**Output**: Customers who have rented at least one Action film.

---

## ANY Operator

### What is it?

The `ANY` operator compares a single value against a set of values returned by a subquery. The condition is true if **at least one value** satisfies the comparison.

### Why use it?

- Check if a value meets any condition in a set
- More flexible than IN (works with comparison operators like &gt;, &lt;)
- Useful for range comparisons

### Syntax

```sql
expression operator ANY (subquery)
```

**Operators**: `=`, `>`, `<`, `>=`, `<=`, `<>`

### Example: Films Longer Than Any Film in a Rating

```sql
SELECT film_id, title, length, rating 
FROM film f 
WHERE length > ANY (
    SELECT AVG(length) 
    FROM film 
    WHERE rating = f.rating
) 
LIMIT 15;
```

**Output**: Films longer than at least one average length for their rating category.

---

## ALL Operator

### What is it?

The `ALL` operator compares a value against **every value** in a result set returned by a subquery. It returns true only if the comparison holds for **all values** in the set.

### Why use it?

- Check if a value meets all conditions
- Stricter than ANY
- Useful for "greater than all" or "less than all" scenarios

### Syntax

```sql
expression operator ALL (subquery)
```

### Example: Films Longer Than All Films in a Rating

```sql
SELECT film_id, title, length, rating 
FROM film f 
WHERE length > ALL (
    SELECT length 
    FROM film 
    WHERE rating = f.rating AND film_id != f.film_id
);
```

**Output**: Films longer than all other films in their rating category.

**Note**: This is stricter than ANY - the film must be longer than every other film in its rating.

---

## EXISTS Operator

### What is it?

`EXISTS` is a boolean operator that checks if a subquery returns **any rows**. It returns `true` as soon as it finds at least one matching row; otherwise, it returns `false`.

### Why use it?

- Check for existence of related records
- Often more efficient than IN for large datasets
- Useful for "has at least one" scenarios

### Syntax

```sql
EXISTS (subquery)
```

### Example: Check if Any Zero Payments Exist

```sql
SELECT EXISTS (
    SELECT 1 
    FROM payment 
    WHERE amount = 0
);
```

**Output**: Returns `true` if any payment has amount 0, `false` otherwise.

**Note**: The `SELECT 1` is just a placeholder - EXISTS only cares if rows exist, not what columns are selected.

### Example: Customers Who Made High Payments

```sql
SELECT first_name, last_name 
FROM customer c 
WHERE EXISTS (
    SELECT 1 
    FROM payment p 
    WHERE p.customer_id = c.customer_id 
      AND amount > 11
) 
ORDER BY first_name, last_name;
```

**Output**: Customers who have made at least one payment greater than $11.

### EXISTS vs. IN

| EXISTS | IN |
|--------|-----|
| Stops at first match (faster) | Checks all values |
| Better for large datasets | Better for small lists |
| Works with correlated subqueries | Usually with non-correlated |

---

## Practice Exercises

1. Find films with rental rate higher than the average rental rate
2. Find customers who have made at least one payment (use EXISTS)
3. Find films longer than the average for their rating (correlated subquery)

---

## Solutions

```sql
-- 1. Above average
SELECT title, rental_rate 
FROM film 
WHERE rental_rate > (SELECT AVG(rental_rate) FROM film);

-- 2. Customers with payments
SELECT customer_id, first_name, last_name 
FROM customer c 
WHERE EXISTS (
    SELECT 1 FROM payment p 
    WHERE p.customer_id = c.customer_id
);

-- 3. Correlated subquery
SELECT film_id, title, length, rating 
FROM film f 
WHERE length > (
    SELECT AVG(length) 
    FROM film 
    WHERE rating = f.rating
);
```

---

## Summary

- **Subqueries** are queries nested inside other queries (enclosed in parentheses)
- **Non-correlated subqueries** execute once before the outer query
- **Correlated subqueries** reference outer query columns and execute for each row
- **IN** checks if a value exists in subquery results
- **ANY** returns true if comparison matches at least one value
- **ALL** returns true only if comparison matches all values
- **EXISTS** checks if subquery returns any rows (often more efficient than IN)
- Subqueries help break complex problems into manageable parts

**Next Module**: [09-Data-Types.md](09-Data-Types.md) - Learn about PostgreSQL data types

---

**Excellent! You can now write powerful nested queries!** 🎉
