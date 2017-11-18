import * as anagram from './anagram';

const ctx: Worker = self as any;


let workerState = {
  running: false,
};

ctx.addEventListener('message', (message) => {

  if (message.data.type !== 'start') {
    return;
  }

  if (message.data.type === 'pause') {
    console.log('PAUSE');
    workerState.running = false;
    return;
  }

  workerState.running = true;
  const data = message.data;
  const {query, subanagrams} = data;
  const generators = anagram.findAnagramSentences(query, subanagrams);
  const initialState = anagram.angagramIteratorStateFactory(generators);
  
  function* getSolutions (state: anagram.AnagramIteratorState) {
    
    while (!state.breakLoop && state.unsolvedGenerators.length !== 0) {
      
      let currentGenerators = state.currentGenerators;
      let solvedGenerators = state.solvedGenerators;

      if (currentGenerators.length === 0) {
        currentGenerators.push(state.unsolvedGenerators.shift());
      }

      currentGenerators = currentGenerators.filter((g) => {
        // let i = 0;
        // for (; i <= 1000; i++) {
          const value = g.generator.next();
          state.counter++;
          if (!value || value.done) {
            solvedGenerators.push(g);
            return false;
          }
          state.solutions = state.solutions.concat(value.value.solutions);
          state.numberOfPossibilitiesChecked += value.value.numberOfPossibilitiesChecked;
        // }
        return true;
      });

      if (currentGenerators.length === 0) {
        currentGenerators = [state.unsolvedGenerators.shift()];
      }

      state.currentGenerators = currentGenerators;
      yield state;
      
    }
  };
  
  const mainGenerator = getSolutions({...initialState});
  this.mainGenerator = mainGenerator;
  
  let state: anagram.AnagramIteratorState = null;
  let lastTimeSend: anagram.SerializedAnagramIteratorState = null;
  let lastTimeSendDate = +(new Date());

  const MINIMUM_TIME = 200;

  for (state of mainGenerator) {
    const currentDate = +(new Date());
    const diff = currentDate - lastTimeSendDate;
    if (lastTimeSend === null ||
        diff > MINIMUM_TIME
      ) {
        lastTimeSend = anagram.serializeAnagramIteratorStateFactor(state);
        lastTimeSendDate = +(new Date());
        ctx.postMessage(lastTimeSend);
      }
    
      if (!workerState.running) {
        break;
      }
  }

  ctx.postMessage(anagram.serializeAnagramIteratorStateFactor(state));
  ctx.postMessage('finish');
  
});