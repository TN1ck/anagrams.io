package anagrams

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestStringToBinary(t *testing.T) {
	result := StringToBinary("aabc")
	var expected [26]uint8
	expected[0] = 2
	expected[1] = 1
	expected[2] = 1
	assert.Equal(t, result, expected)
}

func TestStringToWord(t *testing.T) {
	result := StringToWord("hello")
	expected := SimpleWord{
		Binary: [26]uint8{0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
		Word:   "hello",
	}
	assert.Equal(t, result, expected)
}

func TestReadDictionary(t *testing.T) {
	result := ReadDictionary("../../dictionaries/de-3k.csv")
	assert.Equal(t, len(result), 2999)
}

func TestFindSubAnagrams(t *testing.T) {
	query := StringToWord("hello")
	dictionary := []SimpleWord{
		StringToWord("hel"),
		StringToWord("ello"),
		StringToWord("lo"),
		StringToWord("hellol"),
	}
	result := FindSubAnagrams(query, dictionary)
	expected := []SimpleWord{
		StringToWord("hel"),
		StringToWord("ello"),
		StringToWord("lo"),
	}
	assert.Equal(t, result, expected)
}

func TestGroupAnagramsList(t *testing.T) {
	anagramsList := []SimpleWord{
		StringToWord("abc"),
		StringToWord("cba"),
		StringToWord("bca"),
		StringToWord("cab"),
		StringToWord("dede"),
		StringToWord("eedd"),
	}
	result := GroupAnagramsList(anagramsList)
	expected := []GroupedWord{
		{
			Set:    "ddee",
			Words:  []string{"dede", "eedd"},
			Index:  0,
			Length: 4,
		},
		{
			Set:    "abc",
			Words:  []string{"abc", "cba", "bca", "cab"},
			Index:  1,
			Length: 3,
		},
	}
	assert.Equal(t, result, expected)
}
