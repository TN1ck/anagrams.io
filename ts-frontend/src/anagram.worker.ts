import * as anagram from './anagram';

const ctx: Worker = self as any;

function serializeAnagramStep(step: anagram.AnagramGeneratorStep): anagram.AnagramGeneratorStepSerialized {
  return {
    solutions: step.solutions.map(s => s[0].slice().reverse()),
    numberOfPossibilitiesChecked: step.numberOfPossibilitiesChecked
  };
}

ctx.addEventListener('message', (message) => {

  if (message.data.type !== 'start') {
    return;
  }

  const data: {
    query: string;
    subanagrams: anagram.Word[];
    subanagram: anagram.Word;
    nextWorkerIndex: number;
  } = message.data;

  const {query, subanagrams, subanagram, nextWorkerIndex} = data;
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
        const lastTimeSend = serializeAnagramStep(state);
        lastTimeSendDate = +(new Date());
        ctx.postMessage(lastTimeSend);
        state.solutions = [];
        state.numberOfPossibilitiesChecked = 0;
      }
  }

  const serializedState = serializeAnagramStep(state);
  (serializedState as any).nextWorkerIndex = nextWorkerIndex;
  ctx.postMessage(serializedState);
  ctx.postMessage('finish');
  // self.close();
});
