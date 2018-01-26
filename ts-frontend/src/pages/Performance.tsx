import * as React from 'react';
import styled from 'styled-components';

import {
  Title,
  InnerContainer,
  Header,
} from 'src/components';

import * as performanceTest from 'src/performance/performance';
import {postPerformance, getPerformances} from 'src/api';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';


// const data = [
//   {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
//   {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
//   {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
//   {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
//   {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
//   {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
//   {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
// ];

const SimpleBarChart: React.StatelessComponent<{performances: performanceTest.Performance[]}> = ({performances}) => {

  const data = performances.map((p) => {
    return {
      name: p.executed,
      timeNeeded: p.timeNeeded,
      max: p.timeNeeded,
    };
  });

  return (
    <Card>
      <div style={{height: 300}}>
        <ResponsiveContainer>
          <BarChart height={300} data={data}
                margin={{top: 5, right: 0, left: 0, bottom: 5}}>
            <XAxis dataKey="name"/>
            <YAxis unit={'ms'} />
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Legend />
            <Bar dataKey="timeNeeded" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};


const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 4px;
  margin-top: 20px;
  box-shadow: 0 5px 20px rgba(25,17,34,0.1);
`;

const PerformanceResult: React.StatelessComponent<{result: performanceTest.Performance}> = ({result}) => {
  return (
    <Card>
      executed: {result.executed}
      <br/>
      start: {result.start}ms
      <br/>
      end: {result.end}ms
      <br/>
      time: {result.timeNeeded}ms
    </Card>
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
  componentDidMount() {
    getPerformances().then(result => {
      const data = result.data;
      if (data && data.success) {
        this.setState({
          performances: data.performances,
        });
      }
    })
  }
  testPerformance() {
    const test = performanceTest.testPerformanceOne();
    postPerformance(test).then(result => {
      const data = result.data;
      if (data && data.success) {
        this.setState({
          performances: data.performances,
        });
      }
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
          <SimpleBarChart
            performances={this.state.performances}
          />
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