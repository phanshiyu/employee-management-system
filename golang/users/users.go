package users

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

// here is where we initiate and bind all user related things together
func Initialize(router *gin.RouterGroup, db *sqlx.DB) {
	// route group and db should be injected from main.go
	repo, err := NewRepo(db)

	if err != nil {
		log.Fatalln(err)
	}

	// create new repo
	router.POST("upload", uploadHandler(repo))
}
