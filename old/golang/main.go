package main

import (
	"bytes"
	"encoding/binary"
	"encoding/gob"
	"fmt"
	"log"
	"os"
	"sort"
	"tn1ck/anagramania/golang/anagrams"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/pprof"
)

type DictionaryInformation struct {
	Id       string `json:"id"`
	Name     string `json:"name"`
	Language string `json:"language"`
	path     string
	bin      string
}

type DictionaryListResponse struct {
	Success      bool                    `json:"success"`
	Dictionaries []DictionaryInformation `json:"dictionaries"`
}

type AnagramsResponse struct {
	Success  bool                   `json:"success"`
	Anagrams []anagrams.GroupedWord `json:"anagrams"`
}

var Dictionaries = map[string]DictionaryInformation{
	"en": {
		Id:       "en",
		Name:     "English",
		path:     "./dictionaries/eng-100k.csv",
		bin:      "en-100k.bin",
		Language: "en",
	},
	"de": {
		Id:       "de",
		Name:     "German",
		path:     "./dictionaries/de-100k.csv",
		bin:      "de-100k.bin",
		Language: "de",
	},
}

func GetDictionary(path string) []anagrams.SimpleWord {
	f, err := os.Open(path)
	if err != nil {
		log.Fatal("Couldn't open file")
	}
	defer f.Close()
	dec := gob.NewDecoder(f)
	dictionary := make([]anagrams.SimpleWord, 99999)
	if err := dec.Decode(&dictionary); err != nil {
		log.Fatal("Couldn't decode dictionary", err)
	}
	return dictionary
}

func SaveOptimizedDictionary(dictionary []anagrams.DictionaryEntry, path string) error {
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()

	// Create a CSV out of the dictionary
	for _, entry := range dictionary {
		f.WriteString(anagrams.BinaryToSortedString(entry.Binary) + "," + fmt.Sprintf("%v", entry.WordIndexes) + "\n")
	}
	return nil
}

func SaveDictionary(path string, outpath string) {
	dictionary := anagrams.ReadDictionary(path)
	f, err := os.Create(outpath)
	if err != nil {
		log.Fatal("Couldn't open file")
	}
	defer f.Close()

	optimized := anagrams.OptimizeDictionary(dictionary)
	SaveOptimizedDictionary(optimized, outpath+".csv")

	buf := new(bytes.Buffer)
	enc := gob.NewEncoder(buf)
	if err := enc.Encode(dictionary); err != nil {
		log.Fatal("Encoding failed", err)
	}
	err = binary.Write(f, binary.LittleEndian, buf.Bytes())
	if err != nil {
		log.Fatal("Write failed", err)
	}
}

func ListDictionariesHandler(c *fiber.Ctx) error {
	c.Accepts("json")
	response := DictionaryListResponse{Success: true}
	for _, dict := range Dictionaries {
		response.Dictionaries = append(response.Dictionaries, dict)
	}
	c.JSON(response)
	return nil
}

func AnagramsHandler(c *fiber.Ctx) error {
	c.Accepts("json")
	query := c.Params("query")
	dictId := c.Query("dictionary")
	queryWord := anagrams.StringToWord(query)
	dictionaryInformation, ok := Dictionaries[dictId]
	if !ok {
		dictionaryInformation = Dictionaries["en"]
	}
	dictionary := GetDictionary(dictionaryInformation.bin)
	subanagrams := anagrams.FindSubAnagrams(queryWord, dictionary)
	grouped := anagrams.GroupAnagramsList(subanagrams)
	response := AnagramsResponse{Success: true}
	response.Anagrams = grouped
	c.JSON(response)
	return nil
}

type SubsetWordsResponse struct {
	Success bool     `json:"success"`
	Words   []string `json:"words"`
}

func SubsetWordsHandler(c *fiber.Ctx) error {
	c.Accepts("json")
	mustLetters := c.Query("mustLetters")
	allowedLetters := c.Query("allowedLetters")
	dictId := c.Query("dictionary")
	mustWord := anagrams.StringToWord(mustLetters)
	allowedWord := anagrams.StringToWord(allowedLetters)
	dictionaryInformation, ok := Dictionaries[dictId]
	if !ok {
		dictionaryInformation = Dictionaries["en"]
	}
	dictionary := GetDictionary(dictionaryInformation.bin)
	subwords := anagrams.FindSubsetWords(mustWord.Binary, allowedWord.Binary, dictionary)

	words := make([]string, len(subwords))
	for i, w := range subwords {
		words[i] = w.Word
	}
	sort.SliceStable(words, func(i, j int) bool {
		return len(words[i]) > len(words[j]) || words[i] < words[j]
	})

	response := SubsetWordsResponse{Success: true, Words: words}
	return c.JSON(response)
}

func init() {
	for _, dict := range Dictionaries {
		SaveDictionary(dict.path, dict.bin)
	}
}

func main() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
	}))
	app.Use(pprof.New())
	app.Get("/anagram-dictionaries", ListDictionariesHandler)
	app.Get("/anagram/:query", AnagramsHandler)
	app.Get("/spellingbee", SubsetWordsHandler)
	log.Println("Started the Server")
	log.Fatal(app.Listen(":3000"))
}
