import * as anagram from './anagram';

const ctx: Worker = self as any;

ctx.addEventListener('message', (message) => {
  console.log('in webworker', message);
  ctx.postMessage('this is the response ' + message.data);
  const data = message.data;
  const {query, subanagrams} = data;
  const generators = anagram.findAnagramSentences(query, subanagrams);
  const initialState = anagram.angagramIteratorStateFactory(generators);
  
  function* getSolutions (state: anagram.AnagramIteratorState) {
    
    while (!state.breakLoop && state.unsolvedGenerators.length !== 0) {
      
      // console.log(state.counter, state);
      
      let currentGenerators = state.currentGenerators;
      let unsolvedGenerators = state.unsolvedGenerators;
      let solvedGenerators = state.solvedGenerators;

      if (currentGenerators.length === 0) {
        currentGenerators = [state.unsolvedGenerators.shift()];
      }

      currentGenerators = currentGenerators.filter((g) => {
        const value = g.generator.next();
        state.counter++;
        if (!value || value.done) {
          solvedGenerators.push(g);
          return false;
        }
        if (value.value.solution) {
          state.solutions.push(value.value.current);
          state.numberOfPossibilitiesChecked = value.value.numberOfPossibilitiesChecked;
        }
        return true;
      });

      if (currentGenerators.length === 0) {
        currentGenerators = [state.unsolvedGenerators.shift()];
      }
      
      state.unsolvedGenerators = unsolvedGenerators;
      state.solvedGenerators = solvedGenerators;
      state.currentGenerators = currentGenerators;
      yield state;
      
    }
  };
  
  const mainGenerator = getSolutions({...initialState});
  this.mainGenerator = mainGenerator;
  
  let state: anagram.AnagramIteratorState = null;
  let lastTimeSend: anagram.SerializedAnagramIteratorState = null;
  let lastTimeSendDate = +(new Date());

  const MINIMUM_TIME = 100;

  for (state of mainGenerator) {
    const currentDate = +(new Date());
    const diff = currentDate - lastTimeSendDate;
    if (lastTimeSend === null ||
        diff > MINIMUM_TIME &&
        ((lastTimeSend.counter + 2500) < state.counter ||
        lastTimeSend.solutions.length !== state.solutions.length ||
        lastTimeSend.currentSubanagrams.map(c => c.index).join(',') !== state.currentGenerators.map(c => c.subanagram.index).join(','))
      ) {
        lastTimeSend = anagram.serializeAnagramIteratorStateFactor(state);
        lastTimeSendDate = +(new Date());
        ctx.postMessage(lastTimeSend);
      }
  }

  ctx.postMessage(anagram.serializeAnagramIteratorStateFactor(state));
  
});