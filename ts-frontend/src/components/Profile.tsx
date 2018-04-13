import * as React from 'react';
import styled from 'styled-components';
import {THEME} from 'src/theme';

export const ProfilesContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const ProfileContainer = styled.div`
  width: 300px;
  margin: ${THEME.margins.m2};
`;

const ProfileImage = styled.img`
  width: 300px;
`;

export class Profile extends React.Component<{
  avatar: string;
}> {
  render() {
    return (
      <ProfileContainer>
        <ProfileImage src={this.props.avatar}/>
        {this.props.children}
      </ProfileContainer>
    );
  }
}
