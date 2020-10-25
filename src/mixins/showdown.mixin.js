import showdown from 'showdown';

export default {
  data() {
    const converter = new showdown.Converter({
      simplifiedAutoLink: true,
      excludeTrailingPunctuationFromURLs: true,
      literalMidWordUnderscores: true,
      literalMidWordAsterisks: true,
      strikethrough: true,
      tables: true,
      disableForced4SpacesIndentedSublists: true,
      simpleLineBreaks: true,
      openLinksInNewWindow: true,
    });

    converter.setFlavor('github');

    return {
      converter,
    };
  },
  methods: {
    makeHtml(markdown) {
      return this.converter.makeHtml(markdown);
    },
  },
};
