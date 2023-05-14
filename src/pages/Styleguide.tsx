import React from "react";
import styled from "styled-components";
import * as Components from "src/components";
import AnagramResults from "src/molecules/AnagramResults";
import { THEME } from "src/theme";

const Card = styled.div`
  margin-bottom: ${THEME.margins.m2};
  background-color: #fff;
  padding: ${THEME.margins.m2};
  box-shadow: ${THEME.dropShadow.s1};
  position: relative;
`;

class StyleguideComponent extends React.Component<any> {
  render() {
    return (
      <Card>
        <div>{this.props.description}</div>
        <div>{this.props.children}</div>
      </Card>
    );
  }
}

class StyleguideSection extends React.Component<any> {
  render() {
    return (
      <div>
        <Components.SubTitle>{this.props.description}</Components.SubTitle>
        {this.props.children}
      </div>
    );
  }
}

class Styleguide extends React.Component {
  render() {
    return (
      <div>
        <Components.Header>
          <Components.InnerContainer>
            <Components.Title>{"Styleguide"}</Components.Title>
          </Components.InnerContainer>
        </Components.Header>
        <Components.InnerContainer>
          <StyleguideSection
            description={
              "Typographie styles that are used throughout the page."
            }
          >
            <StyleguideComponent description={"Page Header"}>
              <Components.Title>{"This is a test title"}</Components.Title>
            </StyleguideComponent>
            <StyleguideComponent description={"Subtitle"}>
              <Components.SubTitle>
                {"This is a test title with a "}
                <strong>{"strong"}</strong>
                {" inside"}
              </Components.SubTitle>
            </StyleguideComponent>
            <StyleguideComponent description={"Small Title"}>
              <Components.SmallTitle>
                {"This is a a small title"}
              </Components.SmallTitle>
            </StyleguideComponent>
          </StyleguideSection>

          <Components.SubTitle>{"Layout"}</Components.SubTitle>
        </Components.InnerContainer>
        <div>
          <StyleguideComponent
            description={"Inner container, creates a container"}
          >
            <Components.InnerContainer>
              <div
                style={{
                  background: THEME.colors.secondary,
                  width: "100%",
                  height: 50,
                }}
              ></div>
            </Components.InnerContainer>
          </StyleguideComponent>
          <StyleguideComponent
            description={"Header container, creates a smaller container"}
          >
            <Components.HeaderContainer>
              <div
                style={{
                  background: THEME.colors.secondary,
                  width: "100%",
                  height: 50,
                }}
              ></div>
            </Components.HeaderContainer>
          </StyleguideComponent>

          <StyleguideComponent
            description={
              "Header, creates a colored block that centers the content"
            }
          >
            <Components.Header>{"Share"}</Components.Header>
          </StyleguideComponent>
        </div>

        <Components.InnerContainer>
          <StyleguideSection description={"Buttons"}>
            <StyleguideComponent description={"SmallButton"}>
              <Components.SmallButton active>
                {"Small Active Button"}
              </Components.SmallButton>
              <Components.SmallButton active={false}>
                {"Small Inactive Button"}
              </Components.SmallButton>
            </StyleguideComponent>

            <StyleguideComponent description={"Share Button"}>
              <Components.MutedButton>{"Share"}</Components.MutedButton>
            </StyleguideComponent>
          </StyleguideSection>

          <StyleguideSection description={"Visualizer"}>
            <Components.AnagramVisualizer
              anagram={"Oscar Wilde"}
              word={"Cowards Lie"}
            />
          </StyleguideSection>

          <StyleguideSection description={"Searchbar"}>
            <StyleguideComponent description={" "}>
              <Components.SearchBar
                onChange={() => 2}
                onSubmit={() => 2}
                value={"wurst"}
                disabled={false}
              />
            </StyleguideComponent>
          </StyleguideSection>

          <StyleguideSection description={"Loading Bar"}>
            <Components.LoadingBar progress={50} />
          </StyleguideSection>

          <StyleguideSection description={"Anagram Results"}>
            <AnagramResults />
          </StyleguideSection>
        </Components.InnerContainer>
      </div>
    );
  }
}

export default Styleguide;
