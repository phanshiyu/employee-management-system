# Employee Management System

## Upload example
```
curl -X POST http://localhost:5000/users/upload \
  -F "file=@/Users/shiyuphan/Desktop/mockdata.csv" \
  -H "Content-Type: multipart/form-data" \
  -H "Content-Encoding: text/csv"
```

## Get example
```
curl -X GET "http://localhost:5000/users?minSalary=0&maxSalary=4000&offset=0&limit=30&sort=+name"

```