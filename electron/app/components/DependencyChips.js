/* eslint-disable react/prop-types */
import React from 'react';
import Chip from '@material-ui/core/Chip';

export default function DependencyChips(props) {
  // eslint-disable-next-line react/prop-types
  const { dependencies } = props;
  const chips = [];
  dependencies.forEach((d, index) => {
    const domKey = `chip-${index}`;
    chips.push(<Chip label={d} key={domKey} />);
  });
  return <div> {chips}</div>;
}
