import React from "react";
import * as Components from "../components";
import { MARGIN_RAW, THEME } from "src/theme";
import { ResultBestOf } from "src/components/AnagramResult";

const BEST_OF_DATA_ENGLISH = [
  {
    word: "Vladimir Putin",
    anagram: "I invalid Trump",
  },
  // {
  //   word: 'Oscar Wilde',
  //   anagram: 'Cowards Lie'
  // },
  {
    word: "United States of America",
    anagram: "Administrates a cute foe",
  },
  {
    word: "Russian Federation",
    anagram: "Infantries aroused",
  },
  {
    word: "Friendzone",
    anagram: "I end frozen",
  },
  {
    word: "Americans",
    anagram: "Can armies",
  },
  {
    word: "Germany",
    anagram: "My anger",
  },
  {
    word: "Paradise",
    anagram: "A despair",
  },
  {
    word: "Christianity",
    anagram: "Hi tiny racist",
  },
  {
    word: "Make a selfie",
    anagram: "Same fake lie",
  },
  {
    word: "We won this",
    anagram: "Now we shit",
  },
];

const BEST_OF_DATA_GERMAN = [
  {
    word: "Bundesregierung",
    anagram: "Unsre Beerdigung",
  },
  {
    word: "Angela Merkel",
    anagram: "Klare Maengel",
  },
  {
    word: "Albert Einstein",
    anagram: "Internatsliebe",
  },
  {
    word: "Martin Schulz",
    anagram: "Schmilzt Uran",
  },
  {
    word: "Franz Josef Strauss",
    anagram: "Erfasst Sonjas Furz",
  },
  {
    word: "Jan Boehmermann",
    anagram: "Ehrenmann am Job",
    foundBy: "Schulzenbrothers",
    link: "https://www.reddit.com/r/de/comments/8mpqaq/hey_brudis_ich_habe_diesen_anagrammfinder_gebaut/dzprme2",
  },
  {
    word: "Alternative für Deutschland",
    anagram: "Aufrüttelnder Vitalschaden",
    foundBy: "Schulzenbrothers",
    link: "https://www.reddit.com/r/de/comments/8mpqaq/hey_brudis_ich_habe_diesen_anagrammfinder_gebaut/dzprme2",
  },
  {
    word: "Bundesagentur fuer Arbeit",
    anagram: "Stadtruinen, Feuer, Bergbau",
    foundBy: "Schulzenbrothers",
    link: "https://www.reddit.com/r/de/comments/8mpqaq/hey_brudis_ich_habe_diesen_anagrammfinder_gebaut/dzprme2",
  },
  {
    word: "I am lord Voldemort",
    anagram: "Dralle Omi vorm Tod",
    foundBy: "Brisanzbremse",
    link: "https://www.reddit.com/r/de/comments/8mpqaq/hey_brudis_ich_habe_diesen_anagrammfinder_gebaut/dzpeiwu",
  },
  {
    word: "Edmund Stoiber",
    anagram: "Bierdunst Demo",
    link: "https://www.reddit.com/r/de/comments/8mpqaq/hey_brudis_ich_habe_diesen_anagrammfinder_gebaut/dzqbx16",
    foundBy: "EHEC",
  },
  {
    word: "Frank-Walter Steinmeier",
    anagram: "Kasernenleiter: warm & fit",
    link: "https://www.reddit.com/r/de/comments/8mpqaq/hey_brudis_ich_habe_diesen_anagrammfinder_gebaut/dzqbx16",
    foundBy: "EHEC",
  },
  {
    word: "Markus Soeder",
    anagram: "Ausserdem Ork",
    link: "https://www.reddit.com/r/de/comments/8mpqaq/hey_brudis_ich_habe_diesen_anagrammfinder_gebaut/dzqbx16",
    foundBy: "EHEC",
  },
  {
    word: "Krieg der Sterne",
    anagram: "Erst Nerd-Kriege",
    foundBy: "Brisanzbremse",
    link: "https://www.reddit.com/r/de/comments/8mpqaq/hey_brudis_ich_habe_diesen_anagrammfinder_gebaut/dzpeiwu",
  },
  {
    word: "Karl Theodor zu Guttenberg",
    anagram: "Ganzer Betrug! Doktor heult.",
    foundBy: "Brisanzbremse",
    link: "https://www.reddit.com/r/de/comments/8mpqaq/hey_brudis_ich_habe_diesen_anagrammfinder_gebaut/dzpeiwu",
  },
  {
    word: "Bundeskanzlerin",
    anagram: "Bankzinsenluder",
    link: "https://www.reddit.com/r/de/comments/8mpqaq/hey_brudis_ich_habe_diesen_anagrammfinder_gebaut/dzpuj4t",
    foundBy: "523Oliver",
  },
  {
    word: "Vereinigte Arabische Emirate",
    anagram: "Geheimnisverraeter Abtei CIA",
    link: "https://www.reddit.com/r/de/comments/8mpqaq/hey_brudis_ich_habe_diesen_anagrammfinder_gebaut/dzqfq3v",
    foundBy: "Lipsia",
  },
  {
    word: "Nordrhein-Westfalen",
    anagram: "Freilanderntenshow",
    link: "https://www.reddit.com/r/de/comments/8mpqaq/hey_brudis_ich_habe_diesen_anagrammfinder_gebaut/dzqfq3v",
    foundBy: "Lipsia",
  },
  {
    word: "Stadt Muenchen",
    anagram: "Demnaechst tun",
    link: "https://www.reddit.com/r/de/comments/8mpqaq/hey_brudis_ich_habe_diesen_anagrammfinder_gebaut/dzr7haq",
    foundBy: "DasSkelett",
  },
  {
    word: "Freie Demokratische Partei",
    anagram: "Dachpartei fies roter Keime",
    foundBy: "Baerenfell",
    link: "https://www.reddit.com/r/de/comments/8mpqaq/hey_brudis_ich_habe_diesen_anagrammfinder_gebaut/dzrmlo7",
  },
  {
    word: "Piratenpartei",
    anagram: "Trainierte App",
    foundBy: "PZon",
    link: "https://www.reddit.com/r/de/comments/8mpqaq/hey_brudis_ich_habe_diesen_anagrammfinder_gebaut/dzroa6i",
  },
];

class About extends React.Component {
  render() {
    return (
      <div>
        <Components.Header
          style={{ paddingBottom: MARGIN_RAW.m2, background: "transparent" }}
        >
          <Components.InnerContainer style={{ maxWidth: 670 }}>
            <Components.Title>{"Best Of"}</Components.Title>
          </Components.InnerContainer>
        </Components.Header>
        <Components.InnerContainer style={{ maxWidth: 740 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              margin: -10,
            }}
          >
            <Components.SubTitleContainer>
              <Components.SubTitle>{"English"}</Components.SubTitle>
            </Components.SubTitleContainer>
            {BEST_OF_DATA_ENGLISH.map(({ word, anagram }, i) => {
              return <ResultBestOf key={i} anagram={anagram} word={word} />;
            })}
            <Components.SubTitleContainer>
              <Components.SubTitle>{"German"}</Components.SubTitle>
            </Components.SubTitleContainer>
            {BEST_OF_DATA_GERMAN.map(({ word, anagram, foundBy, link }, i) => {
              return (
                <ResultBestOf
                  key={i}
                  anagram={anagram}
                  word={word}
                  foundBy={foundBy}
                  link={link}
                />
              );
            })}
            <Components.SubTitleContainer
              style={{ textAlign: "center", marginTop: THEME.margins.m4 }}
            >
              <a className="link" href="mailto:tomwanick@gmail.com">
                Found a cool anagram? Send it to us!
              </a>
            </Components.SubTitleContainer>
          </div>
        </Components.InnerContainer>
      </div>
    );
  }
}

export default About;
