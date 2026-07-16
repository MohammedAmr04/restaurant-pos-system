using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SQLite;
using Dapper;

namespace RestaurantPOS.Shared
{
    public class DatabaseContext : IDisposable
    {
        private readonly string _connectionString;
        private IDbConnection _connection;

        public DatabaseContext()
        {
            _connectionString = "Data Source=restaurant-pos.db;Version=3;";
        }

        public IDbConnection Connection
        {
            get
            {
                if (_connection == null || _connection.State != ConnectionState.Open)
                {
                    _connection = new SQLiteConnection(_connectionString);
                    _connection.Open();
                }
                return _connection;
            }
        }

        public void Dispose()
        {
            _connection?.Dispose();
        }
    }
}
