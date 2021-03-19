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

type handlerFunc func(*gin.Context, IRepo) *appError

// gin handler wrapper, to standardise error response and to inject the repo into the handlers
func NewHandler(repo IRepo, fn handlerFunc) gin.HandlerFunc {
	return func(c *gin.Context) {
		if err := fn(c, repo); err != nil {
			c.AbortWithStatusJSON(err.HttpCode, HttpErrorJSON{
				Code: err.Code,
			})
		}
	}
}

// gin http request handlers resides here
func getHandler(c *gin.Context, repo IRepo) *appError {
	// set default param values
	params := GetParams{
		MinSalary: -1,
		MaxSalary: -1,
		Offset:    0,
		Limit:     30,
	}

	if err := c.ShouldBindQuery(&params); err != nil {
		return newAppError(ErrInvalidQueryParams)
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
		return newAppError(ErrInvalidQueryParams)
	}

	c.JSON(http.StatusOK, findRes)

	return nil
}

func uploadHandler(c *gin.Context, repo IRepo) *appError {
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
			return newAppError(ErrWithCsvFile)
		}

		if err := fileHandler(file, repo); err != nil {
			return newAppError(ErrWithCsvFile)
		}
	} else {
		return newAppError(ErrContentEncodingNotSupported)
	}

	return nil
}
