# Complete Git Guide: From Basic to Advanced

A comprehensive, production-ready guide to Git covering fundamental concepts to advanced techniques with practical examples, best practices, and common pitfalls for full-stack developers.

***

## Table of Contents

1. [Getting Started with GitHub](#getting-started-with-github)
2. [Git Fundamentals](#git-fundamentals)
3. [Basic Git Operations](#basic-git-operations)
4. [Branching and Merging](#branching-and-merging)
5. [Advanced Branching Strategies](#advanced-branching-strategies)
6. [Git Stash](#git-stash)
7. [Rewriting History](#rewriting-history)
8. [Reset vs Revert](#reset-vs-revert)
9. [Remote Operations](#remote-operations)
10. [Advanced Git Techniques](#advanced-git-techniques)
11. [Git Workflows](#git-workflows)
12. [GitHub Essentials](#github-essentials)
13. [Troubleshooting and Recovery](#troubleshooting-and-recovery)

***

## Getting Started with GitHub

Before diving into Git commands, you need to set up a GitHub account and configure authentication to push code to remote repositories.

### Creating a GitHub Account

1. **Go to GitHub**: Visit [https://github.com](https://github.com)

2. **Sign Up**: Click the "Sign up" button in the top right corner

3. **Enter your details**:
   - Enter your email address
   - Create a strong password
   - Choose a username (this will be visible in your profile URL and commits)
   - Complete the verification puzzle

4. **Verify your email**: Check your inbox and click the verification link sent by GitHub

5. **Complete profile setup** (optional but recommended):
   - Add a profile picture
   - Add your bio and location
   - Set up two-factor authentication (2FA) for security

### Generating a Personal Access Token (PAT)

GitHub no longer accepts account passwords for Git operations over HTTPS. You need to use a Personal Access Token instead.

**Why do you need a token?**
- Required for Git operations (push, pull, clone private repos) over HTTPS
- More secure than passwords
- Can have limited permissions (scopes)
- Can be revoked without changing your password

**Steps to generate a Personal Access Token**:

1. **Log in to GitHub** and go to Settings:
   - Click your profile picture in the top right
   - Click "Settings"

2. **Navigate to Developer Settings**:
   - Scroll down in the left sidebar
   - Click "Developer settings" (at the bottom)

3. **Access Personal Access Tokens**:
   - Click "Personal access tokens"
   - Choose "Tokens (classic)" for general use

4. **Generate new token**:
   - Click "Generate new token"
   - Select "Generate new token (classic)"

5. **Configure your token**:
   - **Note**: Give it a descriptive name (e.g., "My Laptop Git Access")
   - **Expiration**: Choose an expiration period (90 days recommended for security)
   - **Select scopes**: Check the permissions you need:
     - `repo` - Full control of private repositories (required for most operations)
     - `workflow` - Update GitHub Actions workflows
     - `read:org` - Read organization membership (if working with orgs)

6. **Generate and copy**:
   - Click "Generate token"
   - **IMPORTANT**: Copy the token immediately! You won't be able to see it again.

**Using your token**:

When Git prompts for a password during HTTPS operations, use your token instead:

```bash
# When cloning a private repository
git clone https://github.com/username/private-repo.git
# Username: your-username
# Password: paste-your-token-here (NOT your GitHub password)
```

**Store credentials to avoid repeated prompts**:

```bash
# Cache credentials for 1 hour (3600 seconds)
git config --global credential.helper 'cache --timeout=3600'

# Or store permanently (less secure, stored in plain text)
git config --global credential.helper store
```

**Using credential manager (recommended)**:

```bash
# On Windows (Git Credential Manager)
git config --global credential.helper manager

# On macOS (Keychain)
git config --global credential.helper osxkeychain

# On Linux (libsecret)
git config --global credential.helper libsecret
```

**Token best practices**:

- Never share your token or commit it to repositories
- Use the minimum required scopes
- Set an expiration date
- Regenerate tokens periodically
- Use different tokens for different machines/purposes
- Delete tokens you no longer use

**If your token is compromised**:

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Find the compromised token and click "Delete"
3. Generate a new token immediately
4. Update the token on all machines where it was used

***

## Git Fundamentals

### What is Git?

Git is a distributed version control system that tracks changes in source code during software development. Unlike centralized systems, every developer has a complete copy of the repository history on their local machine.

### Core Concepts

**Repository (Repo)**: A directory containing your project files and the entire version history stored in the `.git` folder.

**Commit**: A snapshot of your project at a specific point in time, identified by a unique SHA-1 hash.

**Branch**: A parallel line of development that allows you to work on features independently.

**Remote**: A version of your repository hosted on a server (like GitHub, GitLab, or Bitbucket).

### Git's Three States

Files in Git exist in three states:


| State | Description | Location |
| :-- | :-- | :-- |
| **Modified** | Changed but not committed | Working directory |
| **Staged** | Marked for next commit | Staging area (index) |
| **Committed** | Safely stored in database | Local repository (.git) |

### Installation and Configuration

**Check Git version**:

```bash
git --version
```

**Configure user information** (do this once after installation):

```bash
# Global configuration (applies to all repos)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Set default editor
git config --global core.editor "code --wait"  # VS Code
```

**View configuration**:

```bash
# List all settings
git config --list

#List all Global settings
git config --global --list

# Check specific setting
git config user.name
git config user.email
```

**Configuration levels**:

```bash
# System-wide (all users)
git config --system

# User-level (your account)
git config --global

# Repository-level (current repo only)
git config --local
```

✅ **Best Practice**: Always configure your name and email before making commits to maintain proper authorship.

❌ **Common Mistake**: Using generic email addresses or forgetting to configure credentials, leading to commits with wrong authorship.

***

## Basic Git Operations

### Initializing a Repository

**Create a new repository**:

```bash
# Create new folder and initialize
mkdir my-project
cd my-project
git init
```

**Clone existing repository**:

```bash
# Clone from GitHub
git clone https://github.com/username/repository.git

# Clone with custom folder name
git clone https://github.com/username/repository.git my-folder

# Clone specific branch
git clone -b branch-name https://github.com/username/repository.git
```


### The .gitignore File

Create a `.gitignore` file to exclude files from version control:

**Django/Python project example**:

```gitignore
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.venv/

# Django
*.log
db.sqlite3
media/
staticfiles/
local_settings.py

# Environment variables
.env
.env.local
secrets.json

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

**React/Node.js project example**:

```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
build/
dist/
.next/
out/

# Environment
.env
.env.local
.env.production

# IDE
.vscode/
.idea/

# Testing
coverage/
.nyc_output/
```

✅ **Best Practice**: Create `.gitignore` before your first commit to avoid accidentally tracking sensitive files.

### Checking Status

```bash
# See current status
git status

# Short format
git status -s
```

**Status output explained**:

```
On branch main
Changes to be committed:       # Staged files
  (use "git restore --staged <file>..." to unstage)
        modified:   app.py

Changes not staged for commit:  # Modified but not staged
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes)
        modified:   README.md

Untracked files:                # New files not tracked
  (use "git add <file>..." to include in what will be committed)
        config.py
```


### Staging Changes

**Stage specific files**:

```bash
# Stage single file
git add app.py

# Stage multiple files
git add app.py models.py views.py

# Stage all Python files
git add *.py

# Stage all files in directory
git add src/
```

**Stage all changes**:

```bash
# Stage all modified and new files
git add .

# Stage all including deletions
git add -A
# or
git add --all

# Stage only modified and deleted (not new files)
git add -u
```

**Interactive staging**:

```bash
# Choose what to stage interactively
git add -i

# Stage parts of files (patch mode)
git add -p
```

✅ **Best Practice**: Stage related changes together for logical commits.

❌ **Common Mistake**: Using `git add .` without reviewing changes, potentially staging unwanted files.

### Unstaging Files

```bash
# Unstage specific file
git restore --staged app.py

# Unstage all files
git restore --staged .

# Old syntax (still works)
git reset HEAD app.py
```


### Committing Changes

**Basic commit**:

```bash
# Commit staged changes
git commit -m "feat(auth): add JWT authentication"

# Commit with detailed message (opens editor)
git commit
```

**Commit shortcuts**:

```bash
# Stage all modified files and commit
git commit -am "fix: correct CORS configuration"

# Amend previous commit
git commit --amend

# Amend without changing message
git commit --amend --no-edit
```

**Commit message template** (Conventional Commits):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Commit Types** (prefix your commit messages with these):

| Type | Description | Example |
| :-- | :-- | :-- |
| `feat` | New feature or functionality | `feat(auth): add JWT authentication` |
| `fix` | Bug fix | `fix(api): resolve null pointer in user endpoint` |
| `docs` | Documentation changes only | `docs(readme): update installation instructions` |
| `style` | Code style changes (formatting, whitespace, etc.) | `style(css): fix indentation in main.css` |
| `refactor` | Code changes that neither fix bugs nor add features | `refactor(utils): simplify date parsing logic` |
| `perf` | Performance improvements | `perf(db): optimize user query with indexing` |
| `test` | Adding or updating tests | `test(auth): add unit tests for login` |
| `build` | Changes to build system or dependencies | `build(npm): upgrade React to v18` |
| `ci` | Changes to CI/CD configuration | `ci(github): add automated testing workflow` |
| `chore` | Maintenance tasks (no production code change) | `chore(deps): update package-lock.json` |
| `revert` | Reverting a previous commit | `revert: feat(auth): add JWT authentication` |

**Breaking Changes**: Add `!` after type or include `BREAKING CHANGE:` in footer

```bash
# Breaking change indicator
feat(api)!: change authentication endpoint structure

# Or in footer
feat(api): change authentication endpoint structure

BREAKING CHANGE: Authentication now requires Bearer token header
```

✅ **Best Practice**: Commit frequently with clear, descriptive messages. Each commit should represent one logical change.

❌ **Common Mistake**: Making huge commits with multiple unrelated changes or using vague messages like "fixed stuff".

### Viewing History

**Basic log**:

```bash
# Full commit history
git log

# One line per commit
git log --oneline

# Last n commits
git log -n 5
git log -5  # shorthand
```

**Formatted logs**:

```bash
# Graph view
git log --graph --oneline --all

# Custom format
git log --pretty=format:"%h - %an, %ar : %s"

# Show file changes
git log --stat

# Show actual changes
git log -p
```

**Filter logs**:

```bash
# By author
git log --author="John"

# By date
git log --since="2 weeks ago"
git log --after="2026-01-01"
git log --until="2026-01-31"

# By file
git log -- app.py

# By commit message
git log --grep="authentication"
```

**Useful log aliases** (add to `.gitconfig`):

```bash
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```


### Viewing Changes

**See uncommitted changes**:

```bash
# Show unstaged changes
git diff

# Show staged changes
git diff --staged
# or
git diff --cached

# Compare specific file
git diff app.py
```

**Compare commits**:

```bash
# Compare two commits
git diff commit1 commit2

# Compare branches
git diff main feature-branch

# Compare with previous commit
git diff HEAD~1
git diff HEAD~2  # Two commits ago
```

**Show commit details**:

```bash
# Show specific commit
git show abc1234

# Show latest commit
git show HEAD
```

✅ **Best Practice**: Always review changes with `git diff` before staging.

### Discarding Changes

**Discard unstaged changes**:

```bash
# Discard changes in specific file
git restore app.py

# Discard all unstaged changes
git restore .

# Old syntax (still works)
git checkout -- app.py
```

**Remove untracked files**:

```bash
# Show what would be deleted (dry run)
git clean -n

# Delete untracked files
git clean -f

# Delete untracked files and directories
git clean -fd

# Delete including ignored files
git clean -fdx
```

⚠️ **Warning**: `git clean` permanently deletes files. Use `-n` first to preview.

❌ **Common Mistake**: Accidentally discarding hours of work by running `git restore .` without checking `git status` first.

***

## Branching and Merging

### Understanding Branches

Branches are lightweight pointers to commits that allow parallel development. The default branch is typically called `main` or `master`.

### Branch Operations

**List branches**:

```bash
# List local branches
git branch

# List all branches (including remote)
git branch -a

# List remote branches only
git branch -r

# List with last commit
git branch -v
```

**Create branches**:

```bash
# Create new branch
git branch feature-login

# Create and switch to branch
git checkout -b feature-login
# or (newer syntax)
git switch -c feature-login

# Create branch from specific commit
git branch feature-login abc1234
```

**Switch branches**:

```bash
# Switch to existing branch
git checkout feature-login
# or (newer syntax)
git switch feature-login

# Switch to previous branch
git checkout -
git switch -
```

**Rename branches**:

```bash
# Rename current branch
git branch -m new-name

# Rename other branch
git branch -m old-name new-name
```

**Delete branches**:

```bash
# Delete merged branch
git branch -d feature-login

# Force delete unmerged branch
git branch -D feature-login

# Delete remote branch
git push origin --delete feature-login
```

✅ **Best Practice**: Use descriptive branch names with prefixes like `feature/`, `bugfix/`, `hotfix/`.

### Merging Branches

**Fast-forward merge** (no divergence):

```bash
git checkout main
git merge feature-login
```

Before merge:

```
main:    A -- B -- C
                    \
feature:             D -- E
```

After fast-forward merge:

```
main:    A -- B -- C -- D -- E
```

**Three-way merge** (with divergence):

```bash
git checkout main
git merge feature-login
```

Before merge:

```
main:    A -- B -- C -- F
                    \
feature:             D -- E
```

After three-way merge:

```
main:    A -- B -- C -- F -- M
                    \       /
feature:             D -- E
```

**Merge options**:

```bash
# Create merge commit even if fast-forward possible
git merge --no-ff feature-login

# Squash all commits into one
git merge --squash feature-login

# Abort merge in progress
git merge --abort
```

✅ **Best Practice**: Use `--no-ff` for feature branches to maintain clear history.

### Handling Merge Conflicts

Conflicts occur when the same lines are modified in different branches.

**Example conflict**:

```python
def authenticate(username, password):
    return jwt_auth(username, password)
```

**Resolution steps**:

```bash
# 1. Git shows conflict
git merge feature-auth
# Auto-merging app.py
# CONFLICT (content): Merge conflict in app.py

# 2. Check conflicted files
git status

# 3. Open file and resolve
# Remove conflict markers and choose correct code

# 4. Stage resolved files
git add app.py

# 5. Complete merge
git commit -m "Merge feature-auth into main"
```

**Conflict resolution tools**:

```bash
# Use merge tool
git mergetool

# Keep their version
git checkout --theirs app.py

# Keep our version
git checkout --ours app.py
```

✅ **Best Practice**: Resolve conflicts immediately and test thoroughly before committing.

❌ **Common Mistake**: Committing without testing after resolving conflicts, potentially breaking the application.

***

## Advanced Branching Strategies

### Git Flow

A branching model for larger projects with scheduled releases:

**Branch types**:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `release/*` - Release preparation
- `hotfix/*` - Critical production fixes

**Git Flow workflow**:

```bash
# Start feature
git checkout -b feature/user-profile develop
# Work on feature
git commit -am "Add user profile page"

# Finish feature
git checkout develop
git merge --no-ff feature/user-profile
git branch -d feature/user-profile

# Start release
git checkout -b release/1.2.0 develop
# Fix bugs, update version
git commit -am "Bump version to 1.2.0"

# Finish release
git checkout main
git merge --no-ff release/1.2.0
git tag -a v1.2.0 -m "Release 1.2.0"
git checkout develop
git merge --no-ff release/1.2.0
git branch -d release/1.2.0

# Hotfix
git checkout -b hotfix/security-patch main
git commit -am "Fix security vulnerability"
git checkout main
git merge --no-ff hotfix/security-patch
git tag -a v1.2.1 -m "Hotfix 1.2.1"
git checkout develop
git merge --no-ff hotfix/security-patch
git branch -d hotfix/security-patch
```

✅ **Best For**: Large teams with scheduled releases.

❌ **Avoid If**: Practicing continuous deployment - use simpler workflows instead.

### GitHub Flow

Simpler workflow for continuous deployment:

1. Create feature branch from `main`
2. Add commits
3. Open pull request
4. Discuss and review
5. Deploy and test
6. Merge to `main`
```bash
# 1. Create branch
git checkout -b feature/api-endpoint

# 2. Make changes and commit
git commit -am "Add product search API"

# 3. Push and create PR
git push origin feature/api-endpoint
# Create PR on GitHub

# 4. After review and approval, merge on GitHub

# 5. Update local main
git checkout main
git pull origin main

# 6. Delete feature branch
git branch -d feature/api-endpoint
```

✅ **Best For**: Small to medium teams with continuous deployment.

### Trunk-Based Development

Short-lived branches with frequent integration:

**Key principles**:

- Branches live less than 24-48 hours
- Commit directly to `main` or use very short feature branches
- Use feature flags for incomplete features
- Continuous integration and testing

```bash
# Short-lived feature branch
git checkout -b feature/quick-fix
git commit -am "Add validation check"
git push origin feature/quick-fix
# Create and merge PR same day
```

✅ **Best For**: Experienced teams practicing CI/CD.

❌ **Avoid If**: Team is new to Git or lacks robust automated testing.

***

## Git Stash

### What is Stash?

Stash temporarily saves uncommitted changes so you can switch contexts without committing.

### Basic Stash Operations

**Save changes**:

```bash
# Stash tracked files
git stash

# Stash with descriptive message
git stash push -m "WIP: homepage redesign"

# Stash including untracked files
git stash -u
# or
git stash --include-untracked

# Stash including ignored files
git stash -a
# or
git stash --all
```

**List stashes**:

```bash
git stash list
# stash@{0}: WIP on main: abc1234 Add feature
# stash@{1}: On feature-auth: WIP: authentication work
```

**Apply stashed changes**:

```bash
# Apply latest stash and keep it
git stash apply

# Apply specific stash
git stash apply stash@{1}

# Apply latest stash and remove it
git stash pop

# Apply specific stash and remove it
git stash pop stash@{1}
```

**View stash contents**:

```bash
# Show latest stash
git stash show

# Show with diff
git stash show -p

# Show specific stash
git stash show stash@{1}
```

**Delete stashes**:

```bash
# Drop latest stash
git stash drop

# Drop specific stash
git stash drop stash@{1}

# Clear all stashes
git stash clear
```


### Advanced Stash Usage

**Partial stashing**:

```bash
# Stash only specific files
git stash push -m "Stash models only" app/models.py

# Interactive stash (choose hunks)
git stash -p
```

**Create branch from stash**:

```bash
# Create branch with stashed changes
git stash branch feature-new-work stash@{0}
```


### Real-World Stash Examples

**Example 1: Emergency hotfix**

```bash
# Working on feature
git status
# Changes to: app.py, models.py

# Emergency: need to fix production bug
git stash push -m "WIP: feature work"
git checkout main
git checkout -b hotfix/critical-bug

# Fix bug
git commit -am "hotfix: fix critical login issue"
git checkout main
git merge hotfix/critical-bug
git push origin main

# Return to feature work
git checkout feature-branch
git stash pop
```

**Example 2: Update dependencies**

```bash
# Working on features
git stash -u

# Pull latest changes
git pull origin main

# Apply stashed work
git stash pop
```

**Example 3: Experiment with changes**

```bash
# Stash current work
git stash

# Try experimental approach
# ... make changes ...

# Not working, restore stashed version
git reset --hard
git stash pop
```


### Stash Best Practices

✅ **Best Practices**:

- Use descriptive messages with `git stash push -m`
- Clean up old stashes regularly
- Use stash for temporary work, not long-term storage
- Consider committing to a temporary branch for longer interruptions

❌ **Common Mistakes**:

- Forgetting about stashed changes
- Stashing on wrong branch
- Accumulating too many stashes without descriptive names


### Stash vs Commit

| Aspect | Stash | Commit |
| :-- | :-- | :-- |
| Purpose | Temporary storage | Permanent history |
| Visibility | Local only | Shared via push |
| Message | Optional | Required |
| Best for | Switching contexts | Completing work  |


***

## Rewriting History

### Interactive Rebase

Rebase rewrites commit history by replaying commits on a new base.

**Basic rebase**:

```bash
# Rebase current branch onto main
git checkout feature-branch
git rebase main
```

Before rebase:

```
main:    A -- B -- C -- D
                  \
feature:           E -- F
```

After rebase:

```
main:    A -- B -- C -- D
                         \
feature:                  E' -- F'
```

**Interactive rebase**:

```bash
# Rebase last 3 commits
git rebase -i HEAD~3

# Rebase from specific commit
git rebase -i abc1234
```

**Interactive rebase commands**:

```
pick abc1234 Add user authentication
reword def5678 Fix validation bug
edit ghi9012 Update database schema
squash jkl3456 Fix typo
fixup mno7890 Remove debug code
drop pqr1234 Experimental change
```

Commands explained:

- `pick` - Use commit as-is
- `reword` - Use commit but edit message
- `edit` - Stop for amending
- `squash` - Combine with previous commit, edit message
- `fixup` - Combine with previous commit, discard message
- `drop` - Remove commit


### Squashing Commits

**Squash during rebase**:

```bash
git rebase -i HEAD~3
# Change 'pick' to 'squash' or 's' for commits to combine
```

**Squash merge**:

```bash
# Squash entire branch into single commit
git checkout main
git merge --squash feature-branch
git commit -m "feat: add complete user authentication system"
```

**Example: Clean up feature branch**

```bash
# Before: messy commits
abc1234 Add login form
def5678 Fix typo
ghi9012 Add validation
jkl3456 Fix bug
mno7890 Update styles

# Interactive rebase
git rebase -i HEAD~5

# In editor, squash all into first:
pick abc1234 Add login form
squash def5678 Fix typo
squash ghi9012 Add validation
squash jkl3456 Fix bug
squash mno7890 Update styles

# Result: single clean commit
abc1234 feat(auth): add login form with validation
```

✅ **Best Practice**: Squash messy commits before merging to maintain clean history.

### Amending Commits

**Change last commit**:

```bash
# Add forgotten file to last commit
git add forgotten-file.py
git commit --amend --no-edit

# Change last commit message
git commit --amend -m "feat(auth): add JWT authentication with refresh"

# Edit last commit in editor
git commit --amend
```

⚠️ **Warning**: Never amend pushed commits - it rewrites history.

### Rebase vs Merge

| Aspect | Rebase | Merge |
| :-- | :-- | :-- |
| History | Linear, clean | Shows actual history |
| Commits | Rewritten (new SHA) | Preserved |
| Conflicts | Resolved per commit | Resolved once |
| Use on | Feature branches | Public branches  |

✅ **When to Rebase**:

- Cleaning up local feature branches
- Before creating pull request
- Updating feature branch with latest main

❌ **Never Rebase**:

- Public/shared branches
- Commits others are building on
- Main or develop branches


### Handling Rebase Conflicts

```bash
# Start rebase
git rebase main
# CONFLICT in app.py

# Fix conflict in file
# Edit app.py

# Stage resolved file
git add app.py

# Continue rebase
git rebase --continue

# Or skip commit
git rebase --skip

# Or abort
git rebase --abort
```


### Pull with Rebase

```bash
# Pull and rebase instead of merge
git pull --rebase origin main

# Set as default
git config --global pull.rebase true
```

✅ **Best Practice**: Use `pull --rebase` to maintain linear history on feature branches.

***


## Reset vs Revert

### Understanding the Difference

Both undo changes but in fundamentally different ways.


| Aspect | Reset | Revert |
| :-- | :-- | :-- |
| Method | Moves branch pointer backward | Creates new "undo" commit |
| History | Rewrites (deletes commits) | Preserves (adds commit) |
| Safety | Dangerous on shared branches | Safe for shared branches  |
| Use on | Local/private branches | Public/shared branches  |

### Git Reset

Moves the branch pointer to a previous commit, potentially discarding commits.

**Reset modes**:

**1. Soft reset** (--soft):

```bash
# Move HEAD, keep changes staged
git reset --soft HEAD~1
```

- Moves branch pointer
- Keeps changes in staging area
- Working directory unchanged

**Use case**: Recommit with better message or combine commits

```bash
# Undo last commit, keep changes staged
git reset --soft HEAD~1
git commit -m "Better commit message"
```

**2. Mixed reset** (default):

```bash
# Move HEAD, unstage changes
git reset HEAD~1
# or
git reset --mixed HEAD~1
```

- Moves branch pointer
- Removes changes from staging
- Keeps changes in working directory

**Use case**: Redo staging decisions

```bash
# Undo last commit and restage selectively
git reset HEAD~1
git add app.py  # Stage only what you want
git commit -m "Refined commit"
```

**3. Hard reset** (--hard):

```bash
# Move HEAD, discard all changes
git reset --hard HEAD~1
```

- Moves branch pointer
- Removes changes from staging
- Deletes changes from working directory

**Use case**: Completely discard commits

```bash
# Completely remove last 3 commits
git reset --hard HEAD~3
```

⚠️ **Warning**: `--hard` permanently deletes uncommitted changes. Cannot be recovered easily.

### Git Revert

Creates a new commit that undoes changes from previous commit(s).

**Revert single commit**:

```bash
# Undo specific commit
git revert abc1234
```

Before revert:

```
A -- B -- C -- D
         (bad)
```

After revert:

```
A -- B -- C -- D -- D'
         (bad)   (undo C)
```

**Revert multiple commits**:

```bash
# Revert range
git revert abc1234..def5678

# Revert multiple specific commits
git revert abc1234 def5678 ghi9012
```

**Revert without auto-commit**:

```bash
# Revert but don't commit yet
git revert --no-commit abc1234

# Make additional changes
# Then commit manually
git commit -m "Revert feature X due to bugs"
```

**Revert merge commit**:

```bash
# Revert merge, keeping first parent
git revert -m 1 merge-commit-sha
```


### Real-World Examples

**Example 1: Private branch - use reset**

```bash
# Working on local feature branch
git log --oneline
# def5678 Fix typo
# abc1234 Add feature
# 9876543 Previous work

# Last commit was mistake, discard it
git reset --hard HEAD~1

# Or keep changes for rework
git reset HEAD~1
```

**Example 2: Public branch - use revert**

```bash
# Pushed to main, need to undo
git log --oneline
# abc1234 Add broken feature (pushed)
# def5678 Previous work

# Safe: create revert commit
git revert abc1234
git push origin main

# Unsafe: DO NOT reset pushed commits
# git reset --hard HEAD~1  # DON'T DO THIS
```

**Example 3: Undo multiple commits**

```bash
# Undo last 3 commits on public branch
git revert --no-commit HEAD~3..HEAD
git commit -m "Revert changes from last 3 commits"
```

**Example 4: Reset to specific commit**

```bash
# Check history
git log --oneline

# Reset to specific commit
git reset --hard abc1234

# If pushed, use revert instead
git revert def5678
```


### Reset to Remote State

```bash
# Discard all local changes, match remote
git fetch origin
git reset --hard origin/main
```


### Recovery from Reset

If you accidentally reset:

```bash
# Find lost commit using reflog
git reflog
# abc1234 HEAD@{0}: reset: moving to HEAD~1
# def5678 HEAD@{1}: commit: My lost commit

# Restore it
git reset --hard def5678
```


### Reset vs Revert Decision Tree

```
Need to undo commits?
├─ On local/private branch?
│  └─ Use reset (--soft, --mixed, or --hard)
│
└─ On public/shared branch?
   └─ Use revert (creates new commit)
```


### Best Practices

✅ **Use Reset**:

- Cleaning up local commits before pushing
- Undoing commits on private feature branches
- Reorganizing local work

✅ **Use Revert**:

- Undoing pushed commits
- Working on shared/public branches
- Maintaining complete history

❌ **Never**:

- Reset public branches that others use
- Hard reset without being sure
- Revert if you can cleanly reset instead (on private branches)

***

## Remote Operations

### Understanding Remotes

Remotes are versions of your repository hosted on servers.

**View remotes**:

```bash
# List remotes
git remote

# List with URLs
git remote -v

# Show remote details
git remote show origin
```

**Add/remove remotes**:

```bash
# Add remote
git remote add origin https://github.com/user/repo.git

# Add additional remote
git remote add upstream https://github.com/original/repo.git

# Rename remote
git remote rename origin old-origin

# Remove remote
git remote remove origin

# Change remote URL
git remote set-url origin https://github.com/user/new-repo.git
```


### Fetching Changes

Fetch downloads commits without merging:

```bash
# Fetch from origin
git fetch origin

# Fetch specific branch
git fetch origin main

# Fetch all remotes
git fetch --all

# Fetch and prune deleted remote branches
git fetch --prune
```

**View fetched changes**:

```bash
# Compare with remote
git diff origin/main

# Log remote changes
git log origin/main

# Merge remote changes
git merge origin/main
```


### Pulling Changes

Pull fetches and merges in one command:

```bash
# Pull from current branch's upstream
git pull

# Pull from specific remote/branch
git pull origin main

# Pull with rebase
git pull --rebase origin main

# Pull all and rebase
git pull --rebase --all
```

✅ **Best Practice**: Always pull before starting work and before pushing.

### Pushing Changes

Push uploads local commits to remote:

```bash
# Push to origin
git push origin main

# Push current branch to upstream
git push

# Push and set upstream
git push -u origin feature-branch
# or
git push --set-upstream origin feature-branch

# Push all branches
git push --all origin

# Push tags
git push --tags

# Push tag and commits together
git push --follow-tags
```

**Force pushing** (dangerous):

```bash
# Overwrite remote (DANGEROUS)
git push --force origin main

# Safer force push (rejects if remote has new commits)
git push --force-with-lease origin main
```

⚠️ **Warning**: Never force push to shared branches.

### Syncing Forks

When working with forks:

```bash
# Add upstream remote
git remote add upstream https://github.com/original/repo.git

# Fetch upstream
git fetch upstream

# Merge upstream changes
git checkout main
git merge upstream/main

# Or rebase onto upstream
git rebase upstream/main

# Push to your fork
git push origin main
```


### Tracking Branches

**Set upstream branch**:

```bash
# Set upstream for current branch
git branch --set-upstream-to=origin/feature-branch

# Check tracking
git branch -vv
```

**Create tracking branch**:

```bash
# Create local branch tracking remote
git checkout -b feature-branch origin/feature-branch

# Shorter syntax
git checkout --track origin/feature-branch
```


### Remote Branch Management

**List remote branches**:

```bash
git branch -r

# List all (local + remote)
git branch -a
```

**Delete remote branch**:

```bash
git push origin --delete feature-branch

# Old syntax (still works)
git push origin :feature-branch
```

**Prune deleted remote branches**:

```bash
# Remove references to deleted remote branches
git remote prune origin

# Or during fetch
git fetch --prune
```


### Best Practices for Remote Operations

✅ **Best Practices**:

- Pull before push to avoid conflicts
- Use `--force-with-lease` instead of `--force` if you must force push
- Set up branch protection rules on GitHub
- Use SSH keys instead of HTTPS for authentication
- Regularly prune stale remote branches

❌ **Common Mistakes**:

- Force pushing to shared branches
- Not pulling before pushing, causing conflicts
- Pushing sensitive data (use .gitignore)


### Authentication

**SSH setup**:

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key to GitHub
cat ~/.ssh/id_ed25519.pub
```

**Credential caching (HTTPS)**:

```bash
# Cache for 1 hour
git config --global credential.helper 'cache --timeout=3600'

# Store permanently (less secure)
git config --global credential.helper store
```


***

## Advanced Git Techniques

### Reflog - Recovery Tool

Reflog tracks all reference updates, enabling recovery:

```bash
# View reflog
git reflog

# Reflog for specific branch
git reflog show feature-branch

# Find lost commits
git reflog
# abc1234 HEAD@{0}: reset: moving to HEAD~1
# def5678 HEAD@{1}: commit: Lost commit

# Recover lost commit
git checkout def5678
# or
git reset --hard def5678
```

**Common recovery scenarios**:

**Recover from hard reset**:

```bash
git reset --hard HEAD~3  # Oops!
git reflog  # Find the commit before reset
git reset --hard HEAD@{1}  # Restore
```

**Recover deleted branch**:

```bash
git branch -D feature-branch  # Accidentally deleted
git reflog  # Find last commit on that branch
git checkout -b feature-branch abc1234  # Recreate
```

### Submodules

Include other Git repositories within your repo:

**Add submodule**:

```bash
# Add submodule
git submodule add https://github.com/user/library.git libs/library

# Initialize and update
git submodule update --init --recursive
```

**Clone with submodules**:

```bash
# Clone and initialize submodules
git clone --recursive https://github.com/user/repo.git

# Or after cloning
git submodule update --init --recursive
```

**Update submodules**:

```bash
# Update all submodules
git submodule update --remote

# Update specific submodule
git submodule update --remote libs/library
```


### Worktrees

Multiple working directories from one repository:

```bash
# Create worktree
git worktree add ../repo-hotfix hotfix-branch

# Work in worktree
cd ../repo-hotfix
# Make changes, commit

# List worktrees
git worktree list

# Remove worktree
git worktree remove ../repo-hotfix
```

**Use case**: Work on hotfix while keeping feature branch clean.

### Aliases

Create shortcuts for common commands:

```bash
# Create aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --graph --oneline --all'
```

**Complex aliases**:

```bash
# Show commit graph
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# Show branches with last commit
git config --global alias.branches "branch -vv"

# Amend without edit
git config --global alias.amend "commit --amend --no-edit"

# Force with lease
git config --global alias.pushf "push --force-with-lease"
```


### Hooks

Automate actions at various Git events:

**Common hooks**:

- `pre-commit` - Run before commit (linting, tests)
- `commit-msg` - Validate commit messages
- `pre-push` - Run before push
- `post-merge` - Run after merge

**Example pre-commit hook** (`.git/hooks/pre-commit`):

```bash
#!/bin/sh
# Run PyLint on Python files
python -m pylint $(git diff --cached --name-only --diff-filter=ACM | grep '\.py$')

# Exit if linting failed
if [ $? -ne 0 ]; then
    echo "Linting failed. Commit aborted."
    exit 1
fi
```

**Make executable**:

```bash
chmod +x .git/hooks/pre-commit
```

**Tools for hooks**:

- Husky (JavaScript/Node.js)
- pre-commit (Python)
- lefthook (Go)

***

## Git Workflows

### Feature Branch Workflow

Simple workflow for small teams:

```bash
# 1. Update main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/user-authentication

# 3. Work and commit
git add app.py
git commit -m "feat(auth): add login endpoint"

# 4. Push branch
git push -u origin feature/user-authentication

# 5. Create pull request on GitHub

# 6. After review and approval, merge on GitHub

# 7. Update local main and cleanup
git checkout main
git pull origin main
git branch -d feature/user-authentication
```


### Forking Workflow

For open source contributions:

```bash
# 1. Fork on GitHub

# 2. Clone your fork
git clone https://github.com/yourname/project.git

# 3. Add upstream
git remote add upstream https://github.com/original/project.git

# 4. Create feature branch
git checkout -b feature/improvement

# 5. Make changes and commit
git commit -am "feat: add improvement"

# 6. Push to your fork
git push origin feature/improvement

# 7. Create pull request to upstream

# 8. Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```


### Release Workflow

For versioned releases:

```bash
# 1. Create release branch
git checkout -b release/v1.2.0 develop

# 2. Update version numbers, changelog
git commit -am "chore: bump version to 1.2.0"

# 3. Test thoroughly

# 4. Merge to main
git checkout main
git merge --no-ff release/v1.2.0

# 5. Tag release
git tag -a v1.2.0 -m "Release version 1.2.0"

# 6. Merge back to develop
git checkout develop
git merge --no-ff release/v1.2.0

# 7. Push everything
git push origin main develop --tags

# 8. Delete release branch
git branch -d release/v1.2.0
```


***

## GitHub Essentials

### Pull Requests (PRs)

Pull Requests are how you propose changes and collaborate on GitHub.

**Creating a Pull Request**:

1. Push your branch to GitHub
2. Go to the repository on GitHub
3. Click "Compare & pull request" button
4. Fill in title and description
5. Click "Create pull request"

**Using GitHub CLI (`gh`)**:

```bash
# Install GitHub CLI first (https://cli.github.com)

# Authenticate
gh auth login

# Create PR from current branch
gh pr create --title "Add login feature" --body "Description here"

# Create PR with reviewers
gh pr create --title "Add login feature" --reviewer username1,username2

# List open PRs
gh pr list

# View PR details
gh pr view 123

# Checkout a PR locally
gh pr checkout 123

# Merge PR
gh pr merge 123

# Close PR without merging
gh pr close 123
```

**PR Best Practices**:

- Keep PRs small and focused (under 400 lines ideally)
- Write clear titles using commit type format: `feat: add user login`
- Include description explaining what and why
- Link related issues using `Fixes #123` or `Closes #123`
- Request reviews from relevant team members
- Respond to review comments promptly



## Troubleshooting and Recovery

### Common Problems and Solutions

**Problem 1: Merge conflict**

```bash
# During merge
git merge feature-branch
# CONFLICT in app.py

# Solution
# 1. Open file and resolve conflicts
# 2. Remove conflict markers
git add app.py
git commit -m "Merge feature-branch"
```

**Problem 2: Committed to wrong branch**

```bash
# Committed to main instead of feature
git log  # Find commit sha: abc1234

# Solution
git checkout feature-branch
git cherry-pick abc1234
git checkout main
git reset --hard HEAD~1
```

**Problem 3: Need to undo last commit**

```bash
# Keep changes
git reset --soft HEAD~1

# Discard changes
git reset --hard HEAD~1

# If already pushed
git revert HEAD
```

**Problem 4: Pushed sensitive data**

```bash
# Remove from history (DANGER: rewrites history)
git filter-branch --tree-filter 'rm -f config/secrets.json' HEAD

# Or use BFG Repo-Cleaner (recommended)
bfg --delete-files secrets.json
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

**Problem 5: Detached HEAD state**

```bash
# You're in detached HEAD
git checkout abc1234

# Solution: create branch
git checkout -b new-branch

# Or go back to main
git checkout main
```

**Problem 6: Lost commits after reset**

```bash
# Find commit in reflog
git reflog

# Restore
git checkout abc1234
git checkout -b recovery-branch
```

**Problem 7: Can't push (rejected)**

```bash
# Remote has changes
git push
# ! [rejected]

# Solution
git pull --rebase origin main
# Resolve conflicts if any
git push
```

**Problem 8: Large file stuck in history**

```bash
# Remove large file from all history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/large-file.zip" \
  --prune-empty --tag-name-filter cat -- --all

# Force push
git push --force --all
```


### Emergency Fixes

**Abort operations**:

```bash
# Abort merge
git merge --abort

# Abort rebase
git rebase --abort

```

**Clean working directory**:

```bash
# Remove untracked files (preview)
git clean -n

# Remove untracked files
git clean -f

# Remove untracked files and directories
git clean -fd

# Remove everything including ignored
git clean -fdx
```

**Reset to clean state**:

```bash
# Discard all changes
git reset --hard HEAD

# Match remote exactly
git fetch origin
git reset --hard origin/main
```


### Best Practices Summary

✅ **Always**:

- Commit frequently with clear messages
- Pull before push
- Create branches for features
- Review changes before committing
- Use .gitignore from day one
- Keep main branch stable

❌ **Never**:

- Force push to shared branches
- Commit sensitive data
- Rebase public branches
- Work directly on main
- Commit without testing


### Git Command Cheat Sheet

**Daily commands**:

```bash
git status                          # Check status
git add .                          # Stage all
git commit -m "message"            # Commit
git push                           # Push to remote
git pull                           # Pull from remote
git checkout -b branch-name        # Create and switch branch
git merge branch-name              # Merge branch
```

**Inspection**:

```bash
git log                            # View history
git log --oneline                  # Compact history
git diff                           # See changes
git show abc1234                   # Show commit
git branch                         # List branches
```

**Undo**:

```bash
git restore file.py                # Discard changes
git restore --staged file.py       # Unstage
git reset --soft HEAD~1            # Undo commit, keep changes
git reset --hard HEAD~1            # Undo commit, discard changes
git revert abc1234                 # Revert commit (safe)
```

**Stash**:

```bash
git stash                          # Save changes
git stash pop                      # Apply and remove stash
git stash list                     # List stashes
git stash drop                     # Remove stash
```

**Advanced**:

```bash
git rebase -i HEAD~3               # Interactive rebase
git reflog                         # See all reference changes
```

