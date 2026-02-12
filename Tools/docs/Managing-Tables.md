# Managing Tables

## Learning Objectives

By the end of this module, you will be able to:
- Create new tables with CREATE TABLE
- Modify table structure with ALTER TABLE
- Remove tables with DROP TABLE
- Quickly delete all data with TRUNCATE
- Create tables from queries using SELECT INTO and CREATE TABLE AS
- Understand when to use each command

---

## CREATE TABLE

### What is it?

The `CREATE TABLE` statement defines a new table and its structure within a database. It allows you to specify column names, data types, and rules (constraints) to ensure data integrity.

### Why use it?

- Create new tables for your data
- Define the structure of your database
- Set up tables with proper data types and constraints
- Organize data logically

### Syntax

```sql
CREATE TABLE [IF NOT EXISTS] table_name (
    column1 datatype(length) column_constraint,
    column2 datatype(length) column_constraint,
    ...
    table_constraints
);
```

### IF NOT EXISTS

An optional clause that prevents errors if the table already exists. Instead of failing, PostgreSQL will simply issue a notice.

```sql
CREATE TABLE IF NOT EXISTS my_table (...);
```

### Column Constraints

Rules applied to individual columns:
- **NOT NULL**: Column cannot be empty
- **UNIQUE**: All values must be different
- **DEFAULT**: Sets a fallback value
- **PRIMARY KEY**: Uniquely identifies rows
- **FOREIGN KEY**: Links to another table

### Table Constraints

Rules that can involve multiple columns:
- **PRIMARY KEY**: Composite primary key
- **FOREIGN KEY**: Multi-column foreign key
- **UNIQUE**: Multi-column unique constraint
- **CHECK**: Custom validation rules

### Example: Create a Table

```sql
CREATE TABLE accounts (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL,
    last_login TIMESTAMP
);
```

**What this creates**:
- `user_id`: Auto-incrementing primary key
- `username`: Unique, required
- `password`: Required
- `email`: Unique, required
- `created_at`: Required timestamp
- `last_login`: Optional timestamp

---

## ALTER TABLE

### What is it?

The `ALTER TABLE` statement modifies the structure of an existing table without deleting and recreating it.

### Why use it?

- Add or remove columns
- Change data types
- Rename columns or tables
- Add or remove constraints
- Modify table structure as requirements change

### Common Operations

#### Add a Column

```sql
ALTER TABLE table_name 
ADD COLUMN column_name datatype column_constraint;
```

**Example**:
```sql
ALTER TABLE accounts 
ADD COLUMN phone VARCHAR(15);
```

#### Drop a Column

```sql
ALTER TABLE table_name 
DROP COLUMN column_name;
```

**Example**:
```sql
ALTER TABLE accounts 
DROP COLUMN phone;
```

#### Change Data Type

```sql
ALTER TABLE table_name 
ALTER COLUMN column_name TYPE new_datatype;
```

**Example**:
```sql
ALTER TABLE accounts 
ALTER COLUMN phone TYPE VARCHAR(20);
```

#### Rename a Column

```sql
ALTER TABLE table_name 
RENAME COLUMN old_name TO new_name;
```

**Example**:
```sql
ALTER TABLE accounts 
RENAME COLUMN phone TO phone_number;
```

#### Rename the Table

```sql
ALTER TABLE table_name 
RENAME TO new_table_name;
```

**Example**:
```sql
ALTER TABLE accounts 
RENAME TO users;
```

#### Set Default Value

```sql
ALTER TABLE table_name 
ALTER COLUMN column_name SET DEFAULT value;
```

**Example**:
```sql
ALTER TABLE accounts 
ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
```

---

## DROP TABLE

### What is it?

The `DROP TABLE` statement permanently removes a table and all its data from the database.

### ⚠️ Warning

This operation is **irreversible**! All data in the table will be permanently deleted.

### Syntax

```sql
DROP TABLE table_name;
```

### Drop Multiple Tables

```sql
DROP TABLE table1, table2, table3;
```

### IF EXISTS

Prevents errors if the table doesn't exist:

```sql
DROP TABLE IF EXISTS table_name;
```

**Tip**: Always use `IF EXISTS` to avoid errors if the table was already deleted.

---

## TRUNCATE TABLE

### What is it?

The `TRUNCATE TABLE` statement quickly deletes all data from an existing table, but keeps the table structure intact.

### Why use it?

- Much faster than `DELETE` for removing all rows
- Resets auto-increment counters
- Keeps table structure (columns, constraints, etc.)
- Cannot be rolled back in some cases (be careful!)

### Syntax

```sql
TRUNCATE TABLE table_name;
```

### TRUNCATE vs. DELETE

| TRUNCATE | DELETE |
|----------|--------|
| Faster (no row-by-row scan) | Slower (scans each row) |
| Removes all rows only | Can remove specific rows |
| Resets auto-increment | Doesn't reset auto-increment |
| Cannot use WHERE | Can use WHERE clause |
| May not be rollback-able | Always rollback-able |

### Example

```sql
-- Remove all data from a table
TRUNCATE TABLE test_data;

-- Truncate multiple tables
TRUNCATE TABLE table1, table2;
```

**When to use**: When you want to quickly clear all data but keep the table structure for reuse.

---

## CREATE TABLE AS

### What is it?

The `CREATE TABLE AS` statement creates a new table and populates it with the results of a query in a single operation. It's the modern, more flexible alternative to `SELECT INTO`.

### Why use it?

- More flexible than SELECT INTO
- Can specify table structure explicitly
- Better control over constraints
- Modern SQL standard

### Syntax

```sql
CREATE TABLE new_table_name AS query;

-- Or for temporary tables
CREATE TEMP TABLE new_table_name AS query;
```

### Example

```sql
CREATE TABLE action_film AS 
SELECT 
    film_id, 
    title, 
    release_year, 
    length, 
    rating 
FROM film 
INNER JOIN film_category USING (film_id) 
WHERE category_id = 1;
```

**Output**: Creates `action_film` table with all Action category films.

**Why this is useful**: Quickly create a new table with filtered or transformed data from existing tables.

---

## Best Practices

### 1. Always Backup Before DROP or TRUNCATE

```sql
-- Create backup first
CREATE TABLE accounts_backup AS SELECT * FROM accounts;

-- Then drop or truncate
DROP TABLE accounts;
```

### 2. Use IF EXISTS/IF NOT EXISTS

```sql
-- Won't error if table exists
CREATE TABLE IF NOT EXISTS my_table (...);

-- Won't error if table doesn't exist
DROP TABLE IF EXISTS old_table;
```

### 3. Test ALTER TABLE on Copies

```sql
-- Create test copy
CREATE TABLE accounts_test AS SELECT * FROM accounts;

-- Test your ALTER on the copy
ALTER TABLE accounts_test ADD COLUMN test_column INT;

-- If successful, apply to real table
ALTER TABLE accounts ADD COLUMN test_column INT;
```

### 4. Use Transactions for Multiple Changes

```sql
BEGIN;
ALTER TABLE accounts ADD COLUMN phone VARCHAR(15);
ALTER TABLE accounts ADD COLUMN address TEXT;
-- Review changes, then:
COMMIT;
-- Or rollback if needed:
-- ROLLBACK;
```

---

## Practice Exercises

1. Create a table for storing book information (id, title, author, year, price)
2. Add a `genre` column to the books table
3. Create a table from a query selecting films from 2006

---

## Solutions

```sql
-- 1. Create table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100),
    year INT,
    price NUMERIC(10, 2)
);

-- 2. Add column
ALTER TABLE books ADD COLUMN genre VARCHAR(50);

-- 3. Create from query
CREATE TABLE films_2006 AS 
SELECT film_id, title, release_year 
FROM film 
WHERE release_year = 2006;
```

---

## Summary

- **CREATE TABLE**: Define new tables with columns, data types, and constraints
- **ALTER TABLE**: Modify existing table structure (add/drop columns, change types, rename, etc.)
- **DROP TABLE**: Permanently remove tables and all data (irreversible!)
- **TRUNCATE TABLE**: Quickly delete all rows but keep table structure (faster than DELETE)
- **CREATE TABLE AS**: Modern way to create table from query (recommended)
- Always use **IF EXISTS/IF NOT EXISTS** to avoid errors
- **Backup** data before DROP or TRUNCATE
- Use **transactions** for multiple ALTER operations
- **Test changes** on copies before applying to production tables

**Next Module**: [Constraints.md](Constraints.md) - Learn to enforce data integrity with constraints

---

**Great job! You can now create and manage tables effectively!** 🎉
