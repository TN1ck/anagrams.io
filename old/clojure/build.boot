(set-env!
  :source-paths #{"src/clj"}
  :resource-paths #{"resources"}
  :dependencies '[[adzerk/boot-cljs "1.7.228-2" :scope "test"]
                  [adzerk/boot-reload "0.4.12" :scope "test"]
                  ; project deps
                  [org.clojure/clojure "1.8.0"]
                  [ring "1.5.1"]
                  [ring-cors "0.1.11"]
                  [ring/ring-json "0.4.0"]
                  [org.clojure/data.csv "0.1.4"]
                  [lein-light-nrepl "0.3.3"]
                  [compojure "1.6.0"]])

(task-options!
  pom {:project 'anagramania
       :version "1.0.0-SNAPSHOT"
       :description "FIXME: write description"}
  aot {:namespace #{'anagramania.core}}
  jar {:main 'anagramania.core})

(require
  '[adzerk.boot-reload :refer [reload]]
  'anagramania.core)

(deftask run []
  (comp
    (watch)
    (target)
    (with-pass-thru _
      (anagramania.core/dev-main))))

(deftask build []
  (comp
    (aot)
    (pom)
    (uber)
    (jar)
    (target)))

(swap! boot.repl/*default-dependencies*
       concat '[[lein-light-nrepl "0.3.3"]])

(swap! boot.repl/*default-middleware*
       conj 'lighttable.nrepl.handler/lighttable-ops)
