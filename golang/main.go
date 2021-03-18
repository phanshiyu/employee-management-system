package main

import (
	"log"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"

	"github.com/phanshiyu/employee-salary-management/golang/config"
	db "github.com/phanshiyu/employee-salary-management/golang/database"
	"github.com/phanshiyu/employee-salary-management/golang/users"
)

func main() {
	// get database config
	dbConfig := config.GetDatabaseConfigFromEnv()
	db, err := db.New(dbConfig)
	if err != nil {
		log.Fatalln(err)
	}

	r := gin.Default()

	v1 := r.Group("/")
	usersRouter := v1.Group("/users")
	users.Initialize(usersRouter, db)

	r.Run(":5000")
}
