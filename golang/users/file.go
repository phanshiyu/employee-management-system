package users

import (
	"encoding/csv"
	"fmt"
	"io"
	"mime/multipart"
	"regexp"
	"strconv"
)

// TODO: to refactor out
// CSV configs
type CsvConfig struct {
	ColsPerRow        int
	CommentIdentifier string
}

var csvConfig = CsvConfig{
	ColsPerRow:        4,
	CommentIdentifier: "#",
}

func testForComment(value string) bool {
	re := regexp.MustCompile(fmt.Sprintf("^%s", csvConfig.CommentIdentifier))
	return re.MatchString(value)
}

// use to map the columns to the User struct
func marshalFromRecord(r []string) (*User, error) {
	// convert salary string to float
	salary, err := strconv.ParseFloat(r[3], 64)
	if err != nil {
		return nil, err
	}

	u := &User{
		ID:     r[0],
		Login:  r[1],
		Name:   r[2],
		Salary: salary,
	}

	return u, nil
}

// multipart file handlers, eg CSV
func handleCSV(file multipart.File, repo IRepo) error {
	r := csv.NewReader(file)
	defer file.Close()

	// all this happens in a transaction
	var lineCount = 0
	if err := repo.BulkCreate(func(createUser CreateUserFunc) error {
		for {
			record, err := r.Read()
			if err == io.EOF {
				if lineCount == 0 {
					return ErrEmptyCsvFile
				}
				break
			}
			lineCount++
			// abort if row is a commented row
			if testForComment(record[0]) {
				continue
			}

			// check if length is as expected
			if len(record) != csvConfig.ColsPerRow {
				return ErrInvalidCsvFormat
			}

			u, err := marshalFromRecord(record)
			if err != nil {
				return err
			}

			// handle inserting of user
			if err := createUser(u); err != nil {
				return err
			}
		}

		// ends the txn
		return nil
	}); err != nil {
		return err
	}

	return nil
}

var FileHandlers = map[string]func(file multipart.File, repo IRepo) error{
	"text/csv": handleCSV,
}
