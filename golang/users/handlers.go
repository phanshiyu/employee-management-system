package users

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type GetParams struct {
	MinSalary int    `form:"minSalary, "`
	MaxSalary int    `form:"maxSalary"`
	Offset    int    `form:"offset"`
	Limit     int    `form:"limit"`
	Sort      string `form:"sort"`
}

// gin http request handlers resides here
func getHandler(repo IRepo) gin.HandlerFunc {
	return func(c *gin.Context) {
		params := GetParams{
			MinSalary: -1,
			MaxSalary: -1,
			Offset:    0,
			Limit:     30,
		}

		if err := c.ShouldBindQuery(&params); err != nil {
			c.AbortWithError(http.StatusBadRequest, ErrInvalidQueryParams)
			return
		}

		opts := &FindOptions{
			Limit:  params.Limit,
			Offset: params.Offset,
		}

		if params.MinSalary > -1 {
			opts.MinSalary = &params.MinSalary
		}
		if params.MaxSalary > -1 {
			opts.MaxSalary = &params.MaxSalary
		}

		if len(params.Sort) > 0 {
			// extract sort direction
			if params.Sort[0] == '-' {
				opts.SortIsDesc = true
			}

			// extract the sort key
			opts.SortKey = params.Sort[1:]
		}

		findRes, err := repo.Find(opts)

		if err != nil {
			c.AbortWithError(http.StatusBadRequest, err)
			return
		}

		c.JSON(http.StatusOK, findRes)
	}
}

func uploadHandler(repo IRepo) gin.HandlerFunc {
	return func(c *gin.Context) {
		req := c.Request
		contentEncoding := req.Header.Get("Content-Encoding")

		if fileHandler, ok := FileHandlers[contentEncoding]; ok {
			req.ParseMultipartForm(10 << 20)
			// Read file
			file, fHeaders, err := req.FormFile("file")
			fmt.Printf("Uploaded File: %+v\n", fHeaders.Filename)
			fmt.Printf("File Size: %+v\n", fHeaders.Size)
			fmt.Printf("MIME Header: %+v\n", fHeaders.Header)

			if err != nil {
				c.AbortWithError(http.StatusBadRequest, err)
				return
			}

			if err := fileHandler(file, repo); err != nil {
				c.AbortWithError(http.StatusBadRequest, err)
				return
			}
		} else {
			c.AbortWithError(http.StatusBadRequest, ErrContentEncodingNotSupported)
			return
		}
	}
}
