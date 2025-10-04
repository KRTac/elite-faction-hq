import { powers } from '../../lib/elite';


function PowerName({ name, short, ...rest }) {
  if (name && powers[name]) {
    const power = powers[name];

    return (
      <span
        style={{ color: power.color }}
        title={short ? name : undefined}
        {...rest}
      >
        {short ? power.shortened : name}
      </span>
    );
  }

  return name;
}

export default PowerName;
