package users

import (
	"bytes"
	"log"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

type mockUserRepo struct {
	FindFunc       func(options *FindOptions) (*FindResults, error)
	FindById       func(id string) (*User, error)
	BulkCreateFunc func(fn func(CreateUserFunc) error) error
}

func (r *mockUserRepo) Find(options *FindOptions) (*FindResults, error) {
	return r.FindFunc(options)
}

func (r *mockUserRepo) FindByID(id string) (*User, error) {
	return r.FindById(id)
}

func (r *mockUserRepo) Create(u *User) (*User, error) {
	panic("Not implemented")
}

func (r *mockUserRepo) BulkCreate(fn func(CreateUserFunc) error) error {
	return r.BulkCreateFunc(fn)
}

func (r *mockUserRepo) Update(u *User) (*User, error) {
	panic("Not implemented")
}

func (r *mockUserRepo) DeleteByID(id string) error {
	panic("Not implemented")
}

func TestCsvFileHandler(t *testing.T) {
	t.Run("should parse csv correctly", func(t *testing.T) {
		file, err := os.Open("../data/without_comments.csv")
		if err != nil {
			log.Fatal(err)
		}
		defer file.Close()

		var idsBuffer bytes.Buffer
		var loginsBuffer bytes.Buffer
		var namesBuffer bytes.Buffer
		var salariesBuffer = 0
		mockRepo := &mockUserRepo{
			BulkCreateFunc: func(fn func(CreateUserFunc) error) error {
				return fn(func(u *User) error {
					idsBuffer.WriteString(u.ID)
					loginsBuffer.WriteString(u.Login)
					namesBuffer.WriteString(u.Name)
					salariesBuffer += int(u.Salary)
					return nil
				})
			},
		}
		assert.NoError(t, handleCSV(file, mockRepo))
		assert.Equal(t, "12345", idsBuffer.String())
		assert.Equal(t, "23456", loginsBuffer.String())
		assert.Equal(t, "12345", namesBuffer.String())
		assert.Equal(t, 20, salariesBuffer)
	})

	t.Run("should ignore comments", func(t *testing.T) {
		file, err := os.Open("../data/with_comments.csv")
		if err != nil {
			log.Fatal(err)
		}
		defer file.Close()

		var buffer bytes.Buffer
		mockRepo := &mockUserRepo{
			BulkCreateFunc: func(fn func(CreateUserFunc) error) error {
				return fn(func(u *User) error {
					buffer.WriteString(u.ID)
					return nil
				})
			},
		}
		assert.NoError(t, handleCSV(file, mockRepo))
		assert.Equal(t, "12345", buffer.String())
	})

	t.Run("should throw error is number of columns more than expected", func(t *testing.T) {
		file, err := os.Open("../data/one_extra_column.csv")
		if err != nil {
			log.Fatal(err)
		}
		defer file.Close()

		mockRepo := &mockUserRepo{
			BulkCreateFunc: func(fn func(CreateUserFunc) error) error {
				return fn(func(u *User) error {
					return nil
				})
			},
		}
		assert.Equal(t, handleCSV(file, mockRepo), ErrInvalidCsvColumns)
	})

	t.Run("should throw error is number of columns less than expected", func(t *testing.T) {
		file, err := os.Open("../data/one_less_column.csv")
		if err != nil {
			log.Fatal(err)
		}
		defer file.Close()

		mockRepo := &mockUserRepo{
			BulkCreateFunc: func(fn func(CreateUserFunc) error) error {
				return fn(func(u *User) error {
					return nil
				})
			},
		}
		assert.Equal(t, handleCSV(file, mockRepo), ErrInvalidCsvColumns)
	})

	t.Run("should throw error if csv file is empty", func(t *testing.T) {
		file, err := os.Open("../data/empty.csv")
		if err != nil {
			log.Fatal(err)
		}
		defer file.Close()

		mockRepo := &mockUserRepo{
			BulkCreateFunc: func(fn func(CreateUserFunc) error) error {
				return fn(func(u *User) error {
					return nil
				})
			},
		}
		assert.Equal(t, handleCSV(file, mockRepo), ErrEmptyCsvFile)
	})
}
