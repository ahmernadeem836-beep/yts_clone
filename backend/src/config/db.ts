import sql from "msnodesqlv8";

const connectionString =
  "Driver={ODBC Driver 18 for SQL Server};" +
  "Server=localhost\\SQLEXPRESS;" +
  "Database=yts_db;" +
  "Trusted_Connection=Yes;" +
  "TrustServerCertificate=Yes;";

export function connectDB() {
  sql.open(connectionString, (error) => {
    if (error) {
      console.error("Database connection failed:", error);
      return;
    }

    console.log("SQL Server connected successfully");
  });
}

export function queryDB(query: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    sql.query(connectionString, query, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows ?? []);
    });
  });
}