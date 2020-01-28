package main

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"log"
	"os"
)

func NewLogger() *zap.Logger {
	var config zap.Config
	if os.Getenv("env") == "production" {
		config = zap.NewProductionConfig()
		config.Level.SetLevel(zap.InfoLevel)
	} else {
		config = zap.NewDevelopmentConfig()
		config.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
	}

	logger, err := config.Build()
	if err != nil {
		log.Print("Error: Failed creating logger")
	}
	return logger
}

func SyncLogger(logger *zap.Logger) {
	err := logger.Sync()
	if err != nil {
		logger.Error("Failed logger sync: %s", zap.Error(err))
	}
}
