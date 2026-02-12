# Database Constraints

## Learning Objectives

By the end of this module, you will be able to:
- Understand what constraints are and why they matter
- Use PRIMARY KEY to uniquely identify rows
- Use FOREIGN KEY to link tables and maintain referential integrity
- Apply UNIQUE constraints to prevent duplicates
- Use NOT NULL to require values
- Set DEFAULT values for columns
- Understand ON DELETE and ON UPDATE actions

---

## What Are Constraints?

### Definition

Constraints are rules applied to columns or tables that enforce data integrity. They ensure that data in your database meets certain requirements and maintains consistency.

### Why use them?

- **Data integrity**: Prevent invalid data from being stored
- **Data consistency**: Ensure relationships between tables are valid
- **Error prevention**: Catch problems early
- **Business rules**: Enforce your application's requirements at the database level

**Think of it like this**: Constraints are like rules in a game - they ensure everyone plays by the same rules and prevent cheating (invalid data).

---

## PRIMARY KEY Constraint

### What is it?

A **PRIMARY KEY** is a column (or group of columns) used to uniquely identify every row in a table. It's the most important constraint for maintaining data integrity.

### Characteristics

- **Unique**: No two rows can have the same primary key value
- **NOT NULL**: Primary key columns cannot be empty
- **One per table**: A table can have zero or one primary key (not more)
- **Indexed**: Automatically creates an index for fast lookups

### Syntax

**Single column**:
```sql
CREATE TABLE table_name (
    column_1 data_type PRIMARY KEY,
    column_2 data_type,
    ...
);
```

**Multiple columns (composite)**:
```sql
CREATE TABLE table_name (
    column_1 data_type,
    column_2 data_type,
    ...
    PRIMARY KEY(column_1, column_2, ...)
);
```

### Example: Single Column Primary Key

```sql
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    email VARCHAR(255)
);
```

**What this does**:
- `customer_id` is the primary key
- Each customer gets a unique ID automatically (SERIAL)
- No two customers can have the same ID

### Example: Composite Primary Key

```sql
CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT,
    PRIMARY KEY(order_id, product_id)
);
```

**What this does**:
- Combination of `order_id` and `product_id` must be unique
- Same product can appear in different orders
- Same order can have different products
- But same product cannot appear twice in the same order

---

## FOREIGN KEY Constraint

### What is it?

A **FOREIGN KEY** is a column (or group of columns) that creates a link between two tables. It ensures referential integrity by requiring that the value in the "child" table must exist in the "parent" table's Primary Key.

### Key Concepts

- **Parent table**: The table being referenced (has the primary key)
- **Child table**: The table containing the foreign key (references the parent)
- **Referential integrity**: Ensures relationships are valid

**Think of it like this**: A foreign key is like a reference in a book - it points to something that must exist elsewhere.

### Syntax

```sql
[CONSTRAINT fk_name] 
FOREIGN KEY(fk_columns) 
REFERENCES parent_table(parent_key_columns) 
[ON DELETE delete_action] 
[ON UPDATE update_action]
```

### Example: Basic Foreign Key

```sql
-- Parent table
CREATE TABLE customers(
    customer_id INT GENERATED ALWAYS AS IDENTITY, 
    customer_name VARCHAR(255) NOT NULL, 
    PRIMARY KEY(customer_id)
);

-- Child table with foreign key
CREATE TABLE contacts(
    contact_id INT GENERATED ALWAYS AS IDENTITY, 
    customer_id INT, 
    contact_name VARCHAR(255) NOT NULL, 
    phone VARCHAR(15), 
    email VARCHAR(100), 
    PRIMARY KEY(contact_id), 
    CONSTRAINT fk_customer 
        FOREIGN KEY(customer_id) 
        REFERENCES customers(customer_id)
);
```

**What this does**:
- `contacts.customer_id` must exist in `customers.customer_id`
- Prevents orphaned contact records
- Ensures data integrity

### ON DELETE Actions

Define what happens to child rows when a parent row is deleted:

#### RESTRICT / NO ACTION (Default)

Prevents deletion of the parent row if any child rows reference it.

```sql
FOREIGN KEY(customer_id) 
REFERENCES customers(customer_id) 
ON DELETE NO ACTION
```

**Example**:
```sql
-- Try to delete customer with contacts
DELETE FROM customers WHERE customer_id = 1;
-- Error: Cannot delete because contacts still reference it
```

#### SET NULL

Sets the child's foreign key column to NULL if the parent is deleted.

```sql
FOREIGN KEY(customer_id) 
REFERENCES customers(customer_id) 
ON DELETE SET NULL
```

**Example**:
```sql
-- Delete customer
DELETE FROM customers WHERE customer_id = 1;
-- Contacts for customer_id = 1 now have customer_id = NULL
```

#### CASCADE

Automatically deletes child rows when the parent is deleted.

```sql
FOREIGN KEY(customer_id) 
REFERENCES customers(customer_id) 
ON DELETE CASCADE
```

**Example**:
```sql
-- Delete customer
DELETE FROM customers WHERE customer_id = 1;
-- All contacts for customer_id = 1 are also deleted
```

**⚠️ Warning**: CASCADE can delete a lot of data! Use carefully.

---

## UNIQUE Constraint

### What is it?

A **UNIQUE** constraint ensures that all values in a column (or a group of columns) are different across the entire table.

### Characteristics

- **Prevents duplicates**: No two rows can have the same value(s)
- **Allows NULL**: Unlike PRIMARY KEY, UNIQUE allows multiple NULL values
- **Multiple constraints**: A table can have multiple UNIQUE constraints
- **Common uses**: Email addresses, usernames, phone numbers

### Syntax

**Column level**:
```sql
CREATE TABLE table_name (
    column_name data_type UNIQUE,
    ...
);
```

**Table level**:
```sql
CREATE TABLE table_name (
    column1 data_type,
    column2 data_type,
    ...
    UNIQUE(column1, column2, ...)
);
```

### Example

```sql
CREATE TABLE person (
    id SERIAL PRIMARY KEY, 
    first_name VARCHAR(50), 
    last_name VARCHAR(50), 
    email VARCHAR(50) UNIQUE
);
```

**What this does**:
- Ensures no two people have the same email
- Allows NULL values (multiple NULLs are allowed)
- Email must be unique if provided

---

## NOT NULL Constraint

### What is it?

The **NOT NULL** constraint ensures that a column cannot be empty. Every row must have a value for that column.

### Why use it?

- **Required fields**: Ensure critical data is always present
- **Data quality**: Prevent incomplete records
- **Business rules**: Enforce mandatory information

### Syntax

**At table creation**:
```sql
CREATE TABLE table_name (
    column1 data_type NOT NULL,
    column2 data_type,  -- Can be NULL
    ...
);
```

**Add to existing table**:
```sql
ALTER TABLE table_name 
ALTER COLUMN column_name SET NOT NULL;
```

### Example

```sql
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),  -- Can be NULL
    phone VARCHAR(15)    -- Can be NULL
);
```

**Note**: You can only add NOT NULL to a column if all existing rows have values in that column.

---

## Understanding NULL

### What is NULL?

In PostgreSQL, **NULL** represents missing or unknown data. It is a marker, not a value.

### Important Facts

- **NULL ≠ 0**: NULL is not the same as zero
- **NULL ≠ empty string**: NULL is not the same as `''`
- **NULL ≠ NULL**: `NULL = NULL` returns NULL (not true!)
- **Use IS NULL**: To check for NULL, use `IS NULL` or `IS NOT NULL`

### Example: NULL Behavior

```sql
CREATE TABLE test_null (
    id INT,
    value TEXT
);

INSERT INTO test_null VALUES (1, 'text'), (2, NULL), (3, '');

-- Check for NULL
SELECT * FROM test_null WHERE value IS NULL;      -- Returns row 2
SELECT * FROM test_null WHERE value IS NOT NULL;  -- Returns rows 1 and 3
SELECT * FROM test_null WHERE value = '';         -- Returns row 3 only
```

---

## DEFAULT Constraint

### What is it?

The **DEFAULT** constraint assigns a fallback value to a column when no value is provided during an INSERT operation.

### Why use it?

- **Convenience**: Automatically fill common values
- **Data consistency**: Ensure standard values
- **Simplify inserts**: Reduce required fields

### Syntax

```sql
CREATE TABLE table_name(
    column1 type,
    column2 type DEFAULT default_value,
    column3 type,
    ...
);
```

### Example

```sql
CREATE TABLE products(
    id SERIAL PRIMARY KEY, 
    name VARCHAR(255) NOT NULL, 
    price DECIMAL(19,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert without price (uses default)
INSERT INTO products(name) VALUES('Laptop');
-- Price automatically set to 0.00
```

**Output**: The `price` column is automatically set to 0.00 for 'Laptop' because no value was provided.

### Common Default Values

```sql
CREATE TABLE examples (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);
```

---

## Practice Exercises

1. Create a table with PRIMARY KEY, UNIQUE, and NOT NULL constraints
2. Create parent and child tables with FOREIGN KEY
3. Test ON DELETE CASCADE behavior

---

## Solutions

```sql
-- 1. Multiple constraints
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Foreign key
CREATE TABLE departments (
    dept_id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE employees (
    emp_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dept_id INT,
    CONSTRAINT fk_dept 
        FOREIGN KEY(dept_id) 
        REFERENCES departments(dept_id)
        ON DELETE SET NULL
);

-- 3. Test CASCADE
CREATE TABLE employees (
    emp_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    dept_id INT,
    CONSTRAINT fk_dept 
        FOREIGN KEY(dept_id) 
        REFERENCES departments(dept_id)
        ON DELETE CASCADE
);

INSERT INTO departments(name) VALUES('IT');
INSERT INTO employees(name, dept_id) VALUES('John', 1);
DELETE FROM departments WHERE dept_id = 1;  -- John is also deleted
```

---

## Summary

- **PRIMARY KEY**: Uniquely identifies rows (unique, not null, one per table)
- **FOREIGN KEY**: Links tables and maintains referential integrity
- **ON DELETE actions**: RESTRICT (default), SET NULL, CASCADE, SET DEFAULT
- **UNIQUE**: Prevents duplicate values (allows multiple NULLs)
- **NOT NULL**: Requires a value in the column
- **DEFAULT**: Provides fallback value when not specified
- **NULL**: Represents missing/unknown data (use IS NULL to check)
- Constraints enforce **data integrity** and **business rules**
- Always test constraints to ensure they work as expected

**Congratulations! You've completed the PostgreSQL Training Course!** 🎉

---

## Course Completion

You've now mastered:
- ✅ Querying and filtering data
- ✅ Joining multiple tables
- ✅ Grouping and aggregating data
- ✅ Modifying data safely
- ✅ Writing complex subqueries
- ✅ Understanding data types
- ✅ Creating and managing tables
- ✅ Enforcing data integrity with constraints

**You're ready to build real-world database applications!** 🚀
