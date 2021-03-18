package db

import (
	"fmt"
	"log"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"

	"github.com/phanshiyu/employee-salary-management/golang/config"
)

func New(dbConfig config.DatabaseConfig) (database *sqlx.DB, err error) {
	str := buildConnectionString(dbConfig)

	database, err = sqlx.Open("postgres", str)
	if err != nil {
		return
	}

	err = database.Ping()
	if err != nil {
		return
	}

	return
}

func buildConnectionString(dbConfig config.DatabaseConfig) string {
	user := dbConfig.User
	pass := dbConfig.Pass
	if user == "" || pass == "" {
		log.Fatalln("You must include POSTGRES_USER and POSTGRES_PASSWORD environment variables")
	}
	host := dbConfig.Host
	port := dbConfig.Port
	dbname := dbConfig.DbName
	if host == "" || port == "" || dbname == "" {
		log.Fatalln("You must include POSTGRES_HOST, POSTGRES_PORT, and POSTGRES_DB environment variables")
	}

	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", user, pass, host, port, dbname)
}
