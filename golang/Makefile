.PHONY: run-api
run-api:
	go run main.go

.PHONY: normalize-dictionary
normalize-dictionary:
	go run cli/main.go --input=../dictionaries/eng-100k.csv --output=../dictionaries/eng-100k-sorted.csv
