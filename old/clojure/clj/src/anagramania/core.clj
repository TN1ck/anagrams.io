

(ns anagramania.core
  (:require [ring.adapter.jetty :refer [run-jetty]]
            [ring.middleware.file :refer [wrap-file]]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.middleware.cors :refer [wrap-cors]]
            [ring.middleware.json :refer [wrap-json-response]]
            [ring.util.response :refer [redirect]]
            [compojure.core :refer [defroutes GET]]
            [compojure.route :as route]
            [clojure.java.io :as io]
            [anagramania.anagram :as anagram])
  (:gen-class))

(defonce web-server (atom nil))
(defonce parsed-wordlist (anagram/parsed-en-wordlist))
(defonce parsed-wordlist (anagram/parsed-en-wordlist))

(defn start-web-server! [handler]
  (reset! web-server (run-jetty handler {:port 3000 :join? false})))

(defroutes routes
  (GET "/" [] (redirect "/index.html"))
  (GET "/anagram/:word" [word] (anagram/find-anagrams parsed-wordlist word))
  (GET "/subanagram/:word" [word] (anagram/find-subanagrams parsed-wordlist word))
  (GET "/anagram-sentences/:word" [word] (anagram/find-anagram-sentences parsed-wordlist word)))

(def web-handler
  (wrap-json-response (wrap-cors routes
             :access-control-allow-origin [#"http://localhost:3001"]
             :access-control-allow-methods [:get :put :post :delete])))

;; (defn web-handler [request]
;;   (when (= (:uri request) "/")
;;     (redirect "/index.html")))

(defn dev-main []
  (when-not @web-server
    (.mkdirs (io/file "frontend"))
    (start-web-server! (wrap-file web-handler "frontend"))))

(defn -main [& args]
  (start-web-server! (wrap-resource web-handler "frontend")))

