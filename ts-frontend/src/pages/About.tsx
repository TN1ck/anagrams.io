import * as React from 'react';
import * as Components from '../components';
import {ProfilesContainer, Profile} from '../components/Profile';

class About extends React.Component {
  render() {
    return (
      <div>
        <div style={{paddingTop: 20}}>
        </div>
        <Components.InnerContainer>
          <div
            dangerouslySetInnerHTML={{
              __html: `
                <h1>About</h1>
                <p>
                  We created <a href="https://anagrams.io">anagrams.io</a> with the intention to provide the best anagram finder in the world to the world.
                  We hope you'll have as much fun as we did exploring the anagrams.
                </p>

                <p>This project was build by Tom Nick and Taisia Tikhnovetskaya.</p>
              `
            }}
          />
          <ProfilesContainer>
            <Profile avatar={'http://via.placeholder.com/150x150'}>
              <p>
              {`Tom is a software engineer by heart and loves to build products.
              He's always up for a technical challenge and to try out new technologies, but also likes to improve his UX and Design skills.`}
              </p>
              <p>
                {' Tom is currently working as Head of Software Engineering at the '}
                <a href="https://infographics.group">{'infographics.group'}</a>
                {', where he leads a team to create next gen storytelling tools.'}
              </p>
            </Profile>
            <Profile avatar={'http://via.placeholder.com/150x150'}>
              <p>
                {`When Taisia is not drawing furiously on her iPad, she's probably creating beats in Logic - just everything to create an amazing story.
                Taisia helped to create key visuals and the UX. She was also a great motivation.`}
              </p>
              <p>
                {`Taisia is currently employeed as a infographis trainee at the `}
                <a href="https://infographics.group">{'infographics.group'}</a>
                {`, where she's creating amazing stories to enable knowledge.`}
              </p>
            </Profile>
          </ProfilesContainer>
        </Components.InnerContainer>
      </div>
    );
  }
}

export default About;
