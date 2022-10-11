import React from 'react';
import { injectIntl } from 'react-intl';

const InputComponent = ({ intl }) => {
  const placeholder = intl.formatMessage({id: 'banner.search'});
  return(
     <input placeholder={placeholder} />
  );
}


export default injectIntl(InputComponent);