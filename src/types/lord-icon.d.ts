declare namespace JSX {
    interface IntrinsicElements {
      'lord-icon': {
        src: string;
        trigger?: string;
        delay?: string;
        style?: React.CSSProperties;
        colors?: string;
        state?: string;
        target?: string;
        stroke?: string | number;
        scale?: string | number;
        morphColors?: Record<string, string>;
        playerColor?: string;
        [key: string]: string | number | Record<string, string> | React.CSSProperties | undefined;
      }
    }
  }