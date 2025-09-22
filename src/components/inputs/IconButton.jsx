function IconButton({
  isActive, onClick, title, as: Icon,
  iconClassName = 'size-5', ...rest
}) {
  return (
    <button
      className={[
        'inline-flex gap-1 items-center py-0.5 px-1',
        'font-bold transition cursor-pointer',
        isActive
          ? 'dark:text-lime-500 dark:hover:text-lime-300'
          : 'dark:text-neutral-300 dark:hover:text-sky-500'
      ].join(' ')}
      onClick={onClick}
      title={title}
      {...rest}
    >
      {Icon && <Icon className={iconClassName} />}
    </button>
  );
}

export default IconButton;
