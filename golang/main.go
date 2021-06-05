package main

import (
	"bytes"
	"encoding/binary"
	"encoding/gob"
	"log"
	"os"
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

var Dictionaries = map[string]DictionaryInformation{
	"de": {
		Id:       "de",
		Name:     "German",
		path:     "./dictionaries/de-100k.csv",
		bin:      "de-100k.bin",
		Language: "de",
	},
	"en": {
		Id:       "en",
		Name:     "English",
		path:     "./dictionaries/eng-100k.csv",
		bin:      "en-100k.bin",
		Language: "en",
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

func SaveDictionary(path string, outpath string) {
	dictionary := anagrams.ReadDictionary(path)
	f, err := os.Create(outpath)
	if err != nil {
		log.Fatal("Couldn't open file")
	}
	defer f.Close()
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
	c.JSON(Dictionaries)
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
	c.JSON(grouped)
	return nil
}

func init() {
	for _, dict := range Dictionaries {
		SaveDictionary(dict.path, dict.bin)
	}
}

func main() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "https://anagrams.io",
	}))
	app.Use(pprof.New())
	app.Get("/anagram-dictionaries", ListDictionariesHandler)
	app.Get("/anagram/:query", AnagramsHandler)
	log.Println("Started the Server")
	log.Fatal(app.Listen(":3000"))
}