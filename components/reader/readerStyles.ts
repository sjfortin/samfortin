import { ReactReaderStyle } from 'react-reader';

export const darkReaderStyles = {
  ...ReactReaderStyle,
  container: {
    ...ReactReaderStyle.container,
    background: '#09090b',
  },
  readerArea: {
    ...ReactReaderStyle.readerArea,
    background: '#09090b',
  },
  reader: {
    ...ReactReaderStyle.reader,
    background: '#18181b',
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    display: 'none',
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    display: 'none',
  },
  arrow: {
    ...ReactReaderStyle.arrow,
    color: '#71717a',
    background: 'transparent',
  },
  arrowHover: {
    ...ReactReaderStyle.arrowHover,
    color: '#fafafa',
    background: 'rgba(255,255,255,0.1)',
  },
};
