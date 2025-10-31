import React from 'react';

type Props = {
  name: string;
  color: string;
};

const TagBadge: React.FC<Props> = ({ name, color }) => (
  <span
    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
    style={{ backgroundColor: color, color: '#fff' }}
  >
    {name}
  </span>
);

export default TagBadge;
