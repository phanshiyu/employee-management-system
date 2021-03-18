package users

import (
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

// here is where we initiate and bind all user related things together
func Initialize(router gin.RouterGroup, db *sqlx.DB) {
	// route group and db should be injected from main.go

	// create new repo
}
