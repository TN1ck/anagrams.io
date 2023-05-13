interface SpellingBeeResponse {
  success: boolean;
  words: string[];
}

const SERVER_URL = process.env.NODE_ENV === 'production' ? 'https://api.anagrams.io' : 'http://localhost:3005';

export async function getSpellingBeeSolutions(mustLetters: string, allowedLetters: string): Promise<SpellingBeeResponse> {
  try {
    const res = await fetch(`${SERVER_URL}/spellingbee?mustLetters=${mustLetters}&allowedLetters=${allowedLetters}`, {
      method: 'GET',
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (res.status === 200) {
      return res.json();
    } else {
      return {success: false, words: []};
    }
  } catch (e: any) {
    return {success: false, words: []};
  }
}
