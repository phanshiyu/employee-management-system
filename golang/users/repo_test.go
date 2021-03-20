package users

import (
	"bytes"
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
	t.Run("adding a series of users should be successful", func(t *testing.T) {
		err := testEnv.Re.BulkCreate(func(createUser CreateUserFunc) error {
			err := createUser(&User{
				ID:     "1",
				Name:   "1",
				Login:  "1",
				Salary: 12.1,
			})

			if err != nil {
				return err
			}

			err = createUser(&User{
				ID:     "2",
				Name:   "2",
				Login:  "2",
				Salary: 12.1,
			})

			if err != nil {
				return err
			}

			return nil
		})

		assert.Equal(t, 2, getTotalUsers(testEnv.Db), "total users should be 2")
		assert.Nil(t, err)
	})

	t.Run("should update user if id already exists and insert if id does not exist", func(t *testing.T) {
		err := testEnv.Re.BulkCreate(func(createUser CreateUserFunc) error {
			err := createUser(&User{
				ID:     "1",
				Name:   "1Updated",
				Login:  "1Updated",
				Salary: 12.1,
			})

			if err != nil {
				return err
			}

			err = createUser(&User{
				ID:     "3",
				Name:   "3",
				Login:  "3",
				Salary: 12.1,
			})

			if err != nil {
				return err
			}

			return nil
		})

		// id one should be updated
		user, _ := testEnv.Re.FindByID("1")
		assert.Equal(t, "1Updated", user.Name, "user with id 1, should be updated")
		assert.Equal(t, 3, getTotalUsers(testEnv.Db), "total users should be 3")
		assert.Nil(t, err)
	})

	t.Run("should rollback if there is an invalid entry", func(t *testing.T) {
		err := testEnv.Re.BulkCreate(func(createUser CreateUserFunc) error {
			err := createUser(&User{
				ID:     "1",
				Name:   "1UpdatedAgain",
				Login:  "1UpdatedAgain",
				Salary: 12.1,
			})

			if err != nil {
				return err
			}

			err = createUser(&User{
				ID:     "3",
				Name:   "3Updated",
				Login:  "3Updated",
				Salary: 12.1,
			})

			if err != nil {
				return err
			}

			// new id but conflicts
			err = createUser(&User{
				ID:     "4",
				Name:   "4",
				Login:  "3Updated",
				Salary: 12.1,
			})

			if err != nil {
				return err
			}

			return nil
		})

		// should expect the same assertions to pass
		user, _ := testEnv.Re.FindByID("1")
		assert.Equal(t, "1Updated", user.Name, "user with id 1 should not be updated")
		assert.Equal(t, 3, getTotalUsers(testEnv.Db), "total users should remain as 3")
		// this should fail though
		assert.Equal(t, ErrKeyAlreadyExist, err)
	})

	t.Run("should not allow salary to be negative", func(t *testing.T) {
		err := testEnv.Re.BulkCreate(func(createUser CreateUserFunc) error {
			err := createUser(&User{
				ID:     "4",
				Name:   "4",
				Login:  "4",
				Salary: -1,
			})

			if err != nil {
				return err
			}

			return nil
		})
		assert.Equal(t, ErrDataValidationFailure, err)
		user, _ := testEnv.Re.FindByID("4")
		assert.Nil(t, user)
	})

	t.Run("should not allow creation with duplicate login", func(t *testing.T) {
		err := testEnv.Re.BulkCreate(func(createUser CreateUserFunc) error {
			err := createUser(&User{
				ID:     "4",
				Name:   "4",
				Login:  "4",
				Salary: 10,
			})

			if err != nil {
				return err
			}

			err = createUser(&User{
				ID:     "5",
				Name:   "5",
				Login:  "4",
				Salary: 10,
			})

			if err != nil {
				return err
			}

			return nil
		})

		assert.Equal(t, ErrKeyAlreadyExist, err)
		user, _ := testEnv.Re.FindByID("4")
		assert.Nil(t, user)
		user, _ = testEnv.Re.FindByID("5")
		assert.Nil(t, user)
	})
}

func TestFind(t *testing.T) {
	// add a few users
	err := testEnv.Re.BulkCreate(func(createUser CreateUserFunc) error {
		err := createUser(&User{
			ID:     "1",
			Name:   "1",
			Login:  "1",
			Salary: 1,
		})

		if err != nil {
			return err
		}

		err = createUser(&User{
			ID:     "2",
			Name:   "2",
			Login:  "2",
			Salary: 2,
		})

		if err != nil {
			return err
		}

		err = createUser(&User{
			ID:     "3",
			Name:   "3",
			Login:  "3",
			Salary: 3,
		})

		if err != nil {
			return err
		}

		err = createUser(&User{
			ID:     "4",
			Name:   "4",
			Login:  "4",
			Salary: 4,
		})

		if err != nil {
			return err
		}

		return nil
	})

	assert.Equal(t, 4, getTotalUsers(testEnv.Db), "total users should be 4")
	assert.Nil(t, err)

	t.Run("empty options should return me all users, and should be sorted by ID, ascending order", func(t *testing.T) {
		results, err := testEnv.Re.Find(&FindOptions{})

		var buffer bytes.Buffer
		for _, item := range results.Items {
			buffer.WriteString(item.ID)

		}
		assert.Nil(t, err)
		assert.Equal(t, 4, results.TotalCount)
		assert.Equal(t, "1234", buffer.String())
	})

	t.Run("limit 1 should return only 1", func(t *testing.T) {
		results, err := testEnv.Re.Find(&FindOptions{Limit: 1})

		assert.Nil(t, err)
		assert.Equal(t, 4, results.TotalCount)
		assert.Equal(t, 1, len(results.Items))
	})

	t.Run("limit 1 offset 2 should return only the third user", func(t *testing.T) {
		results, err := testEnv.Re.Find(&FindOptions{Limit: 1, Offset: 2})

		assert.Nil(t, err)
		assert.Equal(t, 4, results.TotalCount)
		assert.Equal(t, 1, len(results.Items))
		assert.Equal(t, "3", results.Items[0].ID)
	})

	t.Run("min salary 3 and max salary 3 should only return third user", func(t *testing.T) {
		minSalary := 3
		maxSalary := 3
		results, err := testEnv.Re.Find(&FindOptions{MinSalary: &minSalary, MaxSalary: &maxSalary})

		assert.Nil(t, err)
		assert.Equal(t, 1, results.TotalCount)
		assert.Equal(t, 1, len(results.Items))
		assert.Equal(t, "3", results.Items[0].ID)
	})

	t.Run("min salary 2 and max salary 4 should only return users 2 - 4", func(t *testing.T) {
		minSalary := 2
		maxSalary := 4
		results, err := testEnv.Re.Find(&FindOptions{MinSalary: &minSalary, MaxSalary: &maxSalary})

		assert.Nil(t, err)
		assert.Equal(t, 3, results.TotalCount)
		assert.Equal(t, 3, len(results.Items))
		assert.Equal(t, "2", results.Items[0].ID)
		assert.Equal(t, "3", results.Items[1].ID)
		assert.Equal(t, "4", results.Items[2].ID)
	})
}
