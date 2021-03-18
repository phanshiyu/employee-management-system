package users

import (
	"encoding/csv"
	"io"
	"mime/multipart"
	"strconv"
)

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

	// all this happens in a transaction
	if err := repo.BulkCreate(func(createUser CreateUserFunc) error {
		for {
			record, err := r.Read()
			if err == io.EOF {
				break
			}

			// Check if length is as expected
			if len(record) != 4 {
				return InvalidCsvFormat
			}

			u, err := marshalFromRecord(record)
			if err != nil {
				return err
			}

			// TODO: validate user here

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
