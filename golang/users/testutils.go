package users

import (
	"log"
	"os"

	"github.com/jmoiron/sqlx"
	"github.com/phanshiyu/employee-salary-management/golang/config"
	database "github.com/phanshiyu/employee-salary-management/golang/database"
)

type TestEnv struct {
	Re IRepo
	Db *sqlx.DB
}

func setupDbAndRepo(te *TestEnv) {
	testDbName := os.Getenv("POSTGRES_DB")
	databaseConifg := config.GetDatabaseConfigFromEnv()
	databaseConifg.DbName = testDbName
	tdb, err := database.New(databaseConifg)
	if err != nil {
		panic(err)
	}

	re, err := NewRepo(tdb)
	if err != nil {
		panic(err)
	}

	te.Db = tdb
	te.Re = re
}

const tableCreationQuery = `CREATE TABLE IF NOT EXISTS users
(
	id VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    login VARCHAR(255) NOT NULL UNIQUE,
    salary DECIMAL(19,5) NOT NULL
)`

func ensureTableExists(db *sqlx.DB) {
	if _, err := db.Exec(tableCreationQuery); err != nil {
		log.Fatal(err)
	}
}

func clearTable(db *sqlx.DB) {
	db.Exec("DROP TABLE users")
}

func resetTable(db *sqlx.DB) {
	clearTable(db)
	ensureTableExists(db)
}

func getTotalUsers(db *sqlx.DB) int {
	var count int
	db.Get(&count, "SELECT COUNT(*) FROM users;")

	return count
}
