# Employee Salary Management System

Proof of concept implementation of the salary management system, the three main tech used is as follow:

Frontend: React via Create React App
Backend: Golang with Gin web framework
Database: Postgres

## Running the source code

Code is currently only available to run in development mode.

### Environment file

Create an environment file, for this example we can just run this command in the root:

    mv .env.example .env.dev

### Start docker

In the root directory:

    docker compose up

### Default endpoints

|          | Endpoint                |
| -------- | ----------------------- |
| frontend | https://localhost:3000/ |
| --       | --                      |
| backend  | https://locahost:5000/  |

### Running golang unit tests

Get container Ids

    docker ps --format 'CONTAINER ID : {{.ID}} | Name: {{.Names}} | Image:  {{.Image}} |  Ports: {{.Ports}}'

returns something like this:

    CONTAINER ID : 355ea15f561d | Name: employee-salary-management_react_1 | Image:  employee-salary-management_react |  Ports: 0.0.0.0:3000->3000/tcp
    CONTAINER ID : b82ca0524729 | Name: employee-salary-management_golang_1 | Image:  employee-salary-management_golang |  Ports: 0.0.0.0:5000->5000/tcp
    CONTAINER ID : 3ca4cd5a5d18 | Name: employee-salary-management_postgres_1 | Image:  postgres |  Ports: 5432/tcp

look for container id with name like: `employee-salary-management_golang_1`

then run:

    docker exec -it b82ca0524729 go test -v ./...

### Notes

It takes a while for the dependencies of the react-app to be installed.
