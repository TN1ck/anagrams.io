import * as React from 'react';
import styled from 'styled-components';
import Header from 'src/components/Header';
import Title from 'src/components/Title';
import InnerContainer from 'src/components/InnerContainer';
import * as performanceTest from 'src/performance/performance';
import {postPerformance} from 'src/api';

const ResultContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 4px;
  margin-top: 20px;
  box-shadow: 0 5px 20px rgba(25,17,34,0.1);
`;

const PerformanceResult: React.StatelessComponent<{result: performanceTest.Performance}> = ({result}) => {
  return (
    <ResultContainer>
      executed: {result.executed.toISOString()}
      <br/>
      start: {result.start}ms
      <br/>
      end: {result.end}ms
      <br/>
      time: {result.timeNeeded}ms
    </ResultContainer>
  );
}

const StartButtonContainer = styled.div`
  margin: 20px;
  display: flex;
  justify-content: center;
`;

const StartButton = styled.button`
  background: none;
  color: white;
  padding: 10px;
  font-size: 14px;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;

class PerformancePage extends React.Component<{}, {
  performances: any[];
}> {
  constructor(props) {
    super(props);
    this.state = {
      performances: [],
    };
  }
  testPerformance() {
    const test = performanceTest.testPerformanceOne();
    postPerformance(test);
    const performances = this.state.performances;
    this.setState({
      performances: [test, ...performances],
    });
  }
  render() {
    return (
      <div>
        <Header>
          <InnerContainer>
            <Title>
              {'Performance'}
            </Title>
          </InnerContainer>
        </Header>
        <InnerContainer>
          <StartButtonContainer>
            <StartButton onClick={() => this.testPerformance()}>
              {'Start Performance Test'}
            </StartButton>
          </StartButtonContainer>
          {this.state.performances.map((p, i) => {
            return (
              <PerformanceResult result={p} key={i}/>
            );
          })}
        </InnerContainer>
      </div>
    );
  }
}

export default PerformancePage;