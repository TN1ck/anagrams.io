import React from 'react';
import styled from 'styled-components';
import {THEME} from 'src/theme';

export const ProfilesContainer = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
`;

const ProfileContainer = styled.div`
  max-width: 300px;
  width: 100%;
  margin: ${THEME.margins.m2};
`;

const ProfileImage = styled.img`
  width: 100%;
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
