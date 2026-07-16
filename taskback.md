You are acting as a Senior .NET Software Engineer performing a final backend validation before release.

Your goal is to ensure the backend is 100% runnable and production-ready according to the project documentation.

Do NOT create new features.

Only verify, fix, and complete missing implementation required for the backend to run correctly.

====================================================
STEP 1 — VERIFY THE SOLUTION
====================================================

Verify that:

- The solution builds successfully.
- There are no compile errors.
- There are no missing references.
- There are no missing NuGet packages.
- There are no namespace errors.
- There are no missing using statements.
- There are no syntax errors.
- There are no duplicate classes.
- There are no circular dependencies.

Fix every issue automatically.

====================================================
STEP 2 — VERIFY PROJECT CONFIGURATION
====================================================

Verify the backend is configured exactly as documented.

Requirements:

- .NET Framework 4.8
- ASP.NET Web API 2
- OWIN Self Host
- SQLite
- Dapper
- FluentValidation
- Serilog

Verify all required packages are installed and referenced correctly.

====================================================
STEP 3 — VERIFY DATABASE
====================================================

Verify:

- SQLite database can be created.
- SQL migration scripts execute successfully.
- Tables are created.
- Foreign keys are correct.
- Constraints exist.
- Default values exist.
- Soft Delete fields exist where required.
- Snapshot pricing fields exist.
- AuditLog table exists.

If the database does not exist:

Create it automatically.

Apply all pending SQL scripts automatically.

====================================================
STEP 4 — VERIFY STARTUP
====================================================

Verify application startup.

Ensure:

- OWIN starts correctly.
- API endpoints are registered.
- Static files are served.
- CORS is configured.
- Dependency Injection is configured.
- Database initialization executes successfully.

====================================================
STEP 5 — CREATE DEFAULT ADMIN USER
====================================================

If no users exist:

Create a default administrator account.

Username:

admin

Password:

Admin@123

Display Name:

Administrator

The password must be stored using the project's authentication strategy.

Never create duplicate admin accounts.

Only create it if it does not already exist.

====================================================
STEP 6 — VERIFY AUTHENTICATION
====================================================

Verify:

- Login endpoint works.
- JWT generation works.
- JWT validation works.
- Unauthorized endpoints are protected.
- Login succeeds using:

Username:
admin

Password:
Admin@123

====================================================
STEP 7 — VERIFY FEATURES
====================================================

Verify every implemented feature:

- Categories
- Menu Items
- Customers
- Restaurant Tables
- Delivery Riders
- Orders
- Returns
- Expenses
- Reports
- Settings
- Printing

Ensure:

- Repository works.
- Service works.
- Controller works.
- Validation works.
- API routes work.

====================================================
STEP 8 — VERIFY PRINTING
====================================================

Verify the printing module.

Ensure:

- ReceiptBuilder compiles.
- PrinterService compiles.
- Arabic rendering uses System.Drawing.
- Bitmap generation works.
- RAW printing pipeline is valid.

Do not change the printing architecture.

====================================================
STEP 9 — VERIFY API CONTRACTS
====================================================

Ensure every endpoint:

- Matches the API specification.
- Returns the documented response format.
- Returns proper HTTP status codes.
- Handles validation correctly.
- Handles exceptions correctly.

====================================================
STEP 10 — VERIFY LOGGING
====================================================

Ensure:

- Serilog is configured.
- Startup errors are logged.
- Unexpected exceptions are logged.
- Audit logging works for business operations.

====================================================
STEP 11 — VERIFY CLEANUP
====================================================

Remove:

- Unused classes.
- Dead code.
- Unused using statements.
- Duplicate implementations.
- Temporary debug code.
- TODO placeholders.

====================================================
STEP 12 — FINAL BUILD
====================================================

Perform a final validation.

Ensure:

- Solution builds successfully.
- No compile errors remain.
- No missing packages remain.
- No runtime configuration issues remain.
- Database initializes successfully.
- Default admin user exists.
- Backend is ready to run immediately.

====================================================
FINAL OUTPUT
====================================================

Provide a validation report including:

✔ Build Status

✔ Database Status

✔ Installed Packages

✔ Startup Status

✔ Authentication Status

✔ Default Admin User Status

✔ Printing Status

✔ Feature Status

✔ Remaining Issues (if any)

Do not report success unless every verification has passed.

Ensure the backend is ready to run.

Build.

Run.

Continue automatically.