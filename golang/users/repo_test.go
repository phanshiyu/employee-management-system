package users

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

var testEnv = &TestEnv{}

func TestMain(m *testing.M) {
	// setup
	setupDbAndRepo(testEnv)
	clearTable(testEnv.Db)
	ensureTableExists(testEnv.Db)
	os.Exit(m.Run())
	// teardown
	testEnv.Db.Close()
}

func TestBulkCreate(t *testing.T) {
	// bulk create should run smoothly without any error
	err := testEnv.Re.BulkCreate(func(createUser CreateUserFunc) error {
		err := createUser(&User{
			ID:     "1",
			Name:   "a",
			Login:  "c",
			Salary: 12.1,
		})

		if err != nil {
			return err
		}

		err = createUser(&User{
			ID:     "2",
			Name:   "b",
			Login:  "e",
			Salary: 12.1,
		})

		if err != nil {
			return err
		}

		return nil
	})

	assert.Equal(t, getTotalUsers(testEnv.Db), 2, "total users should be 2")
	assert.Nil(t, err)

	// bulk create should update user if id already exists and insert if id does not exist
	err = testEnv.Re.BulkCreate(func(createUser CreateUserFunc) error {
		err := createUser(&User{
			ID:     "1",
			Name:   "ab_updated",
			Login:  "cd",
			Salary: 12.1,
		})

		if err != nil {
			return err
		}

		err = createUser(&User{
			ID:     "3",
			Name:   "b",
			Login:  "ef",
			Salary: 12.1,
		})

		if err != nil {
			return err
		}

		return nil
	})

	// id one should be updated
	user, _ := testEnv.Re.FindByID("1")
	assert.Equal(t, user.Name, "ab_updated", "user with id 1, should be updated")
	assert.Equal(t, getTotalUsers(testEnv.Db), 3, "total users should be 3")
	assert.Nil(t, err)

	// if there is an invalid entry, the transaction is rolled back
	err = testEnv.Re.BulkCreate(func(createUser CreateUserFunc) error {
		err := createUser(&User{
			ID:     "1",
			Name:   "dedfed",
			Login:  "cd",
			Salary: 12.1,
		})

		if err != nil {
			return err
		}

		err = createUser(&User{
			ID:     "3",
			Name:   "bcdef",
			Login:  "3",
			Salary: 12.1,
		})

		if err != nil {
			return err
		}

		// new id but salary conflicts
		err = createUser(&User{
			ID:     "4",
			Name:   "abc",
			Login:  "3",
			Salary: 12.1,
		})

		if err != nil {
			return err
		}

		return nil
	})

	// should expect the same assertions to pass
	user, _ = testEnv.Re.FindByID("1")
	assert.Equal(t, user.Name, "ab_updated", "user with id 1, should be updated")
	assert.Equal(t, getTotalUsers(testEnv.Db), 3, "total users should be 3")
	// this should fail though
	assert.Equal(t, err, ErrKeyAlreadyExist)
}

// TODO: test validation of each parameter
