# PostgreSQL Data Types

## Learning Objectives

By the end of this module, you will be able to:
- Understand different data types in PostgreSQL
- Choose the right data type for your data
- Work with Boolean, Character, Numeric, and Temporal types
- Use Arrays, JSON, and UUID data types
- Understand when to use each type

---

## Introduction to Data Types

Data types define what kind of data can be stored in a column. Choosing the right data type is important for:
- **Data integrity** - Ensures correct data is stored
- **Storage efficiency** - Saves space
- **Performance** - Faster queries and operations
- **Functionality** - Enables appropriate operations

**Think of it like this**: Just like you use different containers for different things (water bottle for water, lunch box for food), you use different data types for different kinds of data.

---

## Boolean Type

### What is it?

The `BOOLEAN` (or `BOOL`) type stores one of three values: `true`, `false`, or `NULL`.

### Why use it?

- Store yes/no, on/off, active/inactive values
- Simple true/false conditions
- Flags and status indicators

### Accepted Values

PostgreSQL converts various inputs into boolean values:

**True values**: `TRUE`, `true`, `'t'`, `'yes'`, `'y'`, `'1'`, `1`

**False values**: `FALSE`, `false`, `'f'`, `'no'`, `'n'`, `'0'`, `0`

### Example

```sql
CREATE TABLE stock_availability (
    product_id INT PRIMARY KEY, 
    available BOOLEAN NOT NULL
);

INSERT INTO stock_availability (product_id, available) 
VALUES
    (100, TRUE),
    (200, FALSE),
    (300, 'yes'),
    (400, 'no');

-- Query available products
SELECT * FROM stock_availability WHERE available = 'yes';
```

**Output**: Returns products with available = true (using any of the true formats).

---

## Character Types

PostgreSQL offers three ways to store text, depending on your length requirements.

### CHAR(n) - Fixed Length

- **Fixed-length**: Always stores exactly `n` characters
- **Padding**: If text is shorter, PostgreSQL pads with spaces
- **Error**: If text is longer, throws an error
- **Use when**: You need exact length (rarely used)

### VARCHAR(n) - Variable Length

- **Variable-length**: Stores up to `n` characters
- **No padding**: Doesn't add spaces
- **Most common**: Standard choice for names, emails, etc.
- **Use when**: You know the maximum length

### TEXT - Unlimited Length

- **Unlimited**: No length limit
- **Flexible**: Can store any amount of text
- **Performant**: In PostgreSQL, TEXT is as fast as VARCHAR
- **Popular default**: Many developers use TEXT for variable text
- **Use when**: Length is unknown or variable

### Example

```sql
CREATE TABLE character_test (
    id SERIAL PRIMARY KEY, 
    x CHAR(1),      -- Exactly 1 character
    y VARCHAR(10),  -- Up to 10 characters
    z TEXT          -- Unlimited
);

INSERT INTO character_test (x, y, z) 
VALUES ('A', 'Short', 'This can be very long text...');
```

### Choosing Character Types

| Type | When to Use |
|------|-------------|
| `CHAR(n)` | Rarely - only when exact length is required |
| `VARCHAR(n)` | When you know the maximum length |
| `TEXT` | Default choice for most text fields |

---

## Numeric Types

PostgreSQL divides numbers into two categories: **Integers** (whole numbers) and **Floating-Point** (decimal numbers).

### Integer Types

#### SMALLINT
- **Size**: 2 bytes
- **Range**: -32,768 to 32,767
- **Use when**: Values are guaranteed to stay small (saves space)

#### INT or INTEGER
- **Size**: 4 bytes
- **Range**: -2,147,483,648 to 2,147,483,647 (~2.1 billion)
- **Most common**: Standard choice for whole numbers
- **Use when**: You need whole numbers (IDs, counts, ages)

#### SERIAL
- **Special type**: Auto-incrementing integer
- **Automatically generates**: Unique numbers for each row
- **Perfect for**: Primary key columns
- **Equivalent to**: AUTO_INCREMENT in other databases

### Floating-Point Types

#### NUMERIC(p, s) or DECIMAL(p, s)
- **Exact precision**: No rounding errors
- **Precision (p)**: Total number of digits
- **Scale (s)**: Number of digits after decimal
- **Example**: `NUMERIC(10, 2)` stores up to 10 digits with 2 decimals (e.g., 99999999.99)
- **Use when**: Financial data, exact calculations

#### REAL / FLOAT8
- **Inexact**: May have tiny rounding discrepancies
- **Faster**: Better for scientific calculations
- **Use when**: Approximate values are acceptable (scientific data)

### Example: Numeric Types

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,           -- Auto-incrementing integer
    price NUMERIC(10, 2),            -- Exact: 99999999.99
    quantity INT,                     -- Whole number
    weight REAL                       -- Approximate decimal
);

INSERT INTO products (price, quantity, weight) 
VALUES (19.99, 100, 2.5);
```

---

## Temporal Data Types

These types manage dates, times, and durations.

### DATE
- **Stores**: Calendar date only (Year, Month, Day)
- **Format**: `YYYY-MM-DD`
- **Example**: `2024-01-15`
- **Use when**: You only need the date

### TIME
- **Stores**: Time of day only (Hours, Minutes, Seconds)
- **Format**: `HH:MM:SS`
- **Example**: `14:30:00`
- **Use when**: You only need the time

### TIMESTAMP
- **Stores**: Both date and time
- **Format**: `YYYY-MM-DD HH:MM:SS`
- **Example**: `2000-01-02 14:30:00`
- **No timezone**: Stores as-is
- **Use when**: Local timestamps without timezone concerns

### TIMESTAMPTZ (Timestamp with Time Zone)
- **Stores**: Date and time with timezone information
- **Best practice**: For global applications
- **Automatic conversion**: Adjusts based on user's timezone
- **Use when**: Working with users across timezones

### Example: Temporal Types

```sql
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    event_date DATE,
    event_timestamp TIMESTAMP,
    event_timestamptz TIMESTAMPTZ
);

INSERT INTO events (event_date, event_timestamp, event_timestamptz) 
VALUES
    (CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
```

### INTERVAL
- **Stores**: A period of time or duration
- **Examples**: `'1 day'`, `'2 hours'`, `'3 weeks 2 days'`
- **Use when**: Storing durations or calculating future dates

```sql
SELECT CURRENT_DATE + INTERVAL '1 day' AS tomorrow;
```

---

## Arrays

### What is it?

PostgreSQL allows you to store a list of values (strings, integers, etc.) within a single column.

### Why use it?

- Store multiple related values in one column
- Avoid creating separate tables for small collections
- Useful for tags, categories, phone numbers, etc.

### Syntax

```sql
column_name datatype[]
```

### Example

```sql
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(100), 
    phones TEXT[]  -- Array of text
);

INSERT INTO contacts (name, phones) 
VALUES 
    ('John Doe', ARRAY['555-1234', '555-5678']),
    ('Jane Smith', ARRAY['555-9999']);

-- Query array elements
SELECT name, phones[1] AS primary_phone FROM contacts;
SELECT name FROM contacts WHERE '555-1234' = ANY(phones);
```

**Output**: Stores multiple phone numbers per contact.

---

## JSON Data Types

PostgreSQL allows you to store JSON data directly, giving you NoSQL flexibility with relational power.

### JSON
- **Stores**: Exact copy of input text
- **Pros**: Faster inserts (no processing)
- **Cons**: Slower queries (must re-parse), preserves whitespace
- **Use when**: You rarely query the JSON content

### JSONB (JSON Binary)
- **Stores**: Decomposed binary format
- **Pros**: Faster queries, supports indexing, removes whitespace
- **Cons**: Slightly slower inserts (conversion to binary)
- **Use when**: You frequently query JSON content (recommended)

### Example: JSONB

```sql
CREATE TABLE products(
    id SERIAL PRIMARY KEY, 
    name VARCHAR(255) NOT NULL, 
    properties JSONB
);

INSERT INTO products(name, properties) 
VALUES
    ('T-Shirt', '{"color": "white", "size": ["S","M","L","XL"]}'),
    ('Laptop', '{"brand": "Dell", "ram": "16GB"}');

-- Query JSON data
SELECT id, name, properties FROM products;

-- Extract JSON field (-> returns JSON, ->> returns TEXT)
SELECT id, name, 
       properties -> 'color' AS color_json,      -- Returns JSON: "white"
       properties ->> 'color' AS color_text     -- Returns TEXT: white
FROM products;
```

**Difference**: `->` returns JSON format (with quotes), `->>` returns text (without quotes).

---

## UUID

### What is it?

UUID (Universally Unique Identifier) stores 128-bit identifiers guaranteed to be unique across different systems and databases.

### Why use it?

- **Globally unique**: No collisions across systems
- **Distributed systems**: Perfect for microservices
- **Security**: Harder to guess than sequential IDs
- **Unlike SERIAL**: Not just counting up (1, 2, 3...)

### Format

Example: `550e8400-e29b-41d4-a716-446655440000`

### Generate UUID

```sql
SELECT gen_random_uuid();
```

### Example

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL
);

INSERT INTO users (username) VALUES ('john_doe');
-- ID is automatically generated
```

---

## Practice Exercises

1. Create a table with BOOLEAN, VARCHAR, and NUMERIC types
2. Create a table with DATE and TIMESTAMPTZ
3. Create a table with JSONB and query a JSON field

---

## Solutions

```sql
-- 1. Mixed types
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    available BOOLEAN DEFAULT TRUE,
    price NUMERIC(10, 2)
);

-- 2. Temporal types
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    order_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. JSONB
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    details JSONB
);
INSERT INTO items VALUES 
    ('Laptop', '{"brand": "Dell", "ram": "16GB"}');
SELECT name, details ->> 'brand' AS brand FROM items;
```

---

## Summary

- **Boolean**: Store true/false values (accepts many formats)
- **CHAR(n)**: Fixed-length text (rarely used)
- **VARCHAR(n)**: Variable-length text with max length
- **TEXT**: Unlimited text (popular default)
- **INT/SERIAL**: Whole numbers (SERIAL auto-increments)
- **NUMERIC/DECIMAL**: Exact decimal numbers (for money)
- **REAL/FLOAT**: Approximate decimals (for scientific data)
- **DATE**: Date only
- **TIMESTAMP**: Date and time (no timezone)
- **TIMESTAMPTZ**: Date and time with timezone (recommended)
- **INTERVAL**: Duration or period of time
- **Arrays**: Store lists of values in one column
- **JSON**: Store exact JSON text
- **JSONB**: Store JSON in binary format (recommended, supports indexing)
- **UUID**: Globally unique identifiers

**Next Module**: [10-Managing-Tables.md](10-Managing-Tables.md) - Learn to create and manage tables

---

**Excellent! You now understand PostgreSQL data types!** 🎉
