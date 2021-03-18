package main

import (
	"log"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"

	"github.com/phanshiyu/employee-salary-management/golang/db"
	"github.com/phanshiyu/employee-salary-management/golang/users"
)

func main() {
	db, err := db.New()
	if err != nil {
		log.Fatalln(err)
	}

	r := gin.Default()
	r.MaxMultipartMemory = 8 << 20 // 8 MiB
	v1 := r.Group("/")
	usersRouter := v1.Group("/users")
	users.Init(usersRouter, db)

	r.Run(":5000")
}
