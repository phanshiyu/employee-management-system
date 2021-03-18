package users

import (
	"log"
	"os"
	"testing"

	"github.com/jmoiron/sqlx"
	"github.com/phanshiyu/employee-salary-management/golang/config"
	db "github.com/phanshiyu/employee-salary-management/golang/database"
	"github.com/stretchr/testify/assert"
)

var u = User{
	ID:     "123sa",
	Name:   "Momo",
	Login:  "fdsf123",
	Salary: 23123.51,
}

var r IRepo

func TestMain(m *testing.M) {
	testDbName := os.Getenv("POSTGRES_DB")
	databaseConifg := config.GetDatabaseConfigFromEnv()
	databaseConifg.DbName = testDbName
	testDB, err := db.New(databaseConifg)
	if err != nil {
		panic(err)
	}

	rep, err := NewRepo(testDB)
	if err != nil {
		panic(err)
	}
	r = rep

	ensureTableExists(testDB)
	clearTable(testDB)
	os.Exit(m.Run())
	testDB.Close()
}

const tableCreationQuery = `CREATE TABLE IF NOT EXISTS users
(
	id VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    login VARCHAR(255) NOT NULL UNIQUE,
    salary DECIMAL(19,5) NOT NULL UNIQUE
)`

func ensureTableExists(db *sqlx.DB) {
	if _, err := db.Exec(tableCreationQuery); err != nil {
		log.Fatal(err)
	}
}

func clearTable(db *sqlx.DB) {
	db.Exec("DELETE FROM users")
}

func TestBulkCreate(t *testing.T) {

	err := r.BulkCreate(func(createUser CreateUserFunc) error {

		err := createUser(&User{
			ID:     "1",
			Name:   "a",
			Login:  "c",
			Salary: 12.1,
		})

		if err != nil {
			return err
		}

		err = createUser(&User{
			ID:     "2",
			Name:   "a",
			Login:  "c",
			Salary: 12.1,
		})

		if err != nil {
			return err
		}

		return nil
	})

	assert.Nil(t, err)
}
