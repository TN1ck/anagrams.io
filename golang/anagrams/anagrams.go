package anagrams

import (
	"bufio"
	"bytes"
	"io"
	"os"
	"regexp"
	"sort"
	"strings"
)

type BinaryWord = [26]uint8

type SimpleWord struct {
	Binary BinaryWord
	Word   string
}

type GroupedWord struct {
	Set    string   `json:"set"`
	Words  []string `json:"words"`
	Index  int      `json:"index"`
	Length int      `json:"length"`
}

var alphabet = "abcdefghijklmnopqrstuvwxyz"

func StringToBinary(str string) [26]uint8 {
	var frequency [26]uint8
	for _, char := range str {
		pos := strings.Index(alphabet, string(char))
		frequency[pos] = frequency[pos] + 1
	}
	return frequency
}

func BinaryToSortedString(frequency [26]uint8) string {
	var b bytes.Buffer
	for pos, amount := range frequency {
		var i uint8 = 0
		for {
			if i == amount {
				break
			}
			b.WriteByte(alphabet[pos])
			i++
		}
	}
	return b.String()
}

func isBinarySubset(bin BinaryWord, subbin BinaryWord) bool {
	for i := range bin {
		if bin[i] > subbin[i] {
			return false
		}
	}
	return true
}

var onlyLetters = regexp.MustCompile("[^a-z]")

func sanitizeWord(str string) string {
	replaceMap := map[string]string{
		"ä": "ae",
		"Ä": "ae",
		"ö": "oe",
		"Ö": "oe",
		"ü": "ue",
		"Ü": "ue",
		"ß": "ss",
	}
	currentString := strings.ToLower(str)
	for key, value := range replaceMap {
		currentString = strings.ReplaceAll(currentString, key, value)
	}
	// Remove spaces
	return onlyLetters.ReplaceAllString(currentString, "")
}

func StringToWord(str string) SimpleWord {
	sanitized := sanitizeWord(str)
	return SimpleWord{
		Binary: StringToBinary(sanitized),
		Word:   sanitized,
	}
}

func ReadDictionary(path string) []SimpleWord {
	germanWords, err := os.Open(path)
	if err != nil {
		panic(err)
	}
	defer germanWords.Close()

	germanReader := bufio.NewReader(germanWords)
	var line string
	var words []SimpleWord
	for {
		line, err = germanReader.ReadString('\n')
		if err != nil || err == io.EOF {
			return words
		}
		words = append(words, StringToWord(line))
	}
}

func FindSubAnagrams(query SimpleWord, dictionary []SimpleWord) []SimpleWord {
	var result []SimpleWord
	for _, word := range dictionary {
		if isBinarySubset(word.Binary, query.Binary) {
			result = append(result, word)
		}
	}
	return result
}

func isCorrectWord(mustLetters BinaryWord, allowedLetters BinaryWord, bin BinaryWord) bool {
	for i := range bin {
		if mustLetters[i] > 0 && bin[i] == 0 {
			return false
		}
		if bin[i] > 0 && allowedLetters[i] == 0 && mustLetters[i] == 0 {
			return false
		}
	}
	return true
}

func FindSubsetWords(mustLetters BinaryWord, allowedLetters BinaryWord, dictionary []SimpleWord) []SimpleWord {
	var result []SimpleWord
	for _, word := range dictionary {
		if isCorrectWord(mustLetters, allowedLetters, word.Binary) {
			result = append(result, word)
		}
	}
	return result
}

func GroupAnagramsList(anagramsList []SimpleWord) []GroupedWord {
	result := make(map[string][]SimpleWord)
	for _, word := range anagramsList {
		sortedString := BinaryToSortedString(word.Binary)
		value, ok := result[sortedString]
		if !ok {
			result[sortedString] = []SimpleWord{word}
		} else {
			result[sortedString] = append(value, word)
		}
	}

	var grouped []GroupedWord
	i := 0
	for key, words := range result {
		var stringWords []string
		for _, word := range words {
			stringWords = append(stringWords, word.Word)
		}
		grouped = append(grouped, GroupedWord{
			Set:    key,
			Index:  i,
			Length: len(key),
			Words:  stringWords,
		})
		i += 1
	}
	// We prefer big words over smaller ones
	sort.SliceStable(grouped, func(i, j int) bool {
		return grouped[i].Length > grouped[j].Length
	})
	// Update the indexes
	for index := range grouped {
		grouped[index].Index = index
	}
	return grouped
}
