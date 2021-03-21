package users

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/phanshiyu/employee-salary-management/golang/files"
	"github.com/phanshiyu/employee-salary-management/golang/parser"
)

type GetParams struct {
	MinSalary int    `form:"minSalary, "`
	MaxSalary int    `form:"maxSalary"`
	Offset    int    `form:"offset"`
	Limit     int    `form:"limit"`
	Sort      string `form:"sort"`
}

type handlerFunc func(*gin.Context) *appError

// gin handler wrapper, to standardise error response and to inject the repo into the handlers
func withErrorHandler(fn handlerFunc) gin.HandlerFunc {
	return func(c *gin.Context) {
		if err := fn(c); err != nil {
			c.AbortWithStatusJSON(err.HttpCode, HttpErrorJSON{
				Code: err.Code,
			})
		}
	}
}

func createUserHandler(repo IRepo) handlerFunc {
	return func(c *gin.Context) *appError {
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
}

func getUserHandler(repo IRepo) handlerFunc {
	return func(c *gin.Context) *appError {

		userID := c.Param("id")

		user, err := repo.FindByID(userID)
		if err == ErrUserDoesNotExist {
			return newAppError(ErrUserDoesNotExist)
		}

		c.JSON(http.StatusAccepted, user)
		return nil
	}
}

func getUsersHandler(repo IRepo) handlerFunc {
	return func(c *gin.Context) *appError {
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
}

func uploadHandler(parseFile parser.ParseFileFunc, fileStatusRepo files.IRepo) handlerFunc {
	return func(c *gin.Context) *appError {
		req := c.Request
		contentEncoding := req.Header.Get("Content-Encoding")

		if _, ok := FileHandlers[contentEncoding]; ok {
			req.ParseMultipartForm(10 << 20)
			// Read file
			file, fHeaders, err := req.FormFile("file")
			userID := req.Form.Get("userID")

			updateFileStatus := func(filepath string, status string) {
				if userID != "" {
					fileStatusRepo.Update(userID, filepath, status)
				}
			}

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

			tempFilepath := tempFile.Name()

			// update status to queued
			updateFileStatus(tempFilepath, "queued")
			// push request to channel
			responseChan := parseFile(tempFilepath)

			// Remove the file here
			defer func() {
				if err := os.Remove(tempFilepath); err != nil {
					log.Println(err)
				}
			}()

			for {
				res := <-responseChan
				println(res.Status)
				updateFileStatus(tempFilepath, res.Status)
				if res.Err != nil {
					return newAppError(res.Err)
				}

				if res.Status == "completed" {
					break
				}
			}
			c.String(http.StatusOK, tempFilepath)
		} else {
			return newAppError(ErrContentEncodingNotSupported)
		}

		return nil
	}
}

func getUserUploads(fileStatusRepo files.IRepo) handlerFunc {
	return func(c *gin.Context) *appError {
		userID := c.Param("id")
		c.JSON(http.StatusOK, fileStatusRepo.Get(userID))
		return nil
	}
}
