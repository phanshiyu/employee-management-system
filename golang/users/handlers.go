package users

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/phanshiyu/employee-salary-management/golang/parser"
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
func newHandler(repo IRepo, fn handlerFunc) gin.HandlerFunc {
	return func(c *gin.Context) {
		if err := fn(c, repo); err != nil {
			c.AbortWithStatusJSON(err.HttpCode, HttpErrorJSON{
				Code: err.Code,
			})
		}
	}
}

func withParseFileFunc(processCsvFile parser.ParseFileFunc, handler func(*gin.Context, IRepo, parser.ParseFileFunc) *appError) handlerFunc {
	return func(c *gin.Context, r IRepo) *appError {
		return handler(c, r, processCsvFile)
	}
}

func createUserHandler(c *gin.Context, repo IRepo) *appError {
	u := &User{}
	err := c.BindJSON(u)
	if err != nil {
		log.Println(err)
		return newAppError(ErrDataValidationFailure)
	}

	newUser, err := repo.Create(u)
	if err != nil {
		return newAppError(err)
	}

	c.JSON(http.StatusAccepted, newUser)
	return nil
}

func getUserHandler(c *gin.Context, repo IRepo) *appError {
	userID := c.Param("id")

	user, err := repo.FindByID(userID)
	if err == ErrUserDoesNotExist {
		return newAppError(ErrUserDoesNotExist)
	}

	c.JSON(http.StatusAccepted, user)
	return nil
}

func getUsersHandler(c *gin.Context, repo IRepo) *appError {
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

func uploadHandler(c *gin.Context, repo IRepo, parseFile parser.ParseFileFunc) *appError {
	req := c.Request
	contentEncoding := req.Header.Get("Content-Encoding")

	if _, ok := FileHandlers[contentEncoding]; ok {
		req.ParseMultipartForm(10 << 20)
		// Read file
		file, fHeaders, err := req.FormFile("file")
		if err != nil {
			fmt.Println("Error Retrieving the File")
			fmt.Println(err)
			return newAppError(err)
		}
		fmt.Printf("Uploaded File: %+v\n", fHeaders.Filename)
		fmt.Printf("File Size: %+v\n", fHeaders.Size)
		fmt.Printf("MIME Header: %+v\n", fHeaders.Header)

		// Create a temporary file within our temp-csv directory that follows
		// a particular naming pattern
		tempFile, err := ioutil.TempFile("temp-csv", "upload-*.csv")
		if err != nil {
			fmt.Println(err)
		}
		defer tempFile.Close()

		fileBytes, err := ioutil.ReadAll(file)
		if err != nil {
			fmt.Println(err)
		}

		tempFile.Write(fileBytes)

		// push to channel
		responseChan := parseFile(tempFile.Name())

		// Remove the file here
		defer func() {
			if err := os.Remove(tempFile.Name()); err != nil {
				log.Println(err)
			}
		}()

		if res := <-responseChan; res.Err != nil {
			return newAppError(res.Err)
		}

		c.String(http.StatusOK, tempFile.Name())
	} else {
		return newAppError(ErrContentEncodingNotSupported)
	}

	return nil
}
