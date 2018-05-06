import React from 'react';
import * as Components from '../components';
import {MARGIN_RAW} from 'src/theme';
import {ProfilesContainer, Profile} from '../components/Profile';
import tom from 'src/assets/tom.svg';
import taisia from 'src/assets/taisia.svg';

import {Card} from 'src/components/Layout';

class About extends React.Component {
  render() {
    return (
      <div>
        <Components.Header style={{paddingBottom: MARGIN_RAW.m2, background: 'transparent'}}>
          <Components.InnerContainer style={{maxWidth: 670}}>
            <Components.Title>
              {'About'}
            </Components.Title>
          </Components.InnerContainer>
        </Components.Header>
        <Components.InnerContainer style={{maxWidth: 740}}>
        <Card>
          <div
            dangerouslySetInnerHTML={{
              __html: `
                <p style="margin-top: 0;">
                  We created <a class="link" href="https://anagrams.io">anagrams.io</a> with the intention to provide the best anagram finder in the world, to the world.
                  We hope you'll have as much fun as we did exploring the anagrams.
                </p>

                <p>This project was build by Tom Nick and Taisia Tikhnovetskaya.</p>
              `
            }}
          />
          <ProfilesContainer>
            <Profile avatar={tom} style={{marginRight: MARGIN_RAW.m2}}>
              <p>
              {`Tom is a software engineer by heart and loves to build products.
              He's always up for a technical challenge and to try out new technologies, but also likes to improve his UX and design skills.`}
              </p>
              <p>
                {' Tom is currently working as Head of Software Engineering at the '}
                <a className="link" href="https://infographics.group">{'infographics.group'}</a>
                {', where he leads a team to create next gen storytelling tools.'}
              </p>
            </Profile>
            <Profile avatar={taisia} style={{marginLeft: MARGIN_RAW.m2}}>
              <p>
                {`When Taisia is not drawing furiously on her iPad, she's probably creating beats in Logic - just everything to create an amazing story.
                Taisia helped to create key visuals and the UX. She was also a great motivation.`}
              </p>
              <p>
                {`Taisia is currently employeed as a infographis trainee at the `}
                <a className="link" href="https://infographics.group">{'infographics.group'}</a>
                {`, where she's creating amazing stories to teach about complex topics.`}
              </p>
            </Profile>
          </ProfilesContainer>
          <div
            dangerouslySetInnerHTML={{
              __html: `
                When you have questions, <a class="link" href="mailto:tomwanick@gmail.com">go ahead and contact us</a>.
              `
            }}
          />
        </Card>
        </Components.InnerContainer>
      </div>
    );
  }
}

export default About;
