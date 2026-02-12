# Modifying Data

## Learning Objectives

By the end of this module, you will be able to:
- Insert new rows into tables using INSERT
- Update existing data using UPDATE
- Delete rows using DELETE
- Use UPSERT (INSERT ... ON CONFLICT) to insert or update
- Understand when to use each command
- Safely modify data with proper WHERE clauses

---

## INSERT Statement

### What is it?

The `INSERT` statement adds new rows to a table. You specify the table name, the columns you're filling, and the corresponding values.

### Why use it?

- Add new records to your database
- Populate tables with initial data
- Import data from other sources
- Create test data

### Syntax

```sql
INSERT INTO table_name(column_name1, column_name2, ...) 
VALUES(value1, value2, ...);
```

### Example: Insert Single Row

```sql
INSERT INTO category(name) 
VALUES('Horror');
```

**Output**: Adds a new category named "Horror" to the category table.

### Inserting Multiple Rows

You can insert multiple rows in a single statement:

```sql
INSERT INTO category(name) 
VALUES('Musical'), ('Western'), ('Thriller');
```

**Output**: Adds three new categories in one operation - more efficient than three separate INSERT statements!

---

## UPDATE Statement

### What is it?

The `UPDATE` statement modifies existing data in a table. You can update one or multiple columns across one or more rows simultaneously.

### Why use it?

- Correct errors in existing data
- Update records when information changes
- Modify multiple records at once
- Keep data current

### Syntax

```sql
UPDATE table_name 
SET column_name1 = value1, column_name2 = value2, ... 
WHERE condition;
```

### ⚠️ Critical Warning

**ALWAYS use a WHERE clause with UPDATE!** If you omit the WHERE clause, **every row in the table will be updated**, which is usually not what you want!

### Example: Update Single Row

```sql
UPDATE category 
SET name = 'rom-com' 
WHERE name = 'Testing';
```

**Output**: Changes the category name from "Testing" to "rom-com".

### Example: Update Multiple Columns

```sql
UPDATE category 
SET name = 'Old', last_update = NOW() 
WHERE name = 'Abc';
```

**Output**: Updates both the name and last_update columns.

### Example: Update Multiple Rows

```sql
UPDATE film 
SET rental_rate = 4.99 
WHERE rating = 'PG-13';
```

**Output**: Updates rental rate for all PG-13 films.

**Tip**: Always test with SELECT first to see what will be updated:
```sql
-- First, see what will be updated
SELECT * FROM film WHERE rating = 'PG-13';

-- Then update
UPDATE film SET rental_rate = 4.99 WHERE rating = 'PG-13';
```

---

## DELETE Statement

### What is it?

The `DELETE` statement removes one or multiple rows from a table.

### Why use it?

- Remove outdated records
- Clean up test data
- Delete incorrect entries
- Maintain data quality

### Syntax

```sql
DELETE FROM table_name 
WHERE condition;
```

### ⚠️ Critical Warning

**ALWAYS use a WHERE clause with DELETE!** If you omit the WHERE clause, **all rows in the table will be deleted**, which is usually catastrophic!

### Example: Delete Single Row

```sql
DELETE FROM category 
WHERE name = 'Old';
```

**Output**: Removes the category with name "Old".

### Example: Delete Multiple Rows

```sql
DELETE FROM category 
WHERE name IN ('random', 'Testing', 'Abc');
```

**Output**: Removes multiple categories at once.

### DELETE with USING (PostgreSQL)

Delete rows based on conditions from another table:

```sql
DELETE FROM payment 
USING customer 
WHERE payment.customer_id = customer.customer_id 
  AND customer.active = false;
```

**What this does**: Deletes payments for inactive customers by joining with the customer table.

---

## UPSERT (INSERT ... ON CONFLICT)

### What is it?

`UPSERT` is a combination of **UP**date and in**SERT**. It allows you to insert a new row or update an existing one if a unique constraint (like a Primary Key) is violated.

### Why use it?

- Insert if new, update if exists
- Avoid duplicate key errors
- Simplify data synchronization
- Handle race conditions (when multiple users try to insert the same data)

### Syntax

```sql
INSERT INTO table_name(column1, column2, column3) 
VALUES(value1, value2, value3) 
ON CONFLICT (conflict_column) 
[DO NOTHING | DO UPDATE SET column1 = value1, column2 = value2, ...];
```

### Important Concepts

1. **Conflict Target**: The column(s) that must be unique (usually PRIMARY KEY or UNIQUE constraint)
2. **DO NOTHING**: If conflict occurs, do nothing (skip the insert)
3. **DO UPDATE**: If conflict occurs, update the existing row instead
4. **EXCLUDED**: Reference the values you tried to insert using `EXCLUDED.column_name`

### Example: Setup Table

First, create a demo table:

```sql
CREATE TABLE inventory_demo(
    id INT PRIMARY KEY, 
    name VARCHAR(255) NOT NULL, 
    price DECIMAL(10,2) NOT NULL, 
    quantity INT NOT NULL
);

INSERT INTO inventory_demo(id, name, price, quantity) 
VALUES
    (1, 'A', 15.99, 100), 
    (2, 'B', 25.49, 50), 
    (3, 'C', 19.95, 75);
```

### Example: DO UPDATE

Update existing record if ID exists:

```sql
INSERT INTO inventory_demo(id, name, price, quantity) 
VALUES(1, 'A', 16.99, 120) 
ON CONFLICT(id) 
DO UPDATE SET 
    price = EXCLUDED.price, 
    quantity = EXCLUDED.quantity;
```

**What happens**:
- If ID 1 doesn't exist: Inserts new row
- If ID 1 exists: Updates price to 16.99 and quantity to 120

**EXCLUDED** refers to the values in the VALUES clause (16.99 and 120).

### Example: DO NOTHING

Skip insert if ID already exists:

```sql
INSERT INTO inventory_demo(id, name, price, quantity) 
VALUES(4, 'D', 10.99, 200) 
ON CONFLICT(id) 
DO NOTHING;
```

**What happens**:
- If ID 4 doesn't exist: Inserts new row
- If ID 4 exists: Does nothing (no error, no update)

---

## Best Practices

### 1. Always Use WHERE with UPDATE and DELETE

```sql
-- ✅ Good
UPDATE customer SET email = 'new@email.com' WHERE customer_id = 1;

-- ❌ Dangerous - updates ALL rows!
UPDATE customer SET email = 'new@email.com';
```

### 2. Test with SELECT First

Before updating or deleting, verify which rows will be affected:

```sql
-- First, see what will be updated
SELECT * FROM category WHERE name = 'Testing';

-- Then update
UPDATE category SET name = 'rom-com' WHERE name = 'Testing';
```

### 3. Use Transactions for Multiple Operations

```sql
BEGIN;
UPDATE table1 SET column1 = 'value1';
UPDATE table2 SET column2 = 'value2';
-- If everything looks good:
COMMIT;
-- If something went wrong:
ROLLBACK;
```

**Why transactions?**: They ensure all changes succeed together or fail together, keeping your data consistent.

### 4. Backup Before Major Changes

Always backup your data before running UPDATE or DELETE on production data!

---

## Practice Exercises

1. Insert a new category named "Documentary"
2. Update all 'G' rated films to have rental_rate = 2.99
3. Use UPSERT to insert or update a product in inventory_demo (create the table first if needed)

---

## Solutions

```sql
-- 1. Insert
INSERT INTO category(name) VALUES('Documentary');

-- 2. Update
UPDATE film SET rental_rate = 2.99 WHERE rating = 'G';

-- 3. UPSERT
-- First create table if needed
CREATE TABLE inventory_demo(
    id INT PRIMARY KEY, 
    name VARCHAR(255), 
    price DECIMAL(10,2), 
    quantity INT
);

-- Then UPSERT
INSERT INTO inventory_demo(id, name, price, quantity) 
VALUES(1, 'Product A', 19.99, 50) 
ON CONFLICT(id) 
DO UPDATE SET 
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    quantity = EXCLUDED.quantity;
```

---

## Summary

- **INSERT** adds new rows to a table (single or multiple)
- **UPDATE** modifies existing data - always use WHERE!
- **DELETE** removes rows from a table - always use WHERE!
- **UPSERT** (INSERT ... ON CONFLICT) inserts or updates based on conflicts
- **DO UPDATE** updates existing rows when conflict occurs
- **DO NOTHING** skips insert when conflict occurs
- **EXCLUDED** references the values you tried to insert
- Always use **WHERE** clauses to target specific rows
- Test with **SELECT** before UPDATE or DELETE
- Use **transactions** for multiple related operations
- **Backup** data before major changes

**Next Module**: [08-Subqueries.md](08-Subqueries.md) - Learn to write nested queries

---

**Great work! You can now modify data safely and effectively!** 🎉
