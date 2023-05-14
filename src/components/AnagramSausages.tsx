import React from "react";
import { drawPath, EasingFunctions } from "src/utility";
import { getAnagramMapping } from "src/anagram";
import { interpolateArray } from "d3-interpolate";

interface AnagramSausagesProps {
  anagram: string;
  word: string;
  height: number;
  wordWidth: number;
  characterWidth: number;
  characterHeight: number;
  paddingTop: number;
  strokeWidth: number;
  animationDuration?: number;
  letterOffsets?: Array<{ x: number; y: number }>;
}

interface AnagramSausage {
  pathData: number[];
  strokeWidth: number;
  opacity: number;
}

export default class AnagramSausages extends React.Component<
  AnagramSausagesProps,
  {
    sausages: AnagramSausage[];
  }
> {
  componentIsMounted: boolean = false;
  constructor(props: AnagramSausagesProps) {
    super(props);
    const sausages = this.calculateSausages(props);
    this.state = {
      sausages,
    };
  }
  componentWillMount() {
    this.componentIsMounted = true;
  }
  componentWillUnmount() {
    this.componentIsMounted = false;
  }
  componentWillReceiveProps(newProps: AnagramSausagesProps) {
    if (
      newProps.anagram !== this.props.anagram ||
      newProps.word !== this.props.word
    ) {
      const newSausages = this.calculateSausages(newProps);
      const oldSausages = this.state.sausages;
      this.animateSausages(oldSausages, newSausages);
      // this.animateToProgress(oldSausages, newSausages, 0.2);
    }
  }
  animateToProgress(
    oldSausages: AnagramSausage[],
    newSausages: AnagramSausage[],
    progress: number
  ) {
    const interpolatedSausages = oldSausages.map((s, i) => {
      const newSausage = newSausages[i];
      const pathInterpolator = interpolateArray(
        s.pathData,
        newSausage.pathData
      );
      return pathInterpolator;
    });
    const newInterpolatedSausages = oldSausages.map((s, i) => {
      const interpolator = interpolatedSausages[i];
      return {
        ...s,
        pathData: interpolator(progress),
      };
    });
    this.setState({ sausages: newInterpolatedSausages });
  }
  animateSausages(
    oldSausages: AnagramSausage[],
    newSausages: AnagramSausage[]
  ) {
    const interpolatedSausages = oldSausages.map((s, i) => {
      const newSausage = newSausages[i];
      const pathInterpolator = interpolateArray(
        s.pathData,
        newSausage.pathData
      );
      return pathInterpolator;
    });
    const animationDuration = this.props.animationDuration || 500;
    const startTime = +new Date();
    const updater = () => {
      if (!this.componentIsMounted) {
        return;
      }
      const now = +new Date();
      const diff = now - startTime;
      const progress = diff / animationDuration;
      if (progress < 1.0) {
        const newInterpolatedSausages = oldSausages.map((s, i) => {
          const interpolator = interpolatedSausages[i];
          return {
            ...s,
            pathData: interpolator(EasingFunctions.easeInOutQuad(progress)),
          };
        });
        this.setState({ sausages: newInterpolatedSausages });
        requestAnimationFrame(updater);
      } else {
        this.setState({ sausages: newSausages });
      }
    };
    updater();
  }
  calculateSausages(props: AnagramSausagesProps): AnagramSausage[] {
    const {
      height,
      characterWidth,
      word,
      anagram,
      characterHeight,
      paddingTop,
      strokeWidth,
    } = props;
    const mapping = getAnagramMapping(word, anagram);

    const opacityScale = (index: number) => {
      return 0.2 + (0.8 / word.length) * (word.length - index);
    };

    const values = mapping.map((newIndex, index) => {
      if (newIndex === undefined) {
        // TODO: If this happens, it breaks.
        return null;
      }
      const x1 = index * characterWidth + characterWidth / 2;
      const y1 = 0;
      const x2 = newIndex * characterWidth + characterWidth / 2;
      const y2 = height;
      const opacity = opacityScale(index);
      const yOffset = paddingTop + (characterHeight / 2) * index;
      return {
        opacity,
        strokeWidth,
        pathData: [x1, y1, x2, y2, yOffset],
      };
    });
    return values as AnagramSausage[];
  }

  render() {
    const { height, wordWidth } = this.props;

    return (
      <svg height={height} width={wordWidth} style={{ overflow: "visible" }}>
        {this.state.sausages.map((d, index) => {
          if (d === null) {
            return;
          }
          const { strokeWidth, opacity, pathData } = d;
          const [x1, y1, x2, y2, yOffset] = pathData;
          let letterOffset = { x: 0, y: 0 };
          if (this.props.letterOffsets) {
            const letterOffsetFromProp = this.props.letterOffsets[index];
            if (letterOffsetFromProp) {
              letterOffset.x = letterOffsetFromProp.x;
              letterOffset.y = letterOffsetFromProp.y;
            }
          }
          const path = drawPath(
            x1,
            y1,
            x2 + letterOffset.x,
            y2 + letterOffset.y,
            yOffset,
            strokeWidth
          );
          return (
            <path
              key={index}
              opacity={opacity}
              stroke="black"
              fill="transparent"
              strokeWidth={strokeWidth}
              d={path}
            />
          );
        })}
      </svg>
    );
  }
}
