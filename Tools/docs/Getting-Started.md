# Getting Started with PostgreSQL

## Learning Objectives

By the end of this module, you will be able to:
- Connect to the PostgreSQL database server
- Create a new database
- Load the sample database for practice
- Navigate the PostgreSQL command-line interface
- Use basic psql commands

---

## Connecting to PostgreSQL

Once PostgreSQL is installed, you need to connect to it. The connection method varies slightly by operating system.

### For Windows Users

1. **Open Command Prompt or PowerShell**
2. **Connect to PostgreSQL**:
   ```bash
   psql -U postgres
   ```
3. **Enter your password** when prompted (the one you set during installation)

**What happens**: You'll see a prompt like `postgres=#` which means you're connected!

### For Linux Users

**Method 1: Switch to postgres user** (easiest):
```bash
sudo -u postgres psql
```

**Method 2: Connect directly**:
```bash
psql -U postgres -h localhost
```

**What happens**: You'll see the `postgres=#` prompt, indicating a successful connection.

### For macOS Users

```bash
psql -U postgres
```

Enter your password when prompted.

---

## Setting Up Your Password

If you need to set or change your PostgreSQL password:

1. **Connect to PostgreSQL** (using one of the methods above)
2. **Set password**:
   ```sql
   ALTER USER postgres PASSWORD 'your_new_password';
   ```
3. **Exit**:
   ```sql
   \q
   ```

**Tip**: Choose a strong password and remember it - you'll need it every time you connect!

---

## Basic psql Commands

Once connected, you'll see the `postgres=#` prompt. Here are essential commands you'll use frequently:

| Command | Description | Example |
|---------|-------------|---------|
| `\l` | List all databases | See all databases in your system |
| `\c database_name` | Connect to a specific database | `\c dvdrental` |
| `\dt` | List all tables in current database | See what tables exist |
| `\d table_name` | Describe a table structure | `\d customer` shows columns and types |
| `\q` | Quit psql | Exit the PostgreSQL prompt |
| `\?` | Show help for psql commands | Get list of all commands |
| `\h` | Show help for SQL commands | Get SQL syntax help |

**Tip**: These commands start with backslash (`\`) and don't require a semicolon at the end.

---

## Creating a Database

Before loading sample data, let's create a database to work with:

```sql
CREATE DATABASE dvdrental;
```

**What this does**: Creates a new empty database named "dvdrental" where we'll store our practice data.

**Verify it was created**:
```sql
\l
```

You should see `dvdrental` in the list of databases.

**Why create a separate database?**: It keeps your practice data organized and separate from system databases.

---

## Loading the Sample Database

We'll use the **dvdrental** sample database throughout this course. It contains realistic data about a DVD rental store, including customers, films, rentals, and payments.

### Step 1: Download the Sample Database

**Using curl** (Linux/macOS):
```bash
curl -O https://neon.com/postgresqltutorial/dvdrental.zip
```

**Or download manually**:
- Visit: https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/
- Download the `dvdrental.zip` file to your computer

### Step 2: Extract the Archive

**Linux/macOS**:
```bash
unzip dvdrental.zip
```

**Windows**: Right-click the zip file and select "Extract All"

This creates a `dvdrental.tar` file.

### Step 3: Restore the Database

**Method 1: Using pg_restore** (Recommended)

**Linux/macOS**:
```bash
# Copy file to /tmp
cp dvdrental.tar /tmp/

# Switch to postgres user and restore
sudo -u postgres pg_restore -c -d dvdrental -v "/tmp/dvdrental.tar"
```

**Windows**:
```bash
pg_restore -U postgres -d dvdrental -v "C:\path\to\dvdrental.tar"
```

**Method 2: Using psql** (Alternative)

```bash
psql -U postgres -h localhost -d dvdrental < dvdrental.tar
```

**What this does**: Restores all the tables and data from the sample database into your `dvdrental` database.

### Step 4: Verify the Database

1. **Connect to the dvdrental database**:
   ```sql
   \c dvdrental
   ```

2. **List all tables**:
   ```sql
   \dt
   ```

You should see tables like:
- `actor` - Information about actors
- `customer` - Customer records
- `film` - Movie information
- `payment` - Payment transactions
- `rental` - Rental records
- And many more!

3. **Check a table structure**:
   ```sql
   \d customer
   ```

This shows the columns, data types, and constraints for the customer table.

---

## Troubleshooting

### If the download fails:

1. Check your internet connection
2. Try downloading manually from the website
3. Verify the file was downloaded completely (check file size)

### If restore fails:

1. **Make sure the database exists**:
   ```sql
   CREATE DATABASE dvdrental;
   ```

2. **Check file path** - Ensure the path to `dvdrental.tar` is correct

3. **Check permissions** - On Linux, you may need to use `sudo -u postgres`

4. **Try alternative method** - If `pg_restore` fails, try the `psql` method

### If you can't connect:

1. **Check PostgreSQL is running**:
   - **Windows**: Open Services and check if PostgreSQL service is running
   - **Linux**: `sudo systemctl status postgresql`
   - **macOS**: `brew services list`

2. **Verify connection details**:
   - Default host: `localhost`
   - Default port: `5432`
   - Default user: `postgres`

---

## Exploring the Sample Database

Let's take a quick look at what's in the database:

### View All Tables
```sql
\dt
```

### Count Records in a Table
```sql
SELECT COUNT(*) FROM customer;
```

**What this does**: Counts how many customer records exist in the database.

### See Sample Data
```sql
SELECT * FROM customer LIMIT 5;
```

**What this does**: Shows the first 5 rows from the customer table so you can see what the data looks like.

### Get Table Information
```sql
\d film
```

**What this shows**:
- Column names (like `film_id`, `title`, `release_year`)
- Data types (like `INTEGER`, `VARCHAR`, `DATE`)
- Constraints (like PRIMARY KEY, NOT NULL)

---

## Practice Exercises

### Exercise 1: Database Connection
1. Connect to PostgreSQL
2. List all databases using `\l`
3. Connect to the `dvdrental` database using `\c dvdrental`
4. List all tables using `\dt`

### Exercise 2: Explore Tables
1. Use `\d` to examine the structure of the `film` table
2. Use `\d` to examine the structure of the `actor` table
3. Compare the columns in both tables

### Exercise 3: Quick Data Check
1. Count how many customers are in the database
2. Count how many films are in the database
3. View the first 3 rows from the `actor` table

---

## Solutions

### Solution 1: Database Connection
```sql
-- Connect to PostgreSQL (from command line)
psql -U postgres

-- List databases
\l

-- Connect to dvdrental
\c dvdrental

-- List tables
\dt
```

### Solution 2: Explore Tables
```sql
-- Examine film table structure
\d film

-- Examine actor table structure
\d actor
```

**What you'll see**: Column names, data types, and which columns are primary keys or have constraints.

### Solution 3: Quick Data Check
```sql
-- Count customers
SELECT COUNT(*) FROM customer;

-- Count films
SELECT COUNT(*) FROM film;

-- View first 3 actors
SELECT * FROM actor LIMIT 3;
```

---

## Summary

- Use `psql -U postgres` (or `sudo -u postgres psql` on Linux) to connect to PostgreSQL
- Use `\l` to list databases and `\c database_name` to connect to one
- Use `\dt` to list tables and `\d table_name` to see table structure
- The dvdrental sample database provides realistic data for practice
- Use `\q` to quit psql
- Basic commands like `\l`, `\dt`, `\d` help you navigate and explore your database

**Next Module**: [Querying-Data.md](Querying-Data.md) - Learn to retrieve data with SELECT statements

---

**You're all set up and ready to start querying!** 🚀
