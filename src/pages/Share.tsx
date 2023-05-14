import React from "react";
import { observer, inject } from "mobx-react";

import { AnagramState } from "../state";
import * as Components from "../components";
import { MARGIN_RAW } from "src/theme";

const About = inject("store")(
  observer(
    class About extends React.Component<{
      store?: AnagramState;
    }> {
      componentWillmount() {
        this.props.store!.setShareWords();
      }
      componentDidMount() {
        this.props.store!.setShareWords();
      }
      render() {
        const store = this.props.store;
        return (
          <div>
            <Components.Header
              style={{
                paddingBottom: MARGIN_RAW.m2,
                background: "transparent",
              }}
            >
              <Components.InnerContainer style={{ maxWidth: 670 }}>
                <Components.Title>{"Share"}</Components.Title>
              </Components.InnerContainer>
            </Components.Header>
            <Components.InnerContainer style={{ maxWidth: 740 }}>
              <Components.AnagramVisualizer
                asBlock
                anagram={store!.modalAnagram}
                word={store!.modalWord}
                save={store!.saveAnagram}
              />
            </Components.InnerContainer>
          </div>
        );
      }
    }
  )
);

export default About;
