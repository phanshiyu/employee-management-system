package users

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/phanshiyu/employee-salary-management/golang/parser"
)

// here is where we initiate and bind all user related things together
func Initialize(router *gin.RouterGroup, db *sqlx.DB) {
	// route group and db should be injected from main.go
	repo, err := NewRepo(db)

	if err != nil {
		log.Fatalln(err)
	}

	// Creates a queue to process files one at a time
	parseFile := parser.NewParser(func(f *os.File) error {
		if err := FileHandlers["text/csv"](f, repo); err != nil {
			log.Println(err)
			return err
		}

		return nil
	})

	router.GET("", newHandler(repo, getUsersHandler))
	router.GET("/:id", newHandler(repo, getUserHandler))
	router.POST("", newHandler(repo, createUserHandler))
	router.POST("/upload", newHandler(repo, withParseFileFunc(parseFile, uploadHandler)))
}
