import React from "react";
import ReactModal from "react-modal";
import styled from "styled-components";
import { THEME } from "src/theme";

import { Card } from "./Layout";

const TriggerButton = styled.button`
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-decoration: underline;
`;

const ModalCard = styled(Card)`
  width: calc(100vw - ${THEME.margins.m4});
  max-width: 760px;
  max-height: calc(100vh - ${THEME.margins.m4});
  overflow-y: auto;
  padding: ${THEME.margins.m4};

  h2,
  h3 {
    margin: 0 0 ${THEME.margins.m2};
  }

  p,
  address {
    margin: 0 0 ${THEME.margins.m3};
    line-height: 1.6;
  }

  address {
    font-style: normal;
  }

  @media (max-width: 899px) {
    width: calc(100vw - ${THEME.margins.m3});
    max-height: calc(100vh - ${THEME.margins.m3});
    padding: ${THEME.margins.m3};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${THEME.margins.m3};
  margin-bottom: ${THEME.margins.m3};
`;

const LastUpdated = styled.p`
  color: ${THEME.colors.foregroundText};
  font-size: ${THEME.font.sizeSmall};
`;

const CloseButton = styled.button`
  padding: ${THEME.margins.m1} ${THEME.margins.m2};
  border: 1px solid ${THEME.colors.border};
  background: ${THEME.colors.backgroundBright};
  color: ${THEME.colors.foregroundText};
  cursor: pointer;
  font: inherit;
`;

const LegalNotice = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      ReactModal.setAppElement("body");
    }
  }, []);

  return (
    <>
      <TriggerButton type="button" onClick={() => setIsOpen(true)}>
        {"Imprint & Privacy Policy"}
      </TriggerButton>

      <ReactModal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 100,
          },
          content: {
            padding: 0,
            background: "none",
            border: "none",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <ModalCard>
          <ModalHeader>
            <div>
              <h2>{"Imprint & Privacy Policy"}</h2>
              <LastUpdated>{"Last updated: April 5, 2026"}</LastUpdated>
            </div>

            <CloseButton type="button" onClick={() => setIsOpen(false)}>
              {"Close"}
            </CloseButton>
          </ModalHeader>

          <h3>{"Imprint"}</h3>
          <p>
            {
              "Information pursuant to Section 5 DDG and controller within the meaning of Art. 4(7) GDPR:"
            }
          </p>
          <address>
            {"Tom Nick"}
            <br />
            {"Oudenarder Str. 24"}
            <br />
            {"13347 Berlin"}
            <br />
            {"Germany"}
            <br />
            <a href="mailto:tomwanick@gmail.com">{"tomwanick@gmail.com"}</a>
          </address>
          <p>
            {
              "This website is a private personal website. It does not provide commercial services or journalistic-editorial content."
            }
          </p>

          <h3>{"Privacy Policy"}</h3>
          <p>
            {
              "The protection of personal data is important to me. Personal data is processed on this website only to the extent necessary for operating the site, providing it technically, and handling communication by email."
            }
          </p>

          <h3>{"Hosting and Technical Provision"}</h3>
          <p>
            {
              "This website is provided via Cloudflare Pages. When you access the website, technically necessary connection data may be processed, in particular IP address, date and time, requested content, browser information, and protocol data. This processing is carried out to ensure the secure and stable delivery of the website."
            }
          </p>
          <p>
            {
              "The legal basis is Art. 6(1)(f) GDPR. The legitimate interest lies in the secure provision and technical operation of this website."
            }
          </p>

          <h3>{"Cloudflare Web Analytics"}</h3>
          <p>
            {
              "Cloudflare Web Analytics is currently integrated on the production site of anagrams.io. This loads a script from Cloudflare that collects pseudonymous usage and performance data in order to measure usage and website performance."
            }
          </p>
          <p>
            {
              "According to Cloudflare, this script does not use cookies and does not access localStorage or sessionStorage. In a recent check of the production site, no cookies were set for either anagrams.io or cloudflareinsights.com."
            }
          </p>
          <p>
            {
              "The legal basis is Art. 6(1)(f) GDPR. The legitimate interest lies in aggregated traffic measurement and technical optimization of this website."
            }
          </p>

          <h3>{"Contact by Email"}</h3>
          <p>
            {
              "If you contact me by email, I process the information you provide solely for the purpose of handling your request and any follow-up questions."
            }
          </p>
          <p>
            {
              "The legal basis is Art. 6(1)(b) GDPR insofar as your request is related to a contract or pre-contractual measures; otherwise the legal basis is Art. 6(1)(f) GDPR."
            }
          </p>

          <h3>{"Your Rights"}</h3>
          <p>
            {
              "Under the applicable legal provisions, you have the right to access, rectification, erasure, restriction of processing, data portability, and to object to the processing of your personal data."
            }
          </p>
          <p>
            {
              "You also have the right to lodge a complaint with a data protection supervisory authority."
            }
          </p>

          <h3>{"External Links"}</h3>
          <p>
            {
              "This website contains links to external websites, for example GitHub or LinkedIn. Their respective operators are solely responsible for the content of and data processing on those linked websites."
            }
          </p>
        </ModalCard>
      </ReactModal>
    </>
  );
};

export default LegalNotice;
