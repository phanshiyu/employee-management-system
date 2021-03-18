package config

import "os"

type DatabaseConfig struct {
	User   string
	Pass   string
	Host   string
	Port   string
	DbName string
}

func GetDatabaseConfigFromEnv() DatabaseConfig {
	return DatabaseConfig{
		User:   os.Getenv("POSTGRES_USER"),
		Pass:   os.Getenv("POSTGRES_PASSWORD"),
		Host:   os.Getenv("POSTGRES_HOST"),
		Port:   os.Getenv("POSTGRES_PORT"),
		DbName: os.Getenv("POSTGRES_DB"),
	}
}
