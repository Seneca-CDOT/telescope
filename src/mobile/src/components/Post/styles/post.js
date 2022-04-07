const baseStyles = {
  fontFamily: 'PT Serif, serif',
  fontSize: 18,
  letterSpacing: 0.5,
  lineHeight: 18,
  textAlign: 'left',
};

const tagsStyles = {
  code: {
    fontSize: 12,
    fontFamily: "Menlo, Consolas, Monaco, 'Liberation Mono', 'Lucida Console', monospace",
    borderRadius: 3,
  },
  p: {
    margin: 16,
  },
  pre: {
    fontSize: 15,
    lineHeight: 15,
    maxWidth: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  q: {
    lineHeight: 1.5,
    marginVertical: 10,
    marginLeft: 50,
    paddingLeft: 15,
    display: 'block',
    fontStyle: 'italic',
  },
  blockquote: {
    lineHeight: 15,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 50,
    paddingLeft: 15,
    display: 'block',
    fontStyle: 'italic',
  },
  img: {
    margin: '0 auto',
    maxHeight: 80,
    paddingTop: 20,
    paddingBottom: 16,
    display: 'block',
    height: 'auto',
  },
  h1: {
    fontSize: 24,
    marginLeft: 10,
    lineHeight: 25,
  },
};

export { tagsStyles, baseStyles };
