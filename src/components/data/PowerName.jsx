import { powers, isPower } from '../../lib/elite';


function PowerName({ name, short, ...rest }) {
  if (isPower(name)) {
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
