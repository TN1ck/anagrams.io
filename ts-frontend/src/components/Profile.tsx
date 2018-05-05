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
  // margin: ${THEME.margins.m2};

  @media (max-width: 400px) {
    margin-left: 0;
    margin-right: 0;
  }
`;

const ProfileImage = styled.img`
  height: 280px;
  width: 280px;
`;

export class Profile extends React.Component<{
  avatar: string;
  style: any;
}> {
  render() {
    return (
      <ProfileContainer style={this.props.style}>
        <ProfileImage
          src={this.props.avatar}
        />
        {this.props.children}
      </ProfileContainer>
    );
  }
}
