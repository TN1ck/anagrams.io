import * as anagram from './anagram';

const ctx: Worker = self as any;

function serializeAnagramStep(step: anagram.AnagramGeneratorStep): anagram.AnagramGeneratorStepSerialized {
  return {
    solutions: step.solutions.map(s => {
      return s.list.map(w => w.index).reverse();
    }),
    numberOfPossibilitiesChecked: step.numberOfPossibilitiesChecked
  };
}

ctx.addEventListener('message', (message) => {

  if (message.data.type !== 'start') {
    return;
  }

  const data: {
    query: string;
    subanagrams: anagram.IndexedWord[];
    subanagram: anagram.IndexedWord;
  } = message.data;

  const {query, subanagrams, subanagram} = data;
  const anagramSolver = anagram.findAnagramSentencesForSubAnagram(query, subanagrams, subanagram);

  const {generator} = anagramSolver;
  
  let state: anagram.AnagramGeneratorStep = {
    solutions: [],
    numberOfPossibilitiesChecked: 0,
  };
  let lastTimeSendDate = +(new Date());

  const MINIMUM_TIME = 200;

  for (let stateStep of generator) {
    state.solutions = state.solutions.concat(stateStep.solutions);
    state.numberOfPossibilitiesChecked += stateStep.numberOfPossibilitiesChecked;
    const currentDate = +(new Date());
    const diff = currentDate - lastTimeSendDate;
    if (diff > MINIMUM_TIME
      ) {
        // const lastTimeSend = serializeAnagramStep(state);
        lastTimeSendDate = +(new Date());
        // ctx.postMessage(lastTimeSend);
      }
  }

  ctx.postMessage(serializeAnagramStep(state));
  ctx.postMessage('finish');
  self.close()
  
});