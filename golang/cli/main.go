package main

import (
	"bufio"
	"flag"
	"fmt"
	"os"
	"sort"
	"strings"
)

var ascii = "abcdefghijklmnopqrstuvwxyz"

func sanitizeWord(str string) string {
	return strings.ToLower(str)
}

func getNonAsciiLetters(str string) string {
	var nonAsciiLetters []string
	for _, char := range str {
		if !strings.Contains(ascii, string(char)) {
			nonAsciiLetters = append(nonAsciiLetters, string(char))
		}
	}
	return strings.Join(nonAsciiLetters, "")
}

func main() {
	// Parse command line arguments
	inputFileName := flag.String("input", "", "Input file name")
	outputFileName := flag.String("output", "", "Output file name")
	flag.Parse()

	// Open input file
	inputFile, err := os.Open(*inputFileName)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error opening input file: %s\n", err)
		os.Exit(1)
	}
	defer inputFile.Close()

	// Read input file line by line and transform to lowercase
	var lines []string
	scanner := bufio.NewScanner(inputFile)
	for scanner.Scan() {
		lines = append(lines, sanitizeWord(scanner.Text()))
	}
	if err := scanner.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "Error reading input file: %s\n", err)
		os.Exit(1)
	}

	// Open output file and write lowercase lines to it
	outputFile, err := os.Create(*outputFileName)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error creating output file: %s\n", err)
		os.Exit(1)
	}
	defer outputFile.Close()

	// Sort the strings.
	sort.Strings(lines)
	sort.SliceStable(lines, func(i, j int) bool {
		return len(lines[i]) < len(lines[j])
	})

	writer := bufio.NewWriter(outputFile)
	for _, line := range lines {
		_, err := writer.WriteString(line + "\n")
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error writing to output file: %s\n", err)
			os.Exit(1)
		}
	}
	writer.Flush()

	fmt.Println("Done!")
}
