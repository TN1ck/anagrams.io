;
; This namespace holds all functionality for finding anagrams
;
(ns anagramania.anagram
  (:require [clojure.data.csv :as csv]
            [clojure.java.io :as io]))

;
; To find anagrams, one needs a list of words to match against,
; so we wirst read a wordlist, and parse it for our needs
;

; parse a csv into a list of lists
(defn read-wordlist [path]
  (with-open [reader (io/reader path)]
    (doall
      (csv/read-csv reader))))

; "hallo" => #{:h0 :a0 :l0 :l1 :o0}
(defn word-to-set [word]
  (set (flatten
    (map
      #(map-indexed (fn [i c] (keyword (str c i))) %)
      (vals (group-by identity (seq word)))))))

; ["hallo" "0.2323"] => {:word "hallo" :popularity 0.2323 :set #{:h0 :a0 :l0 :l1 :o0}}
(defn parse-row [[word & rest-list]]
  {:word word
   :popularity (if (empty? rest-list) 0 (read-string first rest-list))
   :set (word-to-set word)})

; create our wordlist
(defn parse-wordlist [wordlist]
  (map parse-row wordlist))

; not every word is equally as good, we use the length + the popularity as a measure of its goodness
(defn calculate-goodness [parsed-wordlist]
  (reverse (sort-by :rating (map #(assoc % :rating (+ (count (:word %)) (:popularity %))) parsed-wordlist))))

; simple function to give the english dictionary
(defn parsed-en-wordlist []
  (parse-wordlist (read-wordlist "src/dictionaries/eng-us.csv")))

; simple function to give the english dictionary
(defn parsed-3000-wordlist []
  (parse-wordlist (read-wordlist "src/dictionaries/eng-us-3000-most-common.csv")))


; simple equality check on sets to find anagrams
(defn find-anagrams
  [parsed-wordlist word]
  (let [parsed-word (word-to-set word)]
    (filter #(= parsed-word (:set %)) parsed-wordlist)))

; use subset to find subanagrams
(defn find-subanagrams
  [parsed-wordlist word]
  (let [parsed-word (word-to-set word)]
    (filter #(clojure.set/subset? (:set %) parsed-word) parsed-wordlist)))

; Joins two sets of words together to a new set
(defn join-words [word-1 word-2]
  (set (flatten
    (map
    #(map-indexed
      (fn [i k] (keyword (str (second (str k)) i)))
      %)
    (vals (group-by #(second (str %)) (concat (vec word-1) (vec word-2))))))))

; subset but is not equal
(defn strict-subset? [s1 s2]
  (and (clojure.set/subset? s1 s2) (not= s1 s2)))

(defn create-initial-stack [goodness-list]
  (map-indexed #(assoc {} :set (:set %2) :list [%2] :index %1) goodness-list))

(defn _find-anagram-sentences [parsed-query goodness-list stack counter-atom solution-atom]
  ;; stop if we found all solutions or we iterated 350 times
  (if (or (> @counter-atom 1500) (empty? stack))
    stack
    (let [[current & rest-stack] stack
           current-set (:set current)
           current-list (:list current)
           current-index (:index current)]
      (do
        (println @counter-atom)
        (println "testing" (map :word current-list))
        (when (= current-set parsed-query)
          (do
            (swap! solution-atom #(cons current %))
            (println "found solution")
            (println current)))
        (let [possibilities (map
                           #(let [joined-words (join-words current-set (:set %))]
                              (assoc {} :set joined-words :list (cons % current-list) :index current-index))
                            ;; this is an important optimization, think of n!:
                            ;; the first item checks with everyone
                            ;; the second one does not need to check with the first one, because the first one did that...
                           (drop current-index goodness-list))
              filtered-possibilities (filter #(strict-subset? (:set %) parsed-query) possibilities)
              solutions (filter #(= (:set %) parsed-query) possibilities)]
          (do
               (println "current index" current-index "of" (count goodness-list))
;;             (println "solutions" solutions)
;;             (println possibilities)
            (swap! solution-atom #(concat solutions %))
            (swap! counter-atom inc)
            (_find-anagram-sentences
              parsed-query
              goodness-list
              (concat filtered-possibilities rest-stack)
              counter-atom
              solution-atom)))))))

(defn find-anagram-sentences [parsed-wordlist query]
  (let [counter-atom (atom 0)
        solution-atom (atom '())
        goodness-list (calculate-goodness (find-subanagrams parsed-wordlist query))
        parsed-query (word-to-set (clojure.string/trim query))
        initial-stack (create-initial-stack goodness-list)]
    (do
      (println "finding anagram sentences for" query)
      (_find-anagram-sentences parsed-query goodness-list initial-stack counter-atom solution-atom)
      (println "found" (count @solution-atom) "solutions")
      @solution-atom)))

;; Playground

;; (def s (find-anagram-sentences parsed-wordlist3000 "angelamerkel"))
;; s

;; (def parsed-wordlist3000 (parsed-3000-wordlist))
;; parsed-wordlist3000
;; (def parsed-wordlist (parsed-en-wordlist))

;; (def subanagrams (find-subanagrams parsed-wordlist "motherthermo"))

;; (def goodness-list (calculate-goodness subanagrams))
;; (def parsed-query (word-to-set "motherthermo"))

;; (def counter-atom (atom 1))
;; (def solution-atom (atom '()))
;; (def small-gd-list goodness-list)
;; (def initial-stack (create-initial-stack small-gd-list))
;; initial-stack

;; (_find-anagram-sentences parsed-query small-gd-list initial-stack counter-atom solution-atom)

;; (vec @solution-atom)

