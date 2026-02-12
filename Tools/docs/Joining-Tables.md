# Joining Tables

## Learning Objectives

By the end of this module, you will be able to:
- Understand why we join tables
- Use table aliases to simplify queries
- Perform INNER JOINs to combine matching rows
- Use LEFT JOIN and RIGHT JOIN to include all rows from one side
- Understand SELF JOINs for hierarchical data
- Use CROSS JOIN and NATURAL JOIN (with caution)
- Join multiple tables together

---

## Why Join Tables?

In relational databases, data is organized into multiple tables to avoid duplication and maintain data integrity. However, you often need to combine data from different tables to get complete information.

**Example**: 
- `customer` table has customer information (name, email)
- `payment` table has payment records (amount, date)
- To see which customer made which payment, you need to join them!

**Think of it like this**: Joins are like connecting puzzle pieces - they link related information from different tables together.

---

## Table Aliases

### What is it?

A table alias gives a temporary name to a table during a query, making your code shorter and easier to read.

### Why use it?

- Shorten long table names
- **Required** when joining a table to itself (self join)
- Make queries more readable
- Avoid column name conflicts when tables have columns with the same name

### Syntax

```sql
table_name AS alias_name
-- OR (AS is optional)
table_name alias_name
```

### Example

```sql
SELECT f.title 
FROM film AS f 
ORDER BY f.title 
LIMIT 5;
```

**Note**: Once you create an alias, you must use it consistently in that query. Here, `f` refers to the `film` table.

---

## INNER JOIN

### What is it?

`INNER JOIN` combines rows from two or more tables based on a matching condition. It only returns rows where there is a match in **both** tables.

### Why use it?

- Combine related data from multiple tables
- Get complete information from related records
- Most common type of join (used in 90% of cases)

### Syntax

```sql
SELECT column_name(s) 
FROM table_1 
INNER JOIN table_2 
ON table_1.column_name = table_2.column_name;
```

### Example: Join Two Tables

```sql
SELECT c.customer_id, c.first_name, c.last_name, p.amount 
FROM customer c 
INNER JOIN payment p ON p.customer_id = c.customer_id;
```

**What this does**: Returns customer information along with their payment details, but only for customers who made payments.

**How it works**: 
1. Looks at each customer
2. Finds matching payments using `customer_id`
3. Combines the data into one result

### USING Clause

When both tables have the same column name, you can use `USING` as a shorthand:

```sql
SELECT customer_id, first_name, last_name, amount 
FROM customer 
INNER JOIN payment 
USING(customer_id);
```

**Why use USING?**: Cleaner syntax when column names match exactly.

### Join Three Tables

```sql
SELECT c.first_name || ' ' || c.last_name AS customer_name, 
       s.first_name || ' ' || s.last_name AS staff_name, 
       p.amount 
FROM customer c 
INNER JOIN payment p USING(customer_id) 
INNER JOIN staff s USING(staff_id);
```

**What this does**: Shows customer name, staff member who processed the payment, and payment amount - combining data from three tables!

---

## LEFT JOIN

### What is it?

`LEFT JOIN` returns **all rows** from the left table and the matching rows from the right table. If no match exists, it returns NULL for the right table's columns.

### Why use it?

- Find records in one table that may not have matches in another
- Include all records from the "main" table
- Identify missing relationships (e.g., customers who never made payments)

### Syntax

```sql
SELECT column_name(s) 
FROM table_1 
LEFT JOIN table_2 
ON table_1.column_name = table_2.column_name;
```

### Example: Basic LEFT JOIN

```sql
SELECT f.film_id, f.title, i.inventory_id 
FROM film f 
LEFT JOIN inventory i USING(film_id);
```

**Output**: Returns all films, even if they're not in inventory. Films without inventory show NULL for `inventory_id`.

### Find Missing Records

A common use of LEFT JOIN is to find records that don't have matches:

```sql
SELECT f.film_id, f.title 
FROM film f 
LEFT JOIN inventory i USING(film_id)
WHERE i.film_id IS NULL;
```

**Output**: Returns only films that don't have any inventory records - useful for identifying missing data!

---

## RIGHT JOIN

### What is it?

`RIGHT JOIN` returns **all rows** from the right table and the matching rows from the left table. If no match exists, it returns NULL for the left table's columns.

### Why use it?

- Similar to LEFT JOIN but from the opposite perspective
- **Rarely used** - you can achieve the same result with LEFT JOIN by swapping tables

**Tip**: Instead of RIGHT JOIN, use LEFT JOIN and swap the table order. It's more intuitive and commonly used.

---

## SELF JOIN

### What is it?

A `SELF JOIN` is a regular join where a table is joined with itself. This is useful for querying hierarchical data or comparing rows within the same table.

### Why use it?

- Query employee-manager relationships
- Find related records in the same table
- Compare rows within a table

### Important

You **must** use table aliases in self joins because you're referencing the same table twice!

### Example: Hierarchical Data

First, create a demo employee table:

```sql
CREATE TABLE employee (
    employee_id INT PRIMARY KEY, 
    first_name VARCHAR(255) NOT NULL, 
    last_name VARCHAR(255) NOT NULL, 
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employee(employee_id)
);

INSERT INTO employee (employee_id, first_name, last_name, manager_id) VALUES
  (1, 'Windy', 'Hays', NULL),
  (2, 'Ava', 'Christensen', 1),
  (3, 'Hassan', 'Conner', 1),
  (4, 'Anna', 'Reeves', 2);
```

Now query the hierarchy:

```sql
SELECT e.first_name || ' ' || e.last_name AS employee, 
       m.first_name || ' ' || m.last_name AS manager 
FROM employee e 
INNER JOIN employee m ON m.employee_id = e.manager_id;
```

**Output**: Shows each employee with their manager. Notice we use `e` for employee and `m` for manager - both refer to the same `employee` table!

---

## CROSS JOIN

### What is it?

`CROSS JOIN` produces a **Cartesian product** by combining every row of the first table with every row of the second table.

**If Table A has N rows and Table B has M rows, the result will contain N × M rows!**

### Why use it?

- Generate all possible combinations
- Create test data
- Rarely used in production queries

### ⚠️ Warning

Use CROSS JOIN with caution! It can generate **massive result sets** and impact performance.

### Example

```sql
SELECT c.first_name, f.title 
FROM customer c 
CROSS JOIN film f 
LIMIT 10;
```

**Output**: Every customer paired with every film (limited to 10 rows for display).

**Without LIMIT**: This would return millions of rows (number of customers × number of films)!

---

## NATURAL JOIN

### What is it?

`NATURAL JOIN` automatically matches tables based on columns with **identical names**. It eliminates the need for an ON or USING clause.

### Why use it?

- Shorter syntax
- Automatically finds matching columns

### ⚠️ Warning

**Use with caution!** NATURAL JOIN can be risky because it automatically joins **any** columns with the same name. This can cause errors if columns like "id" or "created_at" exist in both tables but aren't meant to be linked.

### Example

```sql
SELECT customer_id, first_name, last_name, amount 
FROM customer 
NATURAL INNER JOIN payment;
```

**Output**: Joins on `customer_id` automatically (if it exists in both tables).

**Best Practice**: It's generally safer to use explicit INNER JOIN with ON or USING clauses so you control exactly how tables are joined.

---

## Practice Exercises

1. Join `customer` and `payment` to show customer names with their payment amounts
2. Find all films and their inventory IDs (if they exist in inventory)
3. Join `film`, `film_actor`, and `actor` to show film titles with actor names
4. Find customers who have never made a payment (use LEFT JOIN)

---

## Solutions

```sql
-- 1. Customer payments
SELECT c.first_name, c.last_name, p.amount 
FROM customer c 
INNER JOIN payment p ON c.customer_id = p.customer_id;

-- 2. Films with inventory
SELECT f.film_id, f.title, i.inventory_id 
FROM film f 
LEFT JOIN inventory i ON f.film_id = i.film_id;

-- 3. Films with actors
SELECT f.title, a.first_name || ' ' || a.last_name AS actor_name 
FROM film f 
INNER JOIN film_actor fa ON f.film_id = fa.film_id
INNER JOIN actor a ON fa.actor_id = a.actor_id;

-- 4. Customers without payments
SELECT c.customer_id, c.first_name, c.last_name 
FROM customer c 
LEFT JOIN payment p ON c.customer_id = p.customer_id 
WHERE p.payment_id IS NULL;
```

---

## Summary

- **Table aliases** shorten table names and are required for self joins
- **INNER JOIN** returns only matching rows from both tables - most common join type
- **LEFT JOIN** returns all rows from left table and matching rows from right - use to find missing relationships
- **RIGHT JOIN** is rarely used - use LEFT JOIN with swapped tables instead
- **SELF JOIN** joins a table to itself (useful for hierarchies) - requires aliases
- **CROSS JOIN** creates Cartesian product - use with caution (can create huge result sets)
- **NATURAL JOIN** automatically matches columns with same names - use with caution
- Use **USING** when both tables have the same column name for cleaner syntax
- You can join **multiple tables** in a single query
- Always use **WHERE** clauses to filter joined results when needed

**Next Module**: [Grouping-Data.md](Grouping-Data.md) - Learn to group and aggregate data

---

**Excellent work! You can now combine data from multiple tables!** 🎉
